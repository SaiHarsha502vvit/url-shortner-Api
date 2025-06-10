import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

export const register = (data: { username: string; password: string; email?: string }) =>
  axios.post(`${API_URL}/auth/register`, data);

export const login = (data: { username: string; password: string }) =>
  axios.post(`${API_URL}/auth/login`, data);

export const shortenUrl = (data: { originalUrl: string; customAlias?: string; expiration?: string }, token: string) =>
  axios.post(`${API_URL}/urls`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAnalytics = (token: string) =>
  axios.get(`${API_URL}/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUserUrls = (token: string) =>
  axios.get(`${API_URL}/urls`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Use a specific type for updateUrl data
export interface UpdateUrlData {
  originalUrl?: string;
  customAlias?: string;
  expiration?: string;
}

export const updateUrl = (id: string, data: UpdateUrlData, token: string) =>
  axios.put(`${API_URL}/urls/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUrl = (id: string, token: string) =>
  axios.delete(`${API_URL}/urls/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getQRCode = (id: string) =>
  axios.get(`${API_URL}/urls/${id}/qrcode`);

// Domain management
export const listDomains = async (token: string) => {
  return apiClient.get('/domains', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addDomain = async (domain: string, token: string) => {
  return apiClient.post('/domains', { domain }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const verifyDomain = async (domain: string, verificationToken: string, token: string) => {
  return apiClient.post(`/domains/verify`, { domain, verificationToken }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeDomain = async (domain: string, token: string) => {
  return apiClient.delete(`/domains/${domain}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Analytics
export const getUrlAnalytics = async (shortId: string, token: string) => {
  return apiClient.get(`/analytics/${shortId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
