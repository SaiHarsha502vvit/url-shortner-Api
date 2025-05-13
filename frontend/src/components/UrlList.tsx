import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleCopy = (shortId: string) => {
    onCopy(shortId);
    setCopiedId(shortId);
    setTimeout(() => setCopiedId(null), 1200);
  };

  const handleDelete = async (shortId: string) => {
    setDeletingId(shortId);
    await onDelete(shortId);
    setTimeout(() => setDeletingId(null), 500);
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
            <AnimatePresence>
              {urls.map((item) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: deletingId === item.shortId ? 0 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="hover:bg-gray-800 transition-colors duration-200"
                >
                  <td className="p-2 text-red-400 underline">
                    <a href={`http://localhost:5000/api/urls/${item.shortId}`} target="_blank" rel="noopener noreferrer">
                      {item.shortId}
                    </a>
                  </td>
                  <td className="p-2 break-all text-gray-200">{item.originalUrl}</td>
                  <td className="p-2 text-gray-300">{item.expirationDate && item.expirationDate !== 'null' ? new Date(item.expirationDate).toLocaleString() : 'Never'}</td>
                  <td className="p-2 space-x-2 flex flex-wrap gap-2">
                    {/* Copy Button */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCopy(item.shortId)}
                      className="relative bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 focus:outline-none"
                    >
                      {copiedId === item.shortId ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1.2, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute right-2 top-1 text-green-400"
                        >
                          ✔️
                        </motion.span>
                      ) : (
                        'Copy'
                      )}
                    </motion.button>
                    {/* Analytics Button */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => onAnalytics(item.shortId)}
                      className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800 focus:outline-none shadow"
                    >
                      <span role="img" aria-label="analytics">📊</span> Analytics
                    </motion.button>
                    {/* Update Button */}
                    <motion.button
                      whileHover={{ rotate: 15 }}
                      whileTap={{ rotate: -15, scale: 0.95 }}
                      onClick={() => onUpdate(item)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 focus:outline-none shadow"
                    >
                      <span role="img" aria-label="update">🔄</span> Update
                    </motion.button>
                    {/* Delete Button */}
                    <motion.button
                      whileTap={{ x: [0, -5, 5, -5, 0] }}
                      onClick={() => handleDelete(item.shortId)}
                      className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800 focus:outline-none shadow"
                    >
                      <span role="img" aria-label="delete">🗑️</span> Delete
                    </motion.button>
                    {/* QR Button */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleShowQR(item.shortId)}
                      className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800 focus:outline-none shadow"
                    >
                      <span role="img" aria-label="qr">📎</span> QR
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      )}
      {/* QR Modal */}
      <AnimatePresence>
        {qrModal.open && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 relative flex flex-col items-center">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={() => setQrModal({ open: false })}>&times;</button>
              <div className="text-black font-bold mb-2">QR Code for <span className="text-red-600">{qrModal.shortId}</span></div>
              {qrLoading ? (
                <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-lg mt-2" />
              ) : qrModal.qr ? (
                <img src={qrModal.qr} alt="QR Code" className="w-32 h-32 rounded-lg border-2 border-red-700 bg-white mt-2" />
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UrlList;
