import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AuthForm from './components/AuthForm';
import ShortenUrlForm from './components/ShortenUrlForm';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import type { AnalyticsItem } from './components/AnalyticsDashboard';
import Navbar from './components/Navbar';
import UrlList from './components/UrlList';
import type { UrlItem } from './components/UrlList';
import AnalyticsModal from './components/AnalyticsModal';
import { register, login, shortenUrl, getAnalytics, updateUrl, deleteUrl, getUrlAnalytics, getUserUrls } from './services/api';
import ShortUrlCard from './components/ShortUrlCard';
import Hero from './components/Hero';
import { isTokenExpired } from './services/jwt';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [shortenLoading, setShortenLoading] = useState(false);
  const [shortenError, setShortenError] = useState<string | null>(null);
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

  const [forceLogin, setForceLogin] = useState(false);
  const [registrationMsg, setRegistrationMsg] = useState<string | null>(null);

  const setAuthToken = (tokenValue: string | null) => {
    setToken(tokenValue);
    if (tokenValue) {
      localStorage.setItem('token', tokenValue);
    } else {
      localStorage.removeItem('token');
    }
  };

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
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setUrlsError(axiosErr?.response?.data?.message || 'Failed to update URL');
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
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setUrlsError(axiosErr?.response?.data?.message || 'Failed to delete URL');
      } else {
        setUrlsError('Failed to delete URL');
      }
    } finally {
      setUrlsLoading(false);
    }
  };

  // Copy short URL
  const handleCopy = (shortId: string) => {
    const url = `${import.meta.env.VITE_API_URL}/urls/${shortId}`; // Use VITE_API_URL
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
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setModalError(axiosErr?.response?.data?.message || 'Failed to load analytics');
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
      const res = await getUserUrls(token); // Use getUserUrls for user-specific URLs
      const data = res.data as UrlItem[];
      setUrls(data);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setUrlsError(axiosErr?.response?.data?.message || 'Failed to load URLs');
      } else {
        setUrlsError('Failed to load URLs');
      }
    } finally {
      setUrlsLoading(false);
    }
  }, [token]);

  const queryClient = useQueryClient();

  // Use React Query for analytics
  const {
    data: analyticsData = [],
    isLoading: analyticsLoading,
    isError: analyticsIsError,
    error: analyticsErrorObj,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ['analytics', token],
    queryFn: async () => {
      if (!token) throw new Error('Not authenticated');
      const res = await getAnalytics(token);
      return res.data as AnalyticsItem[];
    },
    enabled: !!token,
    refetchInterval: 3000, // background refetch every 3s
    staleTime: 5000, // cache for 5s
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (token) {
      fetchUserUrls();
    }
  }, [token, fetchUserUrls]);

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      handleLogout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAuth = async (
    type: 'login' | 'register',
    data: { username: string; password: string; email?: string }
  ) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (type === 'register') {
        await register(data);
        setRegistrationMsg('Registration successful! Please log in.');
        setForceLogin(true);
        setSuccessMsg(null);
      } else {
        const res = await login(data);
        const tokenValue = (res.data as { token: string }).token;
        setAuthToken(tokenValue);
        setSuccessMsg(null);
        setRegistrationMsg(null);
        setForceLogin(false);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setAuthError(axiosErr?.response?.data?.message || 'Authentication failed');
      } else {
        setAuthError('Authentication failed');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const [lastShortUrl, setLastShortUrl] = useState<{ shortId: string; originalUrl: string } | null>(null);

  const handleShorten = async (data: { originalUrl: string; customAlias?: string; expiration?: string }) => {
    setShortenLoading(true);
    setShortenError(null);
    try {
      if (!token) throw new Error('Not authenticated');
      const res = await shortenUrl(data, token);
      const shortData = (res.data as { data: { shortId: string; originalUrl: string } }).data;
      setSuccessMsg('Short URL created!');
      setLastShortUrl({ shortId: shortData.shortId, originalUrl: shortData.originalUrl });
      refetchAnalytics();
      fetchUserUrls();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setShortenError(axiosErr?.response?.data?.message || 'Failed to shorten URL');
      } else {
        setShortenError('Failed to shorten URL');
      }
    } finally {
      setShortenLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    queryClient.clear();
    setUrls([]);
    setSuccessMsg(null);
    setRegistrationMsg(null);
    setForceLogin(false);
  };

  // Notification auto-dismiss
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const formRef = React.useRef<HTMLDivElement>(null);
  const handleHeroShortenClick = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Keep token in sync with localStorage (handles manual localStorage changes)
  useEffect(() => {
    const syncToken = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken !== token) {
        setToken(storedToken);
      }
    };
    window.addEventListener('storage', syncToken);
    return () => window.removeEventListener('storage', syncToken);
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 text-white transition-colors duration-500">
      <Navbar isAuthenticated={!!token} onLogout={handleLogout} />
      <Hero onShortenClick={handleHeroShortenClick} />
      <div className="container mx-auto px-4 py-8">
        {!token ? (
          <AuthForm onAuth={handleAuth} loading={authLoading} error={authError} forceLogin={forceLogin} registrationMsg={registrationMsg} />
        ) : (
          <>
            <div ref={formRef} />
            <ShortenUrlForm onShorten={handleShorten} loading={shortenLoading} error={shortenError} />
            {lastShortUrl && <ShortUrlCard shortId={lastShortUrl.shortId} originalUrl={lastShortUrl.originalUrl} />}
            {successMsg && <div className="text-green-400 text-center mt-4 font-bold animate-fade-in">{successMsg}</div>}
            <UrlList
              urls={urls}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onAnalytics={handleAnalytics}
              loading={urlsLoading}
              error={urlsError}
            />
            <AnalyticsDashboard analytics={analyticsData as AnalyticsItem[]} loading={analyticsLoading} error={analyticsIsError ? (analyticsErrorObj as Error).message : null} />
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
