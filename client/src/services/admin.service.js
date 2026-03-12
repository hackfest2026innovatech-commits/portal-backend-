import api from './api';

const ADMIN_BASE = '/admin';

/**
 * Get dashboard statistics (admin only).
 * @returns {Promise<object>} { stats: { totalUsers, totalTeams, totalSubmissions, ... } }
 */
export async function getDashboardStats() {
  const response = await api.get(`${ADMIN_BASE}/dashboard`);
  return response.data;
}

/**
 * Get all users with optional filtering (admin only).
 * @param {object} params - Query params (page, limit, role, search)
 * @returns {Promise<object>} { users, pagination }
 */
export async function getAllUsers(params = {}) {
  const response = await api.get(`${ADMIN_BASE}/users`, { params });
  return response.data;
}

/**
 * Update a user's role (admin only).
 * @param {string} userId - User ID
 * @param {string} role - New role ('admin' | 'student' | 'judge')
 * @returns {Promise<object>} { user }
 */
export async function updateUserRole(userId, role) {
  const response = await api.put(`${ADMIN_BASE}/users/${userId}/role`, { role });
  return response.data;
}

/**
 * Delete a user (admin only).
 * @param {string} userId - User ID
 * @returns {Promise<object>} Response message
 */
export async function deleteUser(userId) {
  const response = await api.delete(`${ADMIN_BASE}/users/${userId}`);
  return response.data;
}

/**
 * Get system health and settings (admin only).
 * @returns {Promise<object>} { settings }
 */
export async function getSettings() {
  const response = await api.get(`${ADMIN_BASE}/settings`);
  return response.data;
}

/**
 * Update system settings (admin only).
 * @param {object} settings - Settings to update
 * @returns {Promise<object>} { settings }
 */
export async function updateSettings(settings) {
  const response = await api.put(`${ADMIN_BASE}/settings`, settings);
  return response.data;
}
