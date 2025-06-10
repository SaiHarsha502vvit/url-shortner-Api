import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { addDomain, verifyDomain, listDomains, removeDomain } from '../services/api';
import { AxiosResponse } from 'axios'; // Assuming AxiosResponse is a named export

// Define a type for the domain object
interface Domain {
  _id?: string;
  domain: string;
  verified: boolean;
  verificationToken?: string;
}

// Define expected API response structures
interface ApiMessageResponse { // For responses that primarily return a message
    message: string;
}

interface AddDomainResponseData {
    domain: string;
    verificationToken?: string;
    verified: boolean;
    message?: string; // Include message here if addDomain sends it within data
}

interface ListDomainsResponseData {
    data: Domain[]; // Assuming API returns { data: Domain[] }
}

interface VerifyDomainResponseData extends Domain { // Assumes verify returns the updated Domain object
    message?: string;
}

interface DomainManagerProps {
  token: string;
  onClose: () => void;
}

const DomainManager: React.FC<DomainManagerProps> = ({ token, onClose }) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [verificationTokenInput, setVerificationTokenInput] = useState('');
  const [selectedDomainToVerify, setSelectedDomainToVerify] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDomains = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res: AxiosResponse<ListDomainsResponseData> = await listDomains(token);
      setDomains(res.data.data || []);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Error fetching domains. Please try again.');
      console.error(err);
      setDomains([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAddDomain = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    if (!token) { setMessage('Authentication token is missing.'); return; }
    if (!newDomain.trim()) { setMessage('Domain name cannot be empty.'); return; }
    setLoading(true);
    try {
      const response: AxiosResponse<AddDomainResponseData> = await addDomain(newDomain, token);
      const responseData = response.data;
      setMessage((responseData.message || 'Domain added.') + (responseData.verificationToken ? ` Your TXT token: ${responseData.verificationToken}` : ''));
      setNewDomain('');
      fetchDomains();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error adding domain.');
      console.error(error);
    }
    setLoading(false);
  };

  const handleVerifyDomain = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    if (!token || !selectedDomainToVerify) { setMessage('Token or domain not selected.'); return; }
    setLoading(true);
    try {
      // This call assumes `api.ts` verifyDomain(domainName: string, authToken: string)
      // and that it sends `{ domain: domainName }` in the POST body.
      const response: AxiosResponse<VerifyDomainResponseData> = await verifyDomain(selectedDomainToVerify, token);
      setMessage(response.data.message || 'Domain verified successfully!');
      setVerificationTokenInput('');
      setSelectedDomainToVerify('');
      fetchDomains();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error verifying domain. The TXT record might not be set or propagated yet.');
      console.error(error);
    }
    setLoading(false);
  };

  const handleRemoveDomain = async (domainToRemove: string) => {
    setMessage(null);
    if (!token) { setMessage('Authentication token is missing.'); return; }
    setLoading(true);
    try {
      const response: AxiosResponse<ApiMessageResponse> = await removeDomain(domainToRemove, token);
      setMessage(response.data.message || 'Domain removed successfully.');
      fetchDomains();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error removing domain.');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 sm:p-8 bg-gray-800 bg-opacity-90 rounded-lg shadow-xl text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">Custom Domains</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-150"
          aria-label="Close domain manager"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {message && (
        <div className={`p-3 mb-4 rounded-md text-sm ${message.includes('Error') || message.includes('failed') || message.startsWith('Token') || message.startsWith('Domain name') ? 'bg-red-700' : 'bg-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleAddDomain} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className="flex-1 px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400 transition-colors duration-150"
          type="text"
          placeholder="yourdomain.com"
          value={newDomain}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewDomain(e.target.value)}
          disabled={loading}
          required
        />
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Domain'}
        </button>
      </form>

      {domains.some((d: Domain) => !d.verified) && (
        <form onSubmit={handleVerifyDomain} className="flex flex-col sm:flex-row gap-3 mb-8 p-4 border border-gray-700 rounded-md bg-gray-700 bg-opacity-50">
          <select
            aria-label="Select domain to verify"
            className="flex-1 px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 text-white transition-colors duration-150"
            value={selectedDomainToVerify}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setSelectedDomainToVerify(e.target.value);
              // Clear the token input when domain selection changes, as the token is specific per addDomain call
              setVerificationTokenInput('');
            }}
            disabled={loading}
            required
          >
            <option value="">Select domain to verify</option>
            {domains.filter((d: Domain) => !d.verified).map((d: Domain) => (
              <option key={d.domain} value={d.domain}>{d.domain}</option>
            ))}
          </select>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-150 disabled:opacity-50"
            type="submit"
            disabled={loading || !selectedDomainToVerify}
          >
            {loading ? 'Verifying...' : 'Verify Selected Domain'}
          </button>
        </form>
      )}

      <div className="mb-3 font-semibold text-lg">Your Domains:</div>
      {loading && !domains.length && <p className='text-center text-gray-400'>Loading domains...</p>}
      {!loading && !domains.length && <p className='text-center text-gray-400'>No custom domains added yet.</p>}
      {domains.length > 0 && (
        <ul className="space-y-3">
          {domains.map((d: Domain) => (
            <li key={d._id || d.domain} className={`p-3 rounded-md flex items-center justify-between shadow ${d.verified ? 'bg-green-800 bg-opacity-70' : 'bg-yellow-800 bg-opacity-70'}`}>
              <div className='flex flex-col'>
                <span className="font-medium">{d.domain}</span>
                {d.verified ?
                  <span className="text-xs text-green-300">Verified</span> :
                  <span className="text-xs text-yellow-300">Pending Verification</span>
                }
                {!d.verified && d.verificationToken &&
                  <span className='text-xs text-gray-400 mt-1'>TXT Value: {d.verificationToken} (Add this to your DNS)</span>
                }
              </div>
              <button
                className="ml-4 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-150 disabled:opacity-50"
                onClick={() => handleRemoveDomain(d.domain)}
                disabled={loading}
              >
                {loading ? '...' : 'Remove'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DomainManager;
