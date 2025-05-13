import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC<{ onShortenClick: () => void }> = ({ onShortenClick }) => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-[40vh] py-12 mb-8">
      {/* Animated background gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0 bg-gradient-to-br from-black via-red-900 to-gray-900 animate-gradient-x blur-2xl opacity-80"
      />
      <div className="relative z-10 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight text-center"
        >
          <span className="text-red-500">Live</span> URL Shortener
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-lg md:text-2xl text-gray-200 mb-8 text-center max-w-2xl"
        >
          Paste your long link below and get a beautiful, shareable short URL with analytics and QR code.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 0 4px #ef4444' }}
          whileTap={{ scale: 0.97 }}
          onClick={onShortenClick}
          className="px-8 py-3 bg-red-600 text-white font-bold rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-red-400 transition text-xl hover:bg-red-700"
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
};

export default Hero;
