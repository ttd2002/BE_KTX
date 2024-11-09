const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['good', 'damaged', 'needMaintenance', 'liquidated'], required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true }, 
  importDate: { type: Date, required: true },
});

module.exports = mongoose.model('Equipment', equipmentSchema);
