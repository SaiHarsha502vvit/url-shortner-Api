import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const register = (data: { username: string; password: string; email?: string }) =>
  axios.post(`${VITE_API_URL}/auth/register`, data);

export const login = (data: { username: string; password: string }) =>
  axios.post(`${VITE_API_URL}/auth/login`, data);

export const shortenUrl = (data: { originalUrl: string; customAlias?: string; expiration?: string }, token: string) =>
  axios.post(`${VITE_API_URL}/urls`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAnalytics = (token: string) =>
  axios.get(`${VITE_API_URL}/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUserUrls = (token: string) =>
  axios.get(`${VITE_API_URL}/urls`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Use a specific type for updateUrl data
export interface UpdateUrlData {
  originalUrl?: string;
  customAlias?: string;
  expiration?: string;
}

export const updateUrl = (id: string, data: UpdateUrlData, token: string) =>
  axios.put(`${VITE_API_URL}/urls/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUrl = (id: string, token: string) =>
  axios.delete(`${VITE_API_URL}/urls/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUrlAnalytics = (id: string, token: string) =>
  axios.get(`${VITE_API_URL}/analytics/${id}/clicks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getQRCode = (id: string) =>
  axios.get(`${VITE_API_URL}/urls/${id}/qrcode`);
