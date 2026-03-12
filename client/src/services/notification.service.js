import api from './api';

const NOTIFICATIONS_BASE = '/notifications';

/**
 * Get notifications for the current user.
 * @param {object} params - Query params (page, limit, unreadOnly)
 * @returns {Promise<object>} { notifications, pagination, unreadCount }
 */
export async function getNotifications(params = {}) {
  const response = await api.get(NOTIFICATIONS_BASE, { params });
  return response.data;
}

/**
 * Create a new notification/announcement (admin only).
 * @param {object} data - { title, message, type, targetRole?, targetUsers? }
 * @returns {Promise<object>} { notification }
 */
export async function createNotification(data) {
  const response = await api.post(NOTIFICATIONS_BASE, data);
  return response.data;
}

/**
 * Mark a notification as read.
 * @param {string} notificationId - Notification ID
 * @returns {Promise<object>} { notification }
 */
export async function markAsRead(notificationId) {
  const response = await api.put(`${NOTIFICATIONS_BASE}/${notificationId}/read`);
  return response.data;
}

/**
 * Mark all notifications as read.
 * @returns {Promise<object>} Response message
 */
export async function markAllAsRead() {
  const response = await api.put(`${NOTIFICATIONS_BASE}/read-all`);
  return response.data;
}

/**
 * Delete a notification (admin only).
 * @param {string} notificationId - Notification ID
 * @returns {Promise<object>} Response message
 */
export async function deleteNotification(notificationId) {
  const response = await api.delete(`${NOTIFICATIONS_BASE}/${notificationId}`);
  return response.data;
}
