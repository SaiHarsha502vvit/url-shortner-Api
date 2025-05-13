import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

export const register = (data: { username: string; password: string; email?: string }) =>
  axios.post(`${API_BASE}/auth/register`, data);

export const login = (data: { username: string; password: string }) =>
  axios.post(`${API_BASE}/auth/login`, data);

export const shortenUrl = (data: { originalUrl: string; customAlias?: string; expiration?: string }, token: string) =>
  axios.post(`${API_BASE}/urls`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAnalytics = (token: string) =>
  axios.get(`${API_BASE}/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUserUrls = (token: string) =>
  axios.get(`${API_BASE}/urls`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Use a specific type for updateUrl data
export interface UpdateUrlData {
  originalUrl?: string;
  customAlias?: string;
  expiration?: string;
}

export const updateUrl = (id: string, data: UpdateUrlData, token: string) =>
  axios.put(`${API_BASE}/urls/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUrl = (id: string, token: string) =>
  axios.delete(`${API_BASE}/urls/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUrlAnalytics = (id: string, token: string) =>
  axios.get(`${API_BASE}/analytics/${id}/clicks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getQRCode = (id: string) =>
  axios.get(`${API_BASE}/urls/${id}/qrcode`);
