import { API_BASE } from './config';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const message = body?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return body;
}

export const api = {
  getElevators: () => request('/elevators'),
  getElevator: (id) => request(`/elevators/${id}`),
  stepElevator: (id) => request(`/elevators/${id}/step`, { method: 'POST' }),
  resetElevators: () => request('/elevators/reset', { method: 'POST' }),
  externalRequest: (floor, direction) =>
    request('/requests/external', {
      method: 'POST',
      body: JSON.stringify({ floor, direction }),
    }),
  internalRequest: (elevatorId, destinationFloor) =>
    request('/requests/internal', {
      method: 'POST',
      body: JSON.stringify({ elevatorId, destinationFloor }),
    }),
  getRequests: () => request('/requests'),
  health: () => request('/health'),
};
