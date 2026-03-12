import api from './api';

const TEAMS_BASE = '/teams';

/**
 * Get all teams (admin/judge).
 * @param {object} params - Query params (page, limit, search)
 * @returns {Promise<object>} { teams, pagination }
 */
export async function getAllTeams(params = {}) {
  const response = await api.get(TEAMS_BASE, { params });
  return response.data;
}

/**
 * Get a single team by ID.
 * @param {string} teamId - Team ID
 * @returns {Promise<object>} { team }
 */
export async function getTeamById(teamId) {
  const response = await api.get(`${TEAMS_BASE}/${teamId}`);
  return response.data;
}

/**
 * Create a new team.
 * @param {object} teamData - { name, description, repoUrl? }
 * @returns {Promise<object>} { team }
 */
export async function createTeam(teamData) {
  const response = await api.post(TEAMS_BASE, teamData);
  return response.data;
}

/**
 * Join an existing team.
 * @param {string} teamId - Team ID to join
 * @param {string} joinCode - Team join code
 * @returns {Promise<object>} { team }
 */
export async function joinTeam(teamId, joinCode) {
  const response = await api.post(`${TEAMS_BASE}/${teamId}/join`, { joinCode });
  return response.data;
}

/**
 * Assign judges to a team (admin only).
 * @param {string} teamId - Team ID
 * @param {string[]} judgeIds - Array of judge user IDs
 * @returns {Promise<object>} { team }
 */
export async function assignJudges(teamId, judgeIds) {
  const response = await api.put(`${TEAMS_BASE}/${teamId}/judges`, { judgeIds });
  return response.data;
}

/**
 * Get the current user's team.
 * @returns {Promise<object>} { team }
 */
export async function getMyTeam() {
  const response = await api.get(`${TEAMS_BASE}/my-team`);
  return response.data;
}

/**
 * Update a team's information.
 * @param {string} teamId - Team ID
 * @param {object} updateData - Fields to update
 * @returns {Promise<object>} { team }
 */
export async function updateTeam(teamId, updateData) {
  const response = await api.put(`${TEAMS_BASE}/${teamId}`, updateData);
  return response.data;
}

/**
 * Delete a team (admin only).
 * @param {string} teamId - Team ID
 * @returns {Promise<object>} Response message
 */
export async function deleteTeam(teamId) {
  const response = await api.delete(`${TEAMS_BASE}/${teamId}`);
  return response.data;
}

/**
 * Remove a member from a team.
 * @param {string} teamId - Team ID
 * @param {string} userId - User ID to remove
 * @returns {Promise<object>} { team }
 */
export async function removeMember(teamId, userId) {
  const response = await api.delete(`${TEAMS_BASE}/${teamId}/members/${userId}`);
  return response.data;
}
