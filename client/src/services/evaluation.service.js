import api from './api';

const EVALUATIONS_BASE = '/evaluations';

/**
 * Submit an evaluation for a team.
 * @param {object} evaluationData - { teamId, scores: { innovation, technical, ... }, comments }
 * @returns {Promise<object>} { evaluation }
 */
export async function submitEvaluation(evaluationData) {
  const response = await api.post(EVALUATIONS_BASE, evaluationData);
  return response.data;
}

/**
 * Update an existing evaluation.
 * @param {string} evaluationId - Evaluation ID
 * @param {object} updateData - Fields to update
 * @returns {Promise<object>} { evaluation }
 */
export async function updateEvaluation(evaluationId, updateData) {
  const response = await api.put(`${EVALUATIONS_BASE}/${evaluationId}`, updateData);
  return response.data;
}

/**
 * Get evaluations for a specific team.
 * @param {string} teamId - Team ID
 * @returns {Promise<object>} { evaluations }
 */
export async function getByTeam(teamId) {
  const response = await api.get(`${EVALUATIONS_BASE}/team/${teamId}`);
  return response.data;
}

/**
 * Get the current judge's assigned teams for evaluation.
 * @returns {Promise<object>} { assignments }
 */
export async function getAssignments() {
  const response = await api.get(`${EVALUATIONS_BASE}/assignments`);
  return response.data;
}

/**
 * Get the score overview for all teams (admin only).
 * @returns {Promise<object>} { overview }
 */
export async function getScoreOverview() {
  const response = await api.get(`${EVALUATIONS_BASE}/overview`);
  return response.data;
}

/**
 * Get a specific evaluation by ID.
 * @param {string} evaluationId - Evaluation ID
 * @returns {Promise<object>} { evaluation }
 */
export async function getEvaluationById(evaluationId) {
  const response = await api.get(`${EVALUATIONS_BASE}/${evaluationId}`);
  return response.data;
}
