const Elevator = require("./models/Elevator");
const Request = require("./models/Request");
const { assignElevator, insertStop } = require("./logic/assignElevator");
const { estimateTime } = require("./logic/estimateTime");
const { NUM_FLOORS } = require("./config");

// GET /api/elevators
async function getElevators(req, res) {
  const elevators = await Elevator.find().sort({ elevatorId: 1 });
  res.json(elevators);
}

// GET /api/elevators/:id
async function getElevator(req, res) {
  const elevator = await Elevator.findOne({
    elevatorId: req.params.id.toUpperCase(),
  });
  if (!elevator) return res.status(404).json({ error: "Elevator not found" });
  res.json(elevator);
}

// POST /api/requests/external  { floor, direction }
async function externalRequest(req, res) {
  try {
    const { floor, direction } = req.body;

    if (!floor || !["UP", "DOWN"].includes(direction)) {
      return res
        .status(400)
        .json({ error: "floor and direction (UP/DOWN) are required" });
    }
    if (floor < 1 || floor > NUM_FLOORS) {
      return res
        .status(400)
        .json({ error: `floor must be between 1 and ${NUM_FLOORS}` });
    }

    const elevators = await Elevator.find();
    if (!elevators.length)
      return res.status(500).json({ error: "No elevators configured" });

    const { elevator, eta } = assignElevator(elevators, floor, direction);

    const stops = insertStop(elevator, floor);
    elevator.stops = stops;
    if (elevator.direction === "IDLE") {
      elevator.direction =
        floor > elevator.currentFloor
          ? "UP"
          : floor < elevator.currentFloor
            ? "DOWN"
            : "IDLE";
    }
    elevator.status = elevator.currentFloor === floor ? "DOOR_OPEN" : "MOVING";
    await elevator.save();

    await Request.create({
      type: "EXTERNAL",
      floor,
      direction,
      assignedElevator: elevator.elevatorId,
      estimatedArrivalTime: eta,
      stopsUpdated: stops,
    });

    res.json({
      assignedElevator: elevator.elevatorId,
      estimatedArrivalTime: eta,
      stopsUpdated: stops,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/requests/internal  { elevatorId, destinationFloor }
async function internalRequest(req, res) {
  try {
    const { elevatorId, destinationFloor } = req.body;

    if (!elevatorId || !destinationFloor) {
      return res
        .status(400)
        .json({ error: "elevatorId and destinationFloor are required" });
    }
    if (destinationFloor < 1 || destinationFloor > NUM_FLOORS) {
      return res.status(400).json({
        error: `destinationFloor must be between 1 and ${NUM_FLOORS}`,
      });
    }

    const elevator = await Elevator.findOne({
      elevatorId: elevatorId.toUpperCase(),
    });
    if (!elevator) return res.status(404).json({ error: "Elevator not found" });

    const eta = estimateTime(elevator, destinationFloor);
    const stops = insertStop(elevator, destinationFloor);
    elevator.stops = stops;
    if (elevator.direction === "IDLE") {
      elevator.direction =
        destinationFloor > elevator.currentFloor ? "UP" : "DOWN";
    }
    elevator.status =
      elevator.currentFloor === destinationFloor ? "DOOR_OPEN" : "MOVING";
    await elevator.save();

    await Request.create({
      type: "INTERNAL",
      elevatorId: elevator.elevatorId,
      destinationFloor,
      assignedElevator: elevator.elevatorId,
      estimatedArrivalTime: eta,
      stopsUpdated: stops,
    });

    res.json({
      assignedElevator: elevator.elevatorId,
      estimatedArrivalTime: eta,
      stopsUpdated: stops,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/elevators/:id/step
// Advances one elevator by a single floor toward its next stop.
// This is what the frontend polls/calls to animate movement.
async function stepElevator(req, res) {
  try {
    const elevator = await Elevator.findOne({
      elevatorId: req.params.id.toUpperCase(),
    });
    if (!elevator) return res.status(404).json({ error: "Elevator not found" });

    if (!elevator.stops.length) {
      elevator.direction = "IDLE";
      elevator.status = "IDLE";
      await elevator.save();
      return res.json(elevator);
    }

    const nextStop = elevator.stops[0];

    if (elevator.currentFloor < nextStop) {
      elevator.currentFloor += 1;
      elevator.direction = "UP";
      elevator.status = "MOVING";
    } else if (elevator.currentFloor > nextStop) {
      elevator.currentFloor -= 1;
      elevator.direction = "DOWN";
      elevator.status = "MOVING";
    }

    if (elevator.currentFloor === nextStop) {
      elevator.stops.shift();
      elevator.status = "DOOR_OPEN";
      elevator.direction = elevator.stops.length ? elevator.direction : "IDLE";
    }

    await elevator.save();
    res.json(elevator);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/requests  (history log)
async function getRequests(req, res) {
  const requests = await Request.find().sort({ createdAt: -1 }).limit(50);
  res.json(requests);
}

// POST /api/elevators/reset
// Resets all elevators back to floor 1, IDLE, no stops — useful for testing
async function resetElevators(req, res) {
  try {
    const { ELEVATOR_IDS } = require("./config");

    const resetPromises = ELEVATOR_IDS.map((id) =>
      Elevator.findOneAndUpdate(
        { elevatorId: id },
        {
          currentFloor: 1,
          direction: "IDLE",
          stops: [],
          status: "IDLE",
        },
        { upsert: true, new: true },
      ),
    );

    const elevators = await Promise.all(resetPromises);
    res.json({ message: "All elevators reset to floor 1, IDLE", elevators });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getElevators,
  getElevator,
  externalRequest,
  internalRequest,
  stepElevator,
  getRequests,
  resetElevators,
};
