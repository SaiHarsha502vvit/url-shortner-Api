import React from 'react';

export interface AnalyticsItem {
  originalUrl: string;
  shortId: string;
  totalClicks: number;
}

interface AnalyticsDashboardProps {
  analytics: AnalyticsItem[];
  loading: boolean;
  error: string | null;
  onAnalytics?: (shortId: string) => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics, loading, error, onAnalytics }) => {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Analytics</h2>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {!loading && !error && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">Short URL</th>
              <th className="border-b p-2 text-left">Original URL</th>
              <th className="border-b p-2 text-left">Total Clicks</th>
              {onAnalytics && <th className="border-b p-2 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {analytics.map((item) => (
              <tr key={item.shortId}>
                <td className="p-2 text-blue-600 underline">
                  <a href={`http://localhost:5000/api/urls/${item.shortId}`} target="_blank" rel="noopener noreferrer">
                    {item.shortId}
                  </a>
                </td>
                <td className="p-2 break-all">{item.originalUrl}</td>
                <td className="p-2">{item.totalClicks}</td>
                {onAnalytics && (
                  <td className="p-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => onAnalytics(item.shortId)}>
                      View Details
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
