import '../styles/ElevatorCar.css';

const DIRECTION_GLYPH = { UP: '▲', DOWN: '▼', IDLE: '●' };

export default function ElevatorCar({ car, numFloors, floorHeight }) {
  const { currentFloor, direction, status, stops } = car;
  const top = (numFloors - currentFloor) * floorHeight;
  const isDoorOpen = status === 'DOOR_OPEN';
  const isMoving = status === 'MOVING';

  return (
    <div
      className={`car car--${direction?.toLowerCase() || 'idle'} ${isDoorOpen ? 'car--doors-open' : ''} ${isMoving ? 'car--moving' : ''}`}
      style={{ top, height: floorHeight - 4 }}
      title={`Car ${car.elevatorId} · floor ${currentFloor} · ${direction} · stops: ${stops?.join(', ') || 'none'}`}
    >
      <div className="car__doors">
        <span className="car__door car__door--left" />
        <span className="car__door car__door--right" />
      </div>
      <div className="car__readout">
        <span className="car__floor">{String(currentFloor).padStart(2, '0')}</span>
        <span className="car__dir">{DIRECTION_GLYPH[direction] || '●'}</span>
      </div>
    </div>
  );
}
