import React, { useState } from 'react';

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
  const [qrModal, setQrModal] = useState<{ open: boolean; qr?: string; shortId?: string }>({ open: false });
  const [qrLoading, setQrLoading] = useState(false);

  const handleShowQR = async (shortId: string) => {
    setQrLoading(true);
    setQrModal({ open: true, qr: undefined, shortId });
    try {
      const res = await import('../services/api').then(m => m.getQRCode(shortId));
      const qrData = (res.data as { qrCode: string }).qrCode;
      setQrModal({ open: true, qr: qrData, shortId });
    } finally {
      setQrLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-black bg-opacity-80 rounded shadow-md text-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-white drop-shadow-lg">Your Shortened URLs</h2>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {!loading && !error && urls.length === 0 && <div className="text-center">No URLs found.</div>}
      {!loading && !error && urls.length > 0 && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-900">
              <th className="border-b p-2 text-left text-white">Short URL</th>
              <th className="border-b p-2 text-left text-white">Original URL</th>
              <th className="border-b p-2 text-left text-white">Expiration</th>
              <th className="border-b p-2 text-left text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((item) => (
              <tr key={item._id} className="hover:bg-gray-800 transition-colors duration-200">
                <td className="p-2 text-red-400 underline">
                  <a href={`http://localhost:5000/api/urls/${item.shortId}`} target="_blank" rel="noopener noreferrer">
                    {item.shortId}
                  </a>
                </td>
                <td className="p-2 break-all text-gray-200">{item.originalUrl}</td>
                <td className="p-2 text-gray-300">{item.expirationDate && item.expirationDate !== 'null' ? new Date(item.expirationDate).toLocaleString() : 'Never'}</td>
                <td className="p-2 space-x-2">
                  <button className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 text-white" onClick={() => onCopy(item.shortId)}>Copy</button>
                  <button className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800" onClick={() => onAnalytics(item.shortId)}>Analytics</button>
                  <button className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700" onClick={() => onUpdate(item)}>Update</button>
                  <button className="bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800" onClick={() => onDelete(item.shortId)}>Delete</button>
                  <button className="bg-green-700 text-white px-2 py-1 rounded hover:bg-green-800" onClick={() => handleShowQR(item.shortId)}>QR</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* QR Modal */}
      {qrModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative flex flex-col items-center">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={() => setQrModal({ open: false })}>&times;</button>
            <div className="text-black font-bold mb-2">QR Code for <span className="text-red-600">{qrModal.shortId}</span></div>
            {qrLoading ? (
              <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-lg mt-2" />
            ) : qrModal.qr ? (
              <img src={qrModal.qr} alt="QR Code" className="w-32 h-32 rounded-lg border-2 border-red-700 bg-white mt-2" />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlList;
