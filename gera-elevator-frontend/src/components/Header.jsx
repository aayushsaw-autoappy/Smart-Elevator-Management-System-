import '../styles/Header.css';

export default function Header({ connected, numFloors, onReset }) {
  const statusLabel =
    connected === null ? 'CONNECTING' : connected ? 'LIVE' : 'OFFLINE';
  const statusClass =
    connected === null ? 'is-pending' : connected ? 'is-live' : 'is-offline';

  return (
    <header className="header">
      <div className="header__brand">
        <div className="header__mark">G</div>
        <div>
          <h1 className="header__title">Gera Elevator Control</h1>
          <p className="header__subtitle">
            {numFloors}-floor shaft · dispatch simulation
          </p>
        </div>
      </div>

      <div className="header__right">
        <div className={`status-pill ${statusClass}`}>
          <span className="status-pill__dot" />
          {statusLabel}
        </div>
        <button className="btn btn--ghost" onClick={onReset} type="button">
          Reset all cars
        </button>
      </div>
    </header>
  );
}
