import api from './api';

const FORMS_BASE = '/forms';

/**
 * Create a new form (admin only).
 * @param {object} formData - { title, description, fields, deadline? }
 * @returns {Promise<object>} { form }
 */
export async function createForm(formData) {
  const response = await api.post(FORMS_BASE, formData);
  return response.data;
}

/**
 * Get all forms.
 * @param {object} params - Query params (page, limit)
 * @returns {Promise<object>} { forms, pagination }
 */
export async function getForms(params = {}) {
  const response = await api.get(FORMS_BASE, { params });
  return response.data;
}

/**
 * Get a single form by ID.
 * @param {string} formId - Form ID
 * @returns {Promise<object>} { form }
 */
export async function getFormById(formId) {
  const response = await api.get(`${FORMS_BASE}/${formId}`);
  return response.data;
}

/**
 * Submit a response to a form.
 * @param {string} formId - Form ID
 * @param {object} responseData - { answers: [...] }
 * @returns {Promise<object>} { response }
 */
export async function submitResponse(formId, responseData) {
  const response = await api.post(`${FORMS_BASE}/${formId}/responses`, responseData);
  return response.data;
}

/**
 * Get all responses for a form (admin only).
 * @param {string} formId - Form ID
 * @param {object} params - Query params (page, limit)
 * @returns {Promise<object>} { responses, pagination }
 */
export async function getResponses(formId, params = {}) {
  const response = await api.get(`${FORMS_BASE}/${formId}/responses`, { params });
  return response.data;
}

/**
 * Update a form (admin only).
 * @param {string} formId - Form ID
 * @param {object} updateData - Fields to update
 * @returns {Promise<object>} { form }
 */
export async function updateForm(formId, updateData) {
  const response = await api.put(`${FORMS_BASE}/${formId}`, updateData);
  return response.data;
}

/**
 * Delete a form (admin only).
 * @param {string} formId - Form ID
 * @returns {Promise<object>} Response message
 */
export async function deleteForm(formId) {
  const response = await api.delete(`${FORMS_BASE}/${formId}`);
  return response.data;
}
