const mongoose = require('mongoose');

const elevatorSchema = new mongoose.Schema(
  {
    elevatorId: { type: String, required: true, unique: true }, // "A", "B", "C", "D"
    currentFloor: { type: Number, default: 1 },
    direction: { type: String, enum: ['UP', 'DOWN', 'IDLE'], default: 'IDLE' },
    stops: { type: [Number], default: [] }, // sorted in travel order
    status: { type: String, enum: ['MOVING', 'IDLE', 'DOOR_OPEN'], default: 'IDLE' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Elevator', elevatorSchema);
