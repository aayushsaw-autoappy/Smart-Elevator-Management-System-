# Gera Elevator System — Backend

## 1. Setup (do this first)

```bash
cd gera-elevator-backend
npm install
cp .env.example .env
# edit .env if your MongoDB isn't on localhost:27017
```

Make sure MongoDB is running locally (or point `MONGO_URI` in `.env` to Atlas/any instance).

```bash
npm run dev      # nodemon, restarts on file changes
# or
npm start
```

On boot the server auto-seeds 4 elevators (A, B, C, D) at floor 1, IDLE, if they don't already exist.

Health check: `GET http://localhost:5000/api/health`

## 2. Project Structure

```
src/
├── config.js              # constants: floor time, door time, floor count, elevator ids
├── models/
│   ├── Elevator.js         # elevator state schema
│   └── Request.js          # request history/log schema
├── logic/
│   ├── estimateTime.js     # willPass() + estimateTime() — the ETA math
│   └── assignElevator.js   # 3-tier priority selection + stop insertion
├── controllers.js          # all route handlers
├── routes.js                # route wiring
└── app.js                   # express + mongoose bootstrap
```

## 3. Time Estimation Logic (the core of the system)

Constants: **30s/floor**, **10s door open**, **10s door close** (20s total per intermediate stop).

- **IDLE elevator:** `ETA = |targetFloor - currentFloor| * 30`
- **MOVING elevator:** `ETA = distance * 30 + (stops passed before target) * 20`
  Only stops strictly between the elevator's current floor and the target — in actual travel order — count as "passed."

This keeps the number **fast to compute** (no simulation loop needed, pure math) and **logical** (an elevator that has to serve 2 stops before reaching your floor is correctly estimated as slower than one with a clear path).

## 4. API Contract (for the frontend team)

Base URL: `http://localhost:5000/api`

### GET `/elevators`
Returns all 4 elevators' current state.
```json
[
  { "elevatorId": "A", "currentFloor": 2, "direction": "UP", "stops": [4, 6], "status": "MOVING" },
  { "elevatorId": "B", "currentFloor": 8, "direction": "DOWN", "stops": [3], "status": "MOVING" },
  { "elevatorId": "C", "currentFloor": 1, "direction": "IDLE", "stops": [], "status": "IDLE" },
  { "elevatorId": "D", "currentFloor": 1, "direction": "IDLE", "stops": [], "status": "IDLE" }
]
```

### GET `/elevators/:id`
Single elevator state (same shape as one item above).

### POST `/requests/external`
Floor panel Up/Down button.
```json
// Request
{ "floor": 4, "direction": "UP" }

// Response
{ "assignedElevator": "A", "estimatedArrivalTime": 60, "stopsUpdated": [4, 6] }
```

### POST `/requests/internal`
Inside-elevator floor selection.
```json
// Request
{ "elevatorId": "A", "destinationFloor": 9 }

// Response
{ "assignedElevator": "A", "estimatedArrivalTime": 210, "stopsUpdated": [4, 6, 9] }
```

### POST `/elevators/:id/step`
Advances one elevator by one floor toward its next stop. Call this on a timer (e.g. every second) from the frontend to animate movement — no body needed.
```json
// Response — updated elevator document
{ "elevatorId": "A", "currentFloor": 3, "direction": "UP", "stops": [4, 6], "status": "MOVING" }
```

### GET `/requests`
Last 50 requests (history log) — useful for a "recent activity" panel.

## 5. Pending / Not Yet Wired

These are left as **pending** for now, per current scope:
- [ ] Real-time push to frontend (WebSocket/Socket.io) — frontend currently expected to poll `GET /elevators` and call `POST /elevators/:id/step` on an interval
- [ ] Capacity handling (bonus)
- [ ] Peak-hour optimization (bonus)
- [ ] Auth (not required for this task)

## 6. Quick Test (curl)

```bash
curl http://localhost:5000/api/elevators

curl -X POST http://localhost:5000/api/requests/external \
  -H "Content-Type: application/json" \
  -d '{"floor": 4, "direction": "UP"}'

curl -X POST http://localhost:5000/api/elevators/A/step
```
