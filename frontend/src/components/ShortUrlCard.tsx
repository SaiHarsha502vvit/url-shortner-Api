import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getQRCode } from '../services/api';

interface ShortUrlCardProps {
  shortId: string;
  originalUrl: string;
}

const ShortUrlCard: React.FC<ShortUrlCardProps> = ({ shortId, originalUrl }) => {
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const shortUrl = `http://localhost:5000/api/urls/${shortId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShowQR = async () => {
    setLoading(true);
    const res = await getQRCode(shortId);
    // Type assertion to specify the expected structure of res.data
    setQr((res.data as { qrCode: string }).qrCode);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="bg-gradient-to-br from-black via-gray-900 to-red-900 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-4 border border-red-700 max-w-lg mx-auto mt-8"
    >
      <div className="text-white text-lg font-bold tracking-wide mb-2">Your Shortened URL</div>
      <div className="flex items-center gap-2">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-400 font-mono underline text-xl hover:text-red-300 transition"
        >
          {shortUrl}
        </a>
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={handleCopy}
          className="ml-2 px-3 py-1 bg-red-600 text-white rounded shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        >
          {copied ? 'Copied!' : 'Copy'}
        </motion.button>
      </div>
      <div className="text-gray-300 text-sm break-all">{originalUrl}</div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleShowQR}
        className="mt-2 px-4 py-2 bg-black bg-opacity-60 text-red-300 rounded-lg border border-red-700 shadow hover:bg-opacity-80 transition"
      >
        Show QR Code
      </motion.button>
      {loading && <div className="w-32 h-32 bg-gray-800 animate-pulse rounded-lg mt-2" />}
      {qr && (
        <motion.img
          src={qr}
          alt="QR Code"
          className="w-32 h-32 rounded-lg border-2 border-red-700 bg-white mt-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        />
      )}
    </motion.div>
  );
};

export default ShortUrlCard;
