import api from './api';

const EXPORT_BASE = '/export';

/**
 * Export all teams data.
 * @param {string} format - Export format ('csv' | 'json')
 * @returns {Promise<object>} Axios response with blob data
 */
export async function exportTeams(format = 'csv') {
  const response = await api.get(`${EXPORT_BASE}/teams`, {
    params: { format },
    responseType: 'blob',
  });
  return response;
}

/**
 * Export all evaluation scores.
 * @param {string} format - Export format ('csv' | 'json')
 * @returns {Promise<object>} Axios response with blob data
 */
export async function exportScores(format = 'csv') {
  const response = await api.get(`${EXPORT_BASE}/scores`, {
    params: { format },
    responseType: 'blob',
  });
  return response;
}

/**
 * Export all form submissions.
 * @param {string} formId - Optional form ID to filter
 * @param {string} format - Export format ('csv' | 'json')
 * @returns {Promise<object>} Axios response with blob data
 */
export async function exportSubmissions(formId, format = 'csv') {
  const response = await api.get(`${EXPORT_BASE}/submissions`, {
    params: { formId, format },
    responseType: 'blob',
  });
  return response;
}

/**
 * Export full hackathon report.
 * @returns {Promise<object>} Axios response with blob data
 */
export async function exportFullReport() {
  const response = await api.get(`${EXPORT_BASE}/report`, {
    responseType: 'blob',
  });
  return response;
}
