require('dotenv').config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/gera_elevator',
  PORT: process.env.PORT || 5000,

  // Building configuration
  NUM_FLOORS: 16,
  ELEVATOR_IDS: ['A', 'B', 'C', 'D'],

  // Timing constants (all in seconds) — from the spec
  FLOOR_TIME: 30,   // time to move 1 floor
  DOOR_OPEN: 10,
  DOOR_CLOSE: 10,
};
