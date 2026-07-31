import { ELEVATOR_IDS } from "../config";
import ElevatorCar from "./ElevatorCar.jsx";
import "../styles/BuildingView.css";

const FLOOR_HEIGHT = 33;

export default function BuildingView({
  elevators,
  numFloors,
  busyFloors,
  onCall,
}) {
  const floors = Array.from({ length: numFloors }, (_, i) => numFloors - i);
  const shaftHeight = numFloors * FLOOR_HEIGHT;
  const byId = Object.fromEntries(elevators.map((e) => [e.elevatorId, e]));

  return (
    <div className="building">
      <div className="building__head">
        <h2 className="building__title">Shaft view</h2>
        <div className="building__legend">
          <span className="legend-item">
            <i className="legend-dot legend-dot--up" /> up
          </span>
          <span className="legend-item">
            <i className="legend-dot legend-dot--down" /> down
          </span>
          <span className="legend-item">
            <i className="legend-dot legend-dot--idle" /> idle
          </span>
        </div>
      </div>

      <div className="building__scroll">
        <div className="building__grid" style={{ height: shaftHeight }}>
          {/* Floor rail: numbers + call buttons */}
          <div className="floor-rail">
            {floors.map((floor) => {
              const upKey = `${floor}-UP`;
              const downKey = `${floor}-DOWN`;
              return (
                <div
                  className="floor-rail__row"
                  key={floor}
                  style={{ height: FLOOR_HEIGHT }}
                >
                  <span className="floor-rail__num">
                    {String(floor).padStart(2, "0")}
                  </span>
                  <div className="floor-rail__calls">
                    <button
                      type="button"
                      className="call-btn call-btn--up"
                      disabled={floor === numFloors || busyFloors[upKey]}
                      onClick={() => onCall(floor, "UP")}
                      aria-label={`Call elevator up from floor ${floor}`}
                      title="Call up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="call-btn call-btn--down"
                      disabled={floor === 1 || busyFloors[downKey]}
                      onClick={() => onCall(floor, "DOWN")}
                      aria-label={`Call elevator down from floor ${floor}`}
                      title="Call down"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Shafts */}
          {ELEVATOR_IDS.map((id) => {
            const car = byId[id];
            return (
              <div className="shaft" key={id} style={{ height: shaftHeight }}>
                <div className="shaft__rungs">
                  {floors.map((f) => (
                    <div
                      className="shaft__rung"
                      key={f}
                      style={{ height: FLOOR_HEIGHT }}
                    />
                  ))}
                </div>
                {car && (
                  <ElevatorCar
                    car={car}
                    numFloors={numFloors}
                    floorHeight={FLOOR_HEIGHT}
                  />
                )}
                <div className="shaft__label">{id}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
