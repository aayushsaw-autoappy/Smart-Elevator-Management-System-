import '../styles/ActivityLog.css';

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const s = Math.floor(diff / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  return `${m}m ago`;
}

export default function ActivityLog({ entries }) {
  const items = entries.slice(0, 10);

  return (
    <div className="log">
      <div className="log__head">
        <h2 className="log__title">Dispatch log</h2>
        <span className="log__hint">Latest assignments</span>
      </div>

      {items.length === 0 ? (
        <p className="log__empty">No requests yet — call a car to see it here.</p>
      ) : (
        <ul className="log__list">
          {items.map((r) => (
            <li key={r._id} className="log__row">
              <span className={`log__badge log__badge--${r.type.toLowerCase()}`}>
                {r.type === 'EXTERNAL' ? 'EXT' : 'INT'}
              </span>
              <div className="log__body">
                <p className="log__line">
                  {r.type === 'EXTERNAL' ? (
                    <>Floor {r.floor} {r.direction === 'UP' ? '▲' : '▼'}</>
                  ) : (
                    <>Car {r.elevatorId} → Floor {r.destinationFloor}</>
                  )}
                  <span className="log__arrow"> → </span>
                  Car <strong>{r.assignedElevator}</strong>
                </p>
                <p className="log__meta">
                  ETA {r.estimatedArrivalTime}s · {timeAgo(r.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
