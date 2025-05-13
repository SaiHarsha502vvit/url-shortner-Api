import React, { useState } from 'react';

interface ShortenUrlFormProps {
  onShorten: (data: { originalUrl: string; customAlias?: string; expiration?: string }) => void;
  loading: boolean;
  error: string | null;
}

const ShortenUrlForm: React.FC<ShortenUrlFormProps> = ({ onShorten, loading, error }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiration, setExpiration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShorten({ originalUrl, customAlias: customAlias || undefined, expiration: expiration || undefined });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Shorten a URL</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          type="url"
          placeholder="Original URL"
          value={originalUrl}
          onChange={e => setOriginalUrl(e.target.value)}
          required
        />
        <input
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          type="text"
          placeholder="Custom Alias (optional)"
          value={customAlias}
          onChange={e => setCustomAlias(e.target.value)}
        />
        <input
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          type="datetime-local"
          placeholder="Expiration Date (optional)"
          value={expiration}
          onChange={e => setExpiration(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Please wait...' : 'Shorten URL'}
        </button>
      </form>
    </div>
  );
};

export default ShortenUrlForm;
