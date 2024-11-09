const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  roomNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  available: { type: String, required: true },
  price: { type: Number, required: true },
  availableForRegistration: { type: Boolean, required: true },
  gender: { type: String, required: true },
});

const floorSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  floorNumber: { type: Number, required: true },
  rooms: [roomSchema],
});

const buildingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  buildingName: { type: String, required: true },
  floors: [floorSchema],
});

module.exports = mongoose.model('Building', buildingSchema);
