import { useEffect, useState } from 'react';
import { ELEVATOR_IDS } from '../config';
import '../styles/InternalPanel.css';

export default function InternalPanel({ elevators, numFloors, onSelect }) {
  const [activeId, setActiveId] = useState('A');
  const byId = Object.fromEntries(elevators.map((e) => [e.elevatorId, e]));
  const active = byId[activeId];

  useEffect(() => {
    if (elevators.length && !byId[activeId]) {
      setActiveId(elevators[0].elevatorId);
    }
  }, [elevators, activeId, byId]);

  const floors = Array.from({ length: numFloors }, (_, i) => i + 1).reverse();

  return (
    <div className="panel">
      <div className="panel__head">
        <h2 className="panel__title">Ride panel</h2>
        <span className="panel__hint">Inside-car floor selection</span>
      </div>

      <div className="tabs">
        {ELEVATOR_IDS.map((id) => {
          const e = byId[id];
          return (
            <button
              key={id}
              type="button"
              className={`tabs__item ${activeId === id ? 'is-active' : ''}`}
              onClick={() => setActiveId(id)}
            >
              <span className="tabs__letter">{id}</span>
              <span className="tabs__meta">
                {e ? `F${e.currentFloor}` : '—'}
              </span>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="panel__status">
          <span className={`chip chip--${active.direction?.toLowerCase()}`}>
            {active.direction}
          </span>
          <span className="panel__status-text">
            Floor {active.currentFloor} · {active.status.replace('_', ' ').toLowerCase()}
            {active.stops?.length ? ` · next: ${active.stops.join(' → ')}` : ''}
          </span>
        </div>
      )}

      <div className="floor-grid">
        {floors.map((f) => {
          const isCurrent = active?.currentFloor === f;
          const isQueued = active?.stops?.includes(f);
          return (
            <button
              key={f}
              type="button"
              className={`floor-btn ${isCurrent ? 'is-current' : ''} ${isQueued ? 'is-queued' : ''}`}
              disabled={!active || isCurrent}
              onClick={() => onSelect(activeId, f)}
            >
              {f}
            </button>
          );
        })}
      </div>
    </div>
  );
}
