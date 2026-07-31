# Smart Elevator Management System

Full-stack elevator management system with a Node/Express/MongoDB backend and a React/Vite frontend.

## Repository Layout

```text
frontend/                 React + Vite app
gera-elevator-backend/    Express API, elevator logic, and MongoDB models
```

## Backend

The backend lives in [gera-elevator-backend](gera-elevator-backend) and exposes the elevator APIs used by the system. It connects to MongoDB, seeds four elevators on startup, and stores request history.

### Backend Scripts

```bash
cd gera-elevator-backend
npm install
npm run dev
npm start
```

- `npm run dev` starts the server with Nodemon.
- `npm start` starts the server with Node.

### Backend Environment

Create a `.env` file from [gera-elevator-backend/.env.example](gera-elevator-backend/.env.example).

```env
MONGO_URI=mongodb://localhost:27017/gera_elevator
PORT=5000
```

### Backend Configuration

The backend configuration in [gera-elevator-backend/src/config.js](gera-elevator-backend/src/config.js) defines:

- `NUM_FLOORS = 16`
- `ELEVATOR_IDS = ['A', 'B', 'C', 'D']`
- `FLOOR_TIME = 30`
- `DOOR_OPEN = 10`
- `DOOR_CLOSE = 10`

### Backend Startup Flow

When the server starts in [gera-elevator-backend/src/app.js](gera-elevator-backend/src/app.js):

1. Express is configured with `cors()` and JSON parsing.
2. The API is mounted under `/api`.
3. MongoDB is connected using `MONGO_URI`.
4. Four elevators are seeded at floor 1 with `IDLE` status if they do not already exist.
5. The server listens on `PORT`.

### Backend Data Models

The MongoDB models are:

- [gera-elevator-backend/src/models/Elevator.js](gera-elevator-backend/src/models/Elevator.js)
- [gera-elevator-backend/src/models/Request.js](gera-elevator-backend/src/models/Request.js)

`Elevator` stores:

- `elevatorId`
- `currentFloor`
- `direction` as `UP`, `DOWN`, or `IDLE`
- `stops`
- `status` as `MOVING`, `IDLE`, or `DOOR_OPEN`

`Request` stores:

- `type` as `EXTERNAL` or `INTERNAL`
- external request data: `floor`, `direction`
- internal request data: `elevatorId`, `destinationFloor`
- assignment result: `assignedElevator`, `estimatedArrivalTime`, `stopsUpdated`

### Backend Logic

The core scheduling code is in [gera-elevator-backend/src/logic/assignElevator.js](gera-elevator-backend/src/logic/assignElevator.js) and [gera-elevator-backend/src/logic/estimateTime.js](gera-elevator-backend/src/logic/estimateTime.js).

- `assignElevator()` prioritizes same-direction elevators that will pass the requested floor.
- If no same-direction match exists, it prefers idle elevators.
- If neither applies, it picks the best ETA overall.
- `estimateTime()` calculates travel time using floor distance and door delay.
- `insertStop()` adds a requested floor into the elevator's stop list in travel order.

### Backend Routes

All backend routes are mounted under `http://localhost:5000/api`.

- `GET /health` returns `{ "status": "ok" }`
- `GET /elevators` returns all elevators
- `GET /elevators/:id` returns one elevator by ID
- `POST /elevators/:id/step` moves one elevator one floor toward its next stop
- `POST /requests/external` accepts `{ floor, direction }`
- `POST /requests/internal` accepts `{ elevatorId, destinationFloor }`
- `GET /requests` returns the latest 50 requests

## Frontend

The frontend lives in [frontend](frontend) and is currently the default React + Vite starter template rather than a finished elevator dashboard.

### Frontend Scripts

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

- `npm run dev` starts Vite in development mode.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
- `npm run preview` serves the production build locally.

### Frontend Stack

- React 19
- Vite 8
- ESLint with React hooks and refresh rules

### Frontend Entry Files

- [frontend/src/main.jsx](frontend/src/main.jsx)
- [frontend/src/App.jsx](frontend/src/App.jsx)
- [frontend/src/index.css](frontend/src/index.css)
- [frontend/src/App.css](frontend/src/App.css)

### Frontend Current UI

The current UI still shows the Vite starter content:

- React and Vite logos
- a counter button
- documentation and community links

Assets used by the starter are in [frontend/src/assets](frontend/src/assets), and the public icon set is in [frontend/public](frontend/public).

### Frontend Styling Notes

The global styles in [frontend/src/index.css](frontend/src/index.css) define the theme variables, typography, and layout scaffolding. [frontend/src/App.css](frontend/src/App.css) contains the component-level layout and responsive styles for the starter page.

## Project Structure

```text
frontend/
	index.html
	vite.config.js
	eslint.config.js
	package.json
	public/
		favicon.svg
		icons.svg
	src/
		App.jsx
		App.css
		index.css
		main.jsx
		assets/
			hero.png
			react.svg
			vite.svg

gera-elevator-backend/
	package.json
	.env.example
	README.md
	src/
		app.js
		config.js
		controllers.js
		routes.js
		logic/
			assignElevator.js
			estimateTime.js
		models/
			Elevator.js
			Request.js
```

## Setup Summary

1. Start MongoDB or provide a valid `MONGO_URI`.
2. Run the backend with `npm run dev` inside `gera-elevator-backend`.
3. Run the frontend with `npm run dev` inside `frontend`.
4. Use the frontend or API clients to call the backend endpoints under `/api`.
