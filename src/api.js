import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Set admin password header
export const setAdminAuth = (password) => {
  api.defaults.headers.common['x-admin-password'] = password;
};

// Admin login
export const adminLogin = (password) => api.post('/admin/login', { password });

// Dashboard
export const getDashboard = () => api.get('/admin/dashboard');

// Appointments
export const getAppointments = (params) => api.get('/admin/appointments', { params });
export const updateAppointment = (id, data) => api.patch(`/admin/appointments/${id}`, data);
export const deleteAppointment = (id) => api.delete(`/admin/appointments/${id}`);

// Settings
export const getAdminEmails = () => api.get('/admin/settings/admin-emails');
export const updateAdminEmails = (emails) => api.put('/admin/settings/admin-emails', { emails });

export default api;
