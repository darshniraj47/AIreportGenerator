/**
 * api.js — Axios API Service
 * ───────────────────────────
 * Centralised HTTP client with base URL, interceptors, and
 * typed helper functions for all backend endpoints.
 */

import axios from 'axios';
import { auth } from '../firebase';

// Helper to wait for auth state
const getUserId = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user ? user.uid : 'anonymous');
    });
  });
};

// ─── Axios Instance ────────────────────────────────────────────────────────────
const api = axios.create({
 // In development, Vite proxies these to http://localhost:5000
 // In production, set VITE_API_URL in client/.env
 baseURL: import.meta.env.VITE_API_URL || '',
 timeout: 120000, // 2 minutes — Gemini can be slow for long content
 headers: {
 'Content-Type': 'application/json',
 },
});

// ─── Request Interceptor ────────────────────────────────────────────────────────
api.interceptors.request.use(
 async (config) => {
 // Add user_id from Firebase Auth
 const userId = await getUserId();
 if (config.method === 'get' || config.method === 'delete') {
 config.params = { ...config.params, user_id: userId };
 }
 return config;
 },
 (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
 (response) => response,
 (error) => {
 const message =
 error.response?.data?.error ||
 error.message ||
 'An unexpected error occurred. Please try again.';
 return Promise.reject(new Error(message));
 }
);

// ─── API Functions ─────────────────────────────────────────────────────────────

/**
 * Generate content using the AI backend.
 * @param {Object} params
 * @param {string} params.topic
 * @param {string} params.content_type
 * @param {string} params.tone
 * @param {number} params.word_count
 * @param {string} [params.custom_instructions]
 */
export const generateContent = async (params) => {
 const userId = await getUserId();
 const response = await api.post('/generate', { ...params, user_id: userId });
 return response.data;
};

/**
 * Preview the generated prompt without calling the LLM.
 * @param {Object} params - Same as generateContent params
 */
export const previewPrompt = async (params) => {
 const response = await api.post('/preview', params);
 return response.data;
};

/**
 * Fetch generation history.
 * @param {string} [search] - Optional search term
 */
export const fetchHistory = async (search = '') => {
 const userId = await getUserId();
 const response = await api.get('/history', {
 params: { user_id: userId, search },
 });
 return response.data;
};

/**
 * Delete a specific history item.
 * @param {string} itemId - MongoDB ObjectId
 */
export const deleteHistoryItem = async (itemId) => {
 const userId = await getUserId();
 const response = await api.delete(`/history/${itemId}`, {
 params: { user_id: userId },
 });
 return response.data;
};

/**
 * Delete all history for the current user.
 */
export const deleteAllHistory = async () => {
 const userId = await getUserId();
 const response = await api.delete('/history', {
 params: { user_id: userId },
 });
 return response.data;
};

/**
 * Check backend health.
 */
export const checkHealth = async () => {
 const response = await api.get('/health');
 return response.data;
};

export default api;
