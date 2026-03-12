import api from './api';

const GITHUB_BASE = '/github';

/**
 * Trigger a sync of commits from GitHub for a team.
 * @param {string} teamId - Team ID
 * @returns {Promise<object>} { commits, message }
 */
export async function syncCommits(teamId) {
  const response = await api.post(`${GITHUB_BASE}/sync/${teamId}`);
  return response.data;
}

/**
 * Get commits for a team.
 * @param {string} teamId - Team ID
 * @param {object} params - Query params (page, limit)
 * @returns {Promise<object>} { commits, pagination }
 */
export async function getCommits(teamId, params = {}) {
  const response = await api.get(`${GITHUB_BASE}/commits/${teamId}`, { params });
  return response.data;
}

/**
 * Get the commit timeline for a team.
 * @param {string} teamId - Team ID
 * @returns {Promise<object>} { timeline }
 */
export async function getTimeline(teamId) {
  const response = await api.get(`${GITHUB_BASE}/timeline/${teamId}`);
  return response.data;
}

/**
 * Get commit statistics for all teams (admin/judge).
 * @returns {Promise<object>} { stats }
 */
export async function getCommitStats() {
  const response = await api.get(`${GITHUB_BASE}/stats`);
  return response.data;
}
