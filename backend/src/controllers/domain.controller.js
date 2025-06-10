import Domain from '../models/domain.model.js';
import { nanoid } from 'nanoid';
import dns from 'dns';
import util from 'util';

const resolveTxt = util.promisify(dns.resolveTxt);

// Add a new custom domain
export const addDomain = async (req, res) => {
  const { domain } = req.body;
  const user = req.user._id; // Assuming req.user is populated by auth middleware

  if (!domain) {
    return res.status(400).json({ message: 'Domain name is required.' });
  }

  try {
    const existingDomain = await Domain.findOne({ domain });
    if (existingDomain && existingDomain.verified) {
      return res.status(409).json({ message: 'Domain already verified by another user.' });
    }
    if (existingDomain && existingDomain.user.toString() !== user.toString()) {
        // If domain exists but not verified and belongs to another user, allow current user to claim it
        // by deleting the old one. Or, decide on a different policy.
        // For now, let's prevent adding if it exists unverified for another user.
         return res.status(409).json({ message: 'Domain is pending verification by another user.' });
    }
    
    // If the domain exists for the current user, just return the existing data
    if (existingDomain && existingDomain.user.toString() === user.toString()) {
        return res.status(200).json({ 
            message: 'Domain already added. Please verify if not already verified.', 
            data: existingDomain 
        });
    }

    const verificationToken = `urlshortener-verify=${nanoid(32)}`;
    const newDomain = new Domain({ domain, user, verificationToken });
    await newDomain.save();
    res.status(201).json({ 
        message: 'Domain added. Please add the following TXT record to your DNS settings to verify ownership.', 
        data: {
            domain: newDomain.domain,
            verificationToken: newDomain.verificationToken,
            verified: newDomain.verified
        }
    });
  } catch (error) {
    console.error("Error adding domain:", error);
    if (error.code === 11000) { // Duplicate key
        return res.status(409).json({ message: 'This domain has already been added.' });
    }
    res.status(500).json({ message: 'Error adding domain. Please try again later.' });
  }
};

// Verify domain ownership
export const verifyDomain = async (req, res) => {
  const { domain } = req.body; // Token from request body is the domain name to verify
  const user = req.user._id;

  if (!domain) {
    return res.status(400).json({ message: 'Domain name is required for verification.' });
  }

  try {
    const domainEntry = await Domain.findOne({ domain, user });

    if (!domainEntry) {
      return res.status(404).json({ message: 'Domain not found for this user. Please add it first.' });
    }

    if (domainEntry.verified) {
      return res.status(200).json({ message: 'Domain already verified.', data: domainEntry });
    }

    const expectedToken = domainEntry.verificationToken;

    try {
      const records = await resolveTxt(domain);
      // records is an array of arrays of strings, e.g., [['v=spf1...'], ['another-txt-record']]
      // Some DNS providers might wrap TXT records in quotes or split them.
      const txtRecordFound = records.some(recordParts => 
        recordParts.some(part => part.trim() === expectedToken)
      );

      if (txtRecordFound) {
        domainEntry.verified = true;
        domainEntry.verificationToken = undefined; // Remove token once verified
        await domainEntry.save();
        res.status(200).json({ message: 'Domain verified successfully!', data: domainEntry });
      } else {
        res.status(400).json({ 
          message: `Verification failed. TXT record not found or does not match. Please ensure the TXT record with value "${expectedToken}" is correctly set for the domain "${domain}".`
        });
      }
    } catch (dnsError) {
      console.error("DNS resolution error:", dnsError);
      let errorMessage = 'Error resolving DNS records for the domain.';
      if (dnsError.code === 'ENOTFOUND') {
        errorMessage = 'Domain not found. Please ensure the domain name is correct and accessible.';
      } else if (dnsError.code === 'ENODATA') {
        errorMessage = `No TXT records found for ${domain}. Please add the required TXT record.`;
      }
      res.status(500).json({ message: errorMessage, details: dnsError.code });
    }
  } catch (error) {
    console.error("Error verifying domain:", error);
    res.status(500).json({ message: 'Error verifying domain. Please try again later.' });
  }
};

// List user's domains
export const listDomains = async (req, res) => {
  const user = req.user._id;
  try {
    const domains = await Domain.find({ user });
    res.status(200).json({ data: domains });
  } catch (error) {
    res.status(500).json({ message: 'Error listing domains', error });
  }
};

// Remove a domain
export const removeDomain = async (req, res) => {
  const { domainName } = req.params; // Changed to get domain from params for RESTfulness
  const user = req.user._id;

  if (!domainName) {
    return res.status(400).json({ message: 'Domain name is required.' });
  }

  try {
    const result = await Domain.findOneAndDelete({ domain: domainName, user });
    if (!result) {
      return res.status(404).json({ message: 'Domain not found or you do not have permission to remove it.' });
    }
    res.status(200).json({ message: 'Domain removed successfully.' });
  } catch (error) {
    console.error("Error removing domain:", error);
    res.status(500).json({ message: 'Error removing domain. Please try again later.' });
  }
};
