const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    roomAddress: {
        type: String,
        required: true
    },
    requestType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'processed(waitingForConfirm)', 'finished'],
        default: 'pending'
    },
    solution: {
        type: String,
        default: ""
    },
    urgency: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'low'
    },
    receiver: {
        type: String,
        default: ""
    },
    statusHistory: [
        {
            status: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

supportSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date()
        });
    }
    next();
});

module.exports = mongoose.model('Support', supportSchema);
