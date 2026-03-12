import api from './api';

const AUTH_BASE = '/auth';

/**
 * Log in with email and password.
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} { token, user }
 */
export async function login(credentials) {
  const response = await api.post(`${AUTH_BASE}/login`, credentials);
  return response.data;
}

/**
 * Register a new user account.
 * @param {object} userData - { name, email, password, role? }
 * @returns {Promise<object>} { token, user }
 */
export async function register(userData) {
  const response = await api.post(`${AUTH_BASE}/register`, userData);
  return response.data;
}

/**
 * Get the current authenticated user's profile.
 * @returns {Promise<object>} { user }
 */
export async function getMe() {
  const response = await api.get(`${AUTH_BASE}/me`);
  return response.data;
}

/**
 * Refresh the authentication token.
 * @returns {Promise<object>} { token }
 */
export async function refreshToken() {
  const response = await api.post(`${AUTH_BASE}/refresh`);
  return response.data;
}

/**
 * Request a password reset email.
 * @param {string} email - User's email address
 * @returns {Promise<object>} Response message
 */
export async function forgotPassword(email) {
  const response = await api.post(`${AUTH_BASE}/forgot-password`, { email });
  return response.data;
}

/**
 * Reset password with a token.
 * @param {string} token - Reset token
 * @param {string} password - New password
 * @returns {Promise<object>} Response message
 */
export async function resetPassword(token, password) {
  const response = await api.post(`${AUTH_BASE}/reset-password/${token}`, { password });
  return response.data;
}
