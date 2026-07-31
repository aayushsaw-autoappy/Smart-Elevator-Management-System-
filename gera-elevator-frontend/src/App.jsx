import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api';
import { ELEVATOR_IDS, NUM_FLOORS, STEP_INTERVAL_MS, DOOR_HOLD_MS } from './config';
import Header from './components/Header.jsx';
import BuildingView from './components/BuildingView.jsx';
import InternalPanel from './components/InternalPanel.jsx';
import ActivityLog from './components/ActivityLog.jsx';
import ToastStack from './components/Toast.jsx';
import './styles/App.css';

let toastId = 0;

export default function App() {
  const [elevators, setElevators] = useState([]);
  const [requestsLog, setRequestsLog] = useState([]);
  const [connected, setConnected] = useState(null); // null = checking, true/false after first attempt
  const [toasts, setToasts] = useState([]);
  const [busyFloors, setBusyFloors] = useState({}); // `${floor}-${direction}` -> true while awaiting response

  const doorHoldUntil = useRef({}); // elevatorId -> timestamp
  const prevStatus = useRef({}); // elevatorId -> last known status

  const pushToast = useCallback((message, tone = 'info') => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const refreshElevators = useCallback(async () => {
    try {
      const data = await api.getElevators();
      setElevators(data);
      setConnected(true);
      return data;
    } catch (err) {
      setConnected(false);
      return null;
    }
  }, []);

  const refreshLog = useCallback(async () => {
    try {
      const data = await api.getRequests();
      setRequestsLog(data);
    } catch {
      // silent — log panel just stays stale
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshElevators();
    refreshLog();
  }, [refreshElevators, refreshLog]);

  // Animation / simulation loop: advance any elevator that still has work to do.
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = Date.now();
      const current = elevators;
      if (!current.length) return;

      const movable = current.filter((e) => {
        const holdUntil = doorHoldUntil.current[e.elevatorId] || 0;
        if (now < holdUntil) return false;
        return e.stops?.length > 0 || e.status === 'MOVING';
      });

      if (!movable.length) return;

      const results = await Promise.all(
        movable.map(async (e) => {
          try {
            const updated = await api.stepElevator(e.elevatorId);
            return updated;
          } catch {
            return null;
          }
        })
      );

      setElevators((prevList) => {
        const byId = Object.fromEntries(prevList.map((e) => [e.elevatorId, e]));
        results.forEach((r) => {
          if (!r) return;
          if (r.status === 'DOOR_OPEN' && prevStatus.current[r.elevatorId] !== 'DOOR_OPEN') {
            doorHoldUntil.current[r.elevatorId] = Date.now() + DOOR_HOLD_MS;
          }
          prevStatus.current[r.elevatorId] = r.status;
          byId[r.elevatorId] = r;
        });
        return ELEVATOR_IDS.map((id) => byId[id]).filter(Boolean);
      });
    }, STEP_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [elevators]);

  const handleExternalRequest = useCallback(
    async (floor, direction) => {
      const key = `${floor}-${direction}`;
      setBusyFloors((b) => ({ ...b, [key]: true }));
      try {
        const res = await api.externalRequest(floor, direction);
        pushToast(
          `Floor ${floor} ${direction === 'UP' ? '▲' : '▼'} → Car ${res.assignedElevator} · ETA ${res.estimatedArrivalTime}s`,
          'success'
        );
        await refreshElevators();
        refreshLog();
      } catch (err) {
        pushToast(err.message || 'Request failed', 'error');
      } finally {
        setBusyFloors((b) => {
          const next = { ...b };
          delete next[key];
          return next;
        });
      }
    },
    [pushToast, refreshElevators, refreshLog]
  );

  const handleInternalRequest = useCallback(
    async (elevatorId, destinationFloor) => {
      try {
        const res = await api.internalRequest(elevatorId, destinationFloor);
        pushToast(
          `Car ${elevatorId} → Floor ${destinationFloor} · ETA ${res.estimatedArrivalTime}s`,
          'success'
        );
        await refreshElevators();
        refreshLog();
      } catch (err) {
        pushToast(err.message || 'Request failed', 'error');
      }
    },
    [pushToast, refreshElevators, refreshLog]
  );

  const handleReset = useCallback(async () => {
    try {
      await api.resetElevators();
      doorHoldUntil.current = {};
      prevStatus.current = {};
      pushToast('All cars reset to floor 1', 'info');
      await refreshElevators();
      refreshLog();
    } catch (err) {
      pushToast(err.message || 'Reset failed', 'error');
    }
  }, [pushToast, refreshElevators, refreshLog]);

  return (
    <div className="app-shell">
      <Header connected={connected} numFloors={NUM_FLOORS} onReset={handleReset} />

      <main className="app-main">
        <section className="app-main__shaft">
          <BuildingView
            elevators={elevators}
            numFloors={NUM_FLOORS}
            busyFloors={busyFloors}
            onCall={handleExternalRequest}
          />
        </section>

        <aside className="app-main__side">
          <InternalPanel
            elevators={elevators}
            numFloors={NUM_FLOORS}
            onSelect={handleInternalRequest}
          />
          <ActivityLog entries={requestsLog} />
        </aside>
      </main>

      <ToastStack toasts={toasts} />
    </div>
  );
}
