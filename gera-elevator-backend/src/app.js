const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { MONGO_URI, PORT, ELEVATOR_IDS } = require('./config');
const routes = require('./routes');
const Elevator = require('./models/Elevator');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Seed 4 elevators at floor 1, IDLE — only if they don't already exist
async function seedElevators() {
  for (const id of ELEVATOR_IDS) {
    await Elevator.findOneAndUpdate(
      { elevatorId: id },
      { $setOnInsert: { elevatorId: id, currentFloor: 1, direction: 'IDLE', stops: [] } },
      { upsert: true, new: true }
    );
  }
}

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedElevators();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
