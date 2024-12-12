const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now, 
        required: true
    },
    from: {
        type: String,
        required: true,
        trim: true
    },
    to: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    id: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('History', historySchema);
