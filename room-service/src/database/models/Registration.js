const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        trim: true
    },
    roomName: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        required: true
    },
    rejectionReason: {
        type: String,
        trim: true,
        required: function () {
            return this.status === 'rejected';
        }
    }
});

const registrationSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    applications: [applicationSchema] 
});

module.exports = mongoose.model('Registration', registrationSchema);
