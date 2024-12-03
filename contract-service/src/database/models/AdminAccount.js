const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: true 
    },
    role: {
        type: String,
        enum: ['generalManager', 'cashier', 'equipmentManager', 'maintenanceStaff'],
        required: true
    }
});

module.exports = mongoose.model('Admin', adminSchema);
