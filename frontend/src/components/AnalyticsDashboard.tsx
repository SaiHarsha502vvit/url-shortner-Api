import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';

export interface AnalyticsItem {
  originalUrl: string;
  shortId: string;
  totalClicks: number;
  expirationDate?: string | null;
}

interface AnalyticsDashboardProps {
  analytics: AnalyticsItem[];
  loading: boolean;
  error: string | null;
  onAnalytics?: (shortId: string) => void;
}

const shimmer = (
  <div className="animate-pulse flex space-x-4">
    <div className="flex-1 h-6 bg-gray-200 rounded"></div>
    <div className="flex-1 h-6 bg-gray-200 rounded"></div>
    <div className="flex-1 h-6 bg-gray-200 rounded"></div>
    <div className="flex-1 h-6 bg-gray-200 rounded"></div>
  </div>
);

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics, loading, error, onAnalytics }) => {
  // Ensure analytics is always an array
  const safeAnalytics = Array.isArray(analytics) ? analytics : [];
  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-gradient-to-br from-black via-gray-900 to-red-900 rounded-2xl shadow-2xl border border-red-700 text-white">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-red-400 tracking-tight drop-shadow-lg">Analytics</h2>
      {loading && (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i}>{shimmer}</div>)}</div>
      )}
      {error && <div className="text-red-500 text-center mb-4 font-semibold animate-pulse">{error}</div>}
      {!loading && !error && safeAnalytics.length > 0 && (
        <>
          <div className="w-full h-72 mb-8 bg-black bg-opacity-60 rounded-xl p-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={safeAnalytics} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="shortId" stroke="#fff" tick={{ fill: '#fff', fontWeight: 700 }} />
                <YAxis stroke="#fff" tick={{ fill: '#fff', fontWeight: 700 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#222', color: '#fff', borderRadius: 8, border: 'none' }} cursor={{ fill: '#ef4444', opacity: 0.1 }} />
                <Bar dataKey="totalClicks" fill="#ef4444" radius={[8, 8, 0, 0]} isAnimationActive>
                  <LabelList dataKey="totalClicks" position="top" fill="#fff" fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-900">
                  <th className="border-b p-3 text-left font-semibold text-white">Short URL</th>
                  <th className="border-b p-3 text-left font-semibold text-white">Original URL</th>
                  <th className="border-b p-3 text-left font-semibold text-white">Total Clicks</th>
                  {onAnalytics && <th className="border-b p-3 text-left font-semibold text-white">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {safeAnalytics.map((item) => (
                  <tr
                    key={item.shortId}
                    className="hover:bg-gray-800 transition-colors duration-200"
                  >
                    <td className="p-3 text-red-400 underline">
                      <a href={`${import.meta.env.VITE_API_URL}/urls/${item.shortId}`} target="_blank" rel="noopener noreferrer">
                        {item.shortId}
                      </a>
                    </td>
                    <td className="p-3 break-all text-gray-200">{item.originalUrl}</td>
                    <td className="p-3 font-bold text-red-300">{item.totalClicks}</td>
                    {onAnalytics && (
                      <td className="p-3">
                        <button className="bg-gradient-to-r from-red-600 to-red-800 text-white px-3 py-1 rounded shadow hover:scale-105 hover:from-red-700 hover:to-red-900 transition-transform duration-200" onClick={() => onAnalytics(item.shortId)}>
                          View Details
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
