import React from 'react';

export type UrlItem = {
  _id: string;
  originalUrl: string;
  shortId: string;
  expirationDate?: string | null;
  clickHistory?: { timestamp: string }[];
};

interface UrlListProps {
  urls: UrlItem[];
  onCopy: (shortId: string) => void;
  onDelete: (shortId: string) => void;
  onUpdate: (url: UrlItem) => void;
  onAnalytics: (shortId: string) => void;
  loading: boolean;
  error: string | null;
}

const UrlList: React.FC<UrlListProps> = ({ urls, onCopy, onDelete, onUpdate, onAnalytics, loading, error }) => {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Shortened URLs</h2>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {!loading && !error && urls.length === 0 && <div className="text-center">No URLs found.</div>}
      {!loading && !error && urls.length > 0 && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">Short URL</th>
              <th className="border-b p-2 text-left">Original URL</th>
              <th className="border-b p-2 text-left">Expiration</th>
              <th className="border-b p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((item) => (
              <tr key={item._id}>
                <td className="p-2 text-blue-600 underline">
                  <a href={`http://localhost:5000/api/urls/${item.shortId}`} target="_blank" rel="noopener noreferrer">
                    {item.shortId}
                  </a>
                </td>
                <td className="p-2 break-all">{item.originalUrl}</td>
                <td className="p-2">{item.expirationDate ? new Date(item.expirationDate).toLocaleString() : 'Never'}</td>
                <td className="p-2 space-x-2">
                  <button className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300" onClick={() => onCopy(item.shortId)}>Copy</button>
                  <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => onAnalytics(item.shortId)}>Analytics</button>
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600" onClick={() => onUpdate(item)}>Update</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => onDelete(item.shortId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UrlList;
