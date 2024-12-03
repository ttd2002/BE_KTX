const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    className: {
        type: String
    },
    address: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    roomName: {
        type: String,
        default: ""
    },
    isLeader: {
        type: Boolean,
        default: false
    },
    equipmentName: {
        type: String, default: ""
    },
    studentStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'unknown'],
        default: 'unknown'
    }
});

module.exports = mongoose.model('Student', userSchema);
