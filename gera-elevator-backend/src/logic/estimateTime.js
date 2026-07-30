const { FLOOR_TIME, DOOR_OPEN, DOOR_CLOSE } = require('../config');
const DOOR_DELAY = DOOR_OPEN + DOOR_CLOSE; // 20s per intermediate stop

/**
 * Will this elevator, continuing on its current path, pass through `floor`
 * before it needs to reverse direction?
 */
function willPass(elevator, floor) {
  if (elevator.direction === 'UP') {
    // must be above current floor, and within the range it's already committed to travel
    const farthestStop = elevator.stops.length ? Math.max(...elevator.stops) : elevator.currentFloor;
    return floor > elevator.currentFloor && floor <= farthestStop;
  }
  if (elevator.direction === 'DOWN') {
    const nearestStop = elevator.stops.length ? Math.min(...elevator.stops) : elevator.currentFloor;
    return floor < elevator.currentFloor && floor >= nearestStop;
  }
  return false; // IDLE elevators are handled by a separate priority tier
}

/**
 * Estimated seconds for `elevator` to reach `floor`, accounting for every
 * stop it must serve (open + close doors) along the way.
 */
function estimateTime(elevator, floor) {
  if (elevator.direction === 'IDLE' || elevator.stops.length === 0) {
    return Math.abs(floor - elevator.currentFloor) * FLOOR_TIME;
  }

  const goingUp = elevator.direction === 'UP';

  // Stops already queued, in the order the elevator will actually reach them
  const orderedStops = [...elevator.stops].sort((a, b) => (goingUp ? a - b : b - a));

  // Stops that lie strictly between the elevator's current position and the target floor
  const stopsBeforeTarget = orderedStops.filter((s) =>
    goingUp ? s > elevator.currentFloor && s < floor : s < elevator.currentFloor && s > floor
  );

  const distance = Math.abs(floor - elevator.currentFloor);
  return distance * FLOOR_TIME + stopsBeforeTarget.length * DOOR_DELAY;
}

module.exports = { willPass, estimateTime };
