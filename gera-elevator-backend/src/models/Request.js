const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['EXTERNAL', 'INTERNAL'], required: true },

    // EXTERNAL fields
    floor: Number,
    direction: String,

    // INTERNAL fields
    elevatorId: String,
    destinationFloor: Number,

    // Result of assignment (both types)
    assignedElevator: String,
    estimatedArrivalTime: Number,
    stopsUpdated: [Number],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);
