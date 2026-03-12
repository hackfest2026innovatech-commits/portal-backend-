import api from './api';

const LEADERBOARD_BASE = '/leaderboard';
const HACKATHON_ID = 'hackfest-2026';

export async function getLeaderboard(params = {}, hackathonId = HACKATHON_ID) {
  const response = await api.get(`${LEADERBOARD_BASE}/${hackathonId}`, { params });
  return response.data;
}

export async function exportCSV(hackathonId = HACKATHON_ID) {
  const response = await api.get(`${LEADERBOARD_BASE}/${hackathonId}/export`, {
    responseType: 'blob',
  });
  return response;
}
