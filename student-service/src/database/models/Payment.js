const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        enum: ['roomFee', 'utilityFee'],
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid', 'overdue'], 
        required: true,
        default: 'unpaid'
    },
    studentId: {
        type: String,
        required: true
    },
    vnp_TxnRef: {
        type: String, 
        sparse: true
    },
    paymentMethod: {
        type: String,
        enum: ['vnpay', 'cash', 'bankTransfer', 'unknown'], 
        required: true,
        default: 'unknown'
    },
    vnp_PaymentDate: {
        type: Date, 
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
