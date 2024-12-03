const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    contractNumber: {
        type: String,
        required: true,
        unique: true,
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
    attachment: {
        type: String,
        required: true,
    },
    studentId: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Contract', contractSchema);
