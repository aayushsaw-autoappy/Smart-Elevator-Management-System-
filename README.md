# Smart Elevator Management System

Full-stack elevator management app with a React/Vite frontend and an Express/MongoDB backend.

## Project Structure

- `frontend/` - React + Vite UI
- `gera-elevator-backend/` - API, elevator assignment logic, and persistence

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally or a valid MongoDB connection string

## Setup

### Backend

```bash
cd gera-elevator-backend
npm install
cp .env.example .env
npm run dev
```

The backend starts on port `5000` by default and seeds the elevators on first boot.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs with Vite in development mode.

## API Overview

Backend API base URL: `http://localhost:5000/api`

- `GET /elevators` - list elevator states
- `GET /elevators/:id` - get a single elevator
- `POST /requests/external` - handle floor up/down requests
- `POST /requests/internal` - handle in-elevator destination requests
- `POST /elevators/:id/step` - advance one elevator toward its next stop
- `GET /requests` - recent request history

## Notes

- The backend contains the scheduling and ETA logic.
- The frontend is expected to poll the API for updates unless real-time transport is added later.