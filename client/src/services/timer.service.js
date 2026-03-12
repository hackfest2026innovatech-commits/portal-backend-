import api from './api';

const TIMER_BASE = '/timer';
const HACKATHON_ID = 'hackfest-2026';

export async function getTimer(hackathonId = HACKATHON_ID) {
  const response = await api.get(TIMER_BASE, { params: { hackathonId } });
  return response.data;
}

export async function startTimer(durationSeconds, hackathonId = HACKATHON_ID) {
  const response = await api.post(`${TIMER_BASE}/start`, {
    hackathonId,
    duration: durationSeconds,
  });
  return response.data;
}

export async function pauseTimer(hackathonId = HACKATHON_ID) {
  const response = await api.post(`${TIMER_BASE}/pause`, { hackathonId });
  return response.data;
}

export async function resumeTimer(hackathonId = HACKATHON_ID) {
  const response = await api.post(`${TIMER_BASE}/start`, { hackathonId });
  return response.data;
}

export async function resetTimer(hackathonId = HACKATHON_ID) {
  const response = await api.post(`${TIMER_BASE}/reset`, { hackathonId });
  return response.data;
}
