import React from 'react';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => (
  <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow">
    <div className="font-bold text-xl">URL Shortener</div>
    <div>
      {isAuthenticated ? (
        <button
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
          onClick={onLogout}
        >
          Logout
        </button>
      ) : null}
    </div>
  </nav>
);

export default Navbar;
