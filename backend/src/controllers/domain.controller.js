import Domain from '../models/domain.model.js';
import { nanoid } from 'nanoid';

// Add a new custom domain
export const addDomain = async (req, res) => {
  const { domain } = req.body;
  const user = req.user._id;
  try {
    const verificationToken = nanoid(16);
    const newDomain = new Domain({ domain, user, verificationToken });
    await newDomain.save();
    res.status(201).json({ message: 'Domain added. Please verify ownership.', data: newDomain });
  } catch (error) {
    res.status(500).json({ message: 'Error adding domain', error });
  }
};

// Verify domain ownership (user must add a TXT record or file)
export const verifyDomain = async (req, res) => {
  const { domain, token } = req.body;
  try {
    const domainEntry = await Domain.findOne({ domain });
    if (!domainEntry) return res.status(404).json({ message: 'Domain not found' });
    if (domainEntry.verificationToken !== token) return res.status(400).json({ message: 'Invalid verification token' });
    domainEntry.verified = true;
    await domainEntry.save();
    res.status(200).json({ message: 'Domain verified', data: domainEntry });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying domain', error });
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
  const { domain } = req.body;
  const user = req.user._id;
  try {
    const result = await Domain.findOneAndDelete({ domain, user });
    if (!result) return res.status(404).json({ message: 'Domain not found' });
    res.status(200).json({ message: 'Domain removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing domain', error });
  }
};
