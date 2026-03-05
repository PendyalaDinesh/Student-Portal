// Week 2 — Axios API client with Firebase token auto-attach
import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// Attach Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.error('Token error:', err);
    }
  }
  return config;
});

// Normalize error messages
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(msg));
  }
);

// ── Auth endpoints ────────────────────────────────────────────
export const authAPI = {
  getMe:          () => api.get('/auth/me'),
  updateProfile:  (data) => api.put('/auth/profile', data),
};

// ── Post endpoints ────────────────────────────────────────────
export const postsAPI = {
  getAll:    (params)     => api.get('/posts', { params }),
  getOne:    (id)         => api.get(`/posts/${id}`),
  create:    (data)       => api.post('/posts', data),
  update:    (id, data)   => api.put(`/posts/${id}`, data),
  remove:    (id)         => api.delete(`/posts/${id}`),
  toggleSave:(id)         => api.post(`/posts/${id}/save`),
  addReview: (id, data)   => api.post(`/posts/${id}/review`, data),
};

// ── User endpoints ────────────────────────────────────────────
export const usersAPI = {
  getProfile:    (id)     => api.get(`/users/${id}`),
  getSaved:      ()       => api.get('/users/me/saved'),
  getMyPosts:    (params) => api.get('/users/me/posts', { params }),
  toggleActive:  (id)     => api.patch(`/users/me/posts/${id}/toggle`),
};

// ── Message endpoints ─────────────────────────────────────────
export const messagesAPI = {
  getConversations: ()             => api.get('/messages'),
  getMessages:      (userId)       => api.get(`/messages/${userId}`),
  send:             (data)         => api.post('/messages', data),
};

export default api;
