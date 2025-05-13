import React from 'react';

interface ClickHistoryItem {
  timestamp: string;
}

interface AnalyticsModalProps {
  open: boolean;
  onClose: () => void;
  shortId: string;
  originalUrl: string;
  clickHistory: ClickHistoryItem[];
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ open, onClose, shortId, originalUrl, clickHistory }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h3 className="text-xl font-bold mb-2">Analytics for <span className="text-blue-600">{shortId}</span></h3>
        <div className="mb-2 text-sm text-gray-600 break-all">Original URL: {originalUrl}</div>
        <div className="mb-4 text-sm text-gray-600">Total Clicks: {clickHistory.length}</div>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="border-b p-2 text-left text-amber-400">Click Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {clickHistory.length === 0 ? (
                <tr><td className="p-2 text-center text-red-700">No clicks yet.</td></tr>
              ) : (
                clickHistory.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 text-red-700">{`👆 No  ${idx+1} On ${new Date(item.timestamp).toLocaleString()}`}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;
