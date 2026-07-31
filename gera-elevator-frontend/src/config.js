// Must mirror the backend's src/config.js. The backend has no endpoint that
// exposes these, so they're kept in sync here manually.
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const NUM_FLOORS = 16;
export const ELEVATOR_IDS = ['A', 'B', 'C', 'D'];

export const FLOOR_TIME = 30; // seconds per floor, from backend config
export const DOOR_OPEN = 10;
export const DOOR_CLOSE = 10;

// Client-side animation pacing only — does not affect backend ETA math.
export const STEP_INTERVAL_MS = 900;
export const DOOR_HOLD_MS = 1400;
