# Gera Elevator Control — Frontend

A React + Vite dashboard that visualizes your Gera Elevator backend: a live shaft view
with 4 animated cars, floor call buttons (external), an in-car floor panel (internal),
and a dispatch log.

## 1. Setup

```bash
cd gera-elevator-frontend
npm install
cp .env.example .env      # edit if your backend isn't on localhost:5000
npm run dev
```

Opens at `http://localhost:5173`. Make sure the backend (`gera-elevator-backend`) is
running first — `npm run dev` inside that folder, with MongoDB reachable.

## 2. How it works

- **Shaft view** (`BuildingView` + `ElevatorCar`): polls `GET /elevators` on load, then
  every ~900ms calls `POST /elevators/:id/step` for any car that still has stops queued
  or is `MOVING`, animating it up/down the shaft. When a car reaches a stop
  (`DOOR_OPEN`), the doors slide open and the car holds briefly before continuing, so
  the door-time in the spec is visible rather than instantaneous.
- **Floor calls**: the ▲ / ▼ buttons next to each floor number call
  `POST /requests/external` with `{ floor, direction }`.
- **Ride panel**: pick a car (A–D) then a destination floor — calls
  `POST /requests/internal` with `{ elevatorId, destinationFloor }`.
- **Dispatch log**: shows the last assignments from `GET /requests`, refreshed after
  every action.
- **Reset all cars**: calls `POST /elevators/reset`.

## 3. Keeping floor count in sync

The backend's `NUM_FLOORS` (in `src/config.js`) isn't exposed over the API, so this
frontend hardcodes a matching copy in `src/config.js`. If you change one, change the
other.

## 4. Build for production

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```
