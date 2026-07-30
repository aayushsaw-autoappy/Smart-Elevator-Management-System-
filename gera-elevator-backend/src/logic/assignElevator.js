const { willPass, estimateTime } = require('./estimateTime');

/**
 * Picks the elevator with the lowest ETA to `floor` out of a list of candidates.
 */
function pickBest(candidates, floor) {
  let best = null;
  let bestEta = Infinity;

  for (const elevator of candidates) {
    const eta = estimateTime(elevator, floor);
    if (eta < bestEta) {
      bestEta = eta;
      best = elevator;
    }
  }

  return { elevator: best, eta: bestEta };
}

/**
 * Priority order:
 *   1. Elevator moving in the same direction that will pass the floor — min ETA
 *   2. Nearest idle elevator
 *   3. Elevator with the minimum estimated arrival time overall
 */
function assignElevator(elevators, floor, direction) {
  const sameDirectionMatches = elevators.filter(
    (e) => e.direction === direction && willPass(e, floor)
  );
  if (sameDirectionMatches.length) {
    return pickBest(sameDirectionMatches, floor);
  }

  const idleElevators = elevators.filter((e) => e.direction === 'IDLE');
  if (idleElevators.length) {
    return pickBest(idleElevators, floor);
  }

  return pickBest(elevators, floor);
}

/**
 * Inserts `floor` into an elevator's stop list, keeping it sorted in travel order.
 * Avoids duplicate stops.
 */
function insertStop(elevator, floor) {
  const stops = new Set(elevator.stops);
  stops.add(floor);
  const arr = [...stops];
  return elevator.direction === 'DOWN' ? arr.sort((a, b) => b - a) : arr.sort((a, b) => a - b);
}

module.exports = { assignElevator, insertStop };
