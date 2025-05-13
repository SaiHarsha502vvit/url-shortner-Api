import React, { useState, useEffect, useCallback } from 'react';
import AuthForm from './components/AuthForm';
import ShortenUrlForm from './components/ShortenUrlForm';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import type { AnalyticsItem } from './components/AnalyticsDashboard';
import Navbar from './components/Navbar';
import UrlList from './components/UrlList';
import type { UrlItem } from './components/UrlList';
import AnalyticsModal from './components/AnalyticsModal';
import { register, login, shortenUrl, getAnalytics, updateUrl, deleteUrl, getUrlAnalytics } from './services/api';
import type { AxiosError } from 'axios';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [shortenLoading, setShortenLoading] = useState(false);
  const [shortenError, setShortenError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsItem[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New state for user's URLs
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [urlsLoading, setUrlsLoading] = useState(false);
  const [urlsError, setUrlsError] = useState<string | null>(null);

  // Analytics modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalShortId, setModalShortId] = useState<string>('');
  const [modalOriginalUrl, setModalOriginalUrl] = useState<string>('');
  const [modalClickHistory, setModalClickHistory] = useState<{ timestamp: string }[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Update modal state (simple prompt for now)
  const handleUpdate = async (url: UrlItem) => {
    const newOriginalUrl = prompt('Update original URL:', url.originalUrl);
    if (!newOriginalUrl) return;
    setUrlsLoading(true);
    setUrlsError(null);
    try {
      if (!token) throw new Error('Not authenticated');
      await updateUrl(url.shortId, { originalUrl: newOriginalUrl }, token);
      setSuccessMsg('URL updated!');
      fetchUserUrls();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setUrlsError(axiosErr.response?.data?.message || 'Failed to update URL');
      } else {
        setUrlsError('Failed to update URL');
      }
    } finally {
      setUrlsLoading(false);
    }
  };

  // Delete URL
  const handleDelete = async (shortId: string) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;
    setUrlsLoading(true);
    setUrlsError(null);
    try {
      if (!token) throw new Error('Not authenticated');
      await deleteUrl(shortId, token);
      setSuccessMsg('URL deleted!');
      fetchUserUrls();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setUrlsError(axiosErr.response?.data?.message || 'Failed to delete URL');
      } else {
        setUrlsError('Failed to delete URL');
      }
    } finally {
      setUrlsLoading(false);
    }
  };

  // Copy short URL
  const handleCopy = (shortId: string) => {
    const url = `http://localhost:5000/api/urls/${shortId}`;
    navigator.clipboard.writeText(url);
    setSuccessMsg('Short URL copied to clipboard!');
  };

  // Open analytics modal for a URL
  const handleAnalytics = async (shortId: string) => {
    setModalOpen(true);
    setModalShortId(shortId);
    setModalLoading(true);
    setModalError(null);
    try {
      if (!token) throw new Error('Not authenticated');
      const res = await getUrlAnalytics(shortId, token);
      const data = (res.data as { data: { originalUrl: string; clickHistory: { timestamp: string }[] } }).data;
      setModalOriginalUrl(data.originalUrl);
      setModalClickHistory(data.clickHistory || []);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setModalError(axiosErr.response?.data?.message || 'Failed to load analytics');
      } else {
        setModalError('Failed to load analytics');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalShortId('');
    setModalOriginalUrl('');
    setModalClickHistory([]);
    setModalError(null);
  };

  // Fetch user's URLs
  const fetchUserUrls = useCallback(async () => {
    setUrlsLoading(true);
    setUrlsError(null);
    try {
      if (!token) throw new Error('Not authenticated');
      // For demo, reuse analytics endpoint as backend does not have /urls GET for user
      const res = await getAnalytics(token);
      const data = res.data as AnalyticsItem[];
      setUrls(data.map((item) => ({ ...item, _id: item.shortId })));
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setUrlsError(axiosErr.response?.data?.message || 'Failed to load URLs');
      } else {
        setUrlsError('Failed to load URLs');
      }
    } finally {
      setUrlsLoading(false);
    }
  }, [token]);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      if (!token) throw new Error('Not authenticated');
      const res = await getAnalytics(token);
      setAnalytics(res.data as AnalyticsItem[]);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setAnalyticsError(axiosErr.response?.data?.message || 'Failed to load analytics');
      } else {
        setAnalyticsError('Failed to load analytics');
      }
    } finally {
      setAnalyticsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchAnalytics();
      fetchUserUrls();
    }
  }, [token, fetchAnalytics, fetchUserUrls]);

  const handleAuth = async (
    type: 'login' | 'register',
    data: { username: string; password: string; email?: string }
  ) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (type === 'register') {
        await register(data);
        setSuccessMsg('Registration successful! Please log in.');
      } else {
        const res = await login(data);
        const tokenValue = (res.data as { token: string }).token;
        setToken(tokenValue);
        localStorage.setItem('token', tokenValue);
        setSuccessMsg(null);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setAuthError(axiosErr.response?.data?.message || 'Authentication failed');
      } else {
        setAuthError('Authentication failed');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleShorten = async (data: { originalUrl: string; customAlias?: string; expiration?: string }) => {
    setShortenLoading(true);
    setShortenError(null);
    try {
      if (!token) throw new Error('Not authenticated');
      await shortenUrl(data, token);
      setSuccessMsg('Short URL created!');
      fetchAnalytics();
      fetchUserUrls();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setShortenError(axiosErr.response?.data?.message || 'Failed to shorten URL');
      } else {
        setShortenError('Failed to shorten URL');
      }
    } finally {
      setShortenLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setAnalytics([]);
    setUrls([]);
    setSuccessMsg(null);
  };

  // Notification auto-dismiss
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isAuthenticated={!!token} onLogout={handleLogout} />
      <div className="container mx-auto px-4 py-8">
        {!token ? (
          <AuthForm onAuth={handleAuth} loading={authLoading} error={authError} />
        ) : (
          <>
            <ShortenUrlForm onShorten={handleShorten} loading={shortenLoading} error={shortenError} />
            {successMsg && <div className="text-green-600 text-center mt-4">{successMsg}</div>}
            <UrlList
              urls={urls}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onAnalytics={handleAnalytics}
              loading={urlsLoading}
              error={urlsError}
            />
            <AnalyticsDashboard analytics={analytics} loading={analyticsLoading} error={analyticsError} />
            <AnalyticsModal
              open={modalOpen}
              onClose={closeModal}
              shortId={modalShortId}
              originalUrl={modalOriginalUrl}
              clickHistory={modalClickHistory}
            />
            {modalLoading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-40"><div className="bg-white p-4 rounded shadow">Loading analytics...</div></div>}
            {modalError && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-40"><div className="bg-white p-4 rounded shadow text-red-600">{modalError}</div></div>}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
