const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/authMiddleware');

router.get('/getPaymentsByStudentId', auth, paymentController.getPaymentsByStudentId);
router.post('/pay/:paymentId', auth, paymentController.payPaymentById);
router.get('/handleVnpayCallback', paymentController.handleVnpayCallback);
router.get('/getRoomPaymentDetails', auth, paymentController.getRoomPaymentDetails);
router.get('/getUtilityPayments', auth, paymentController.getUtilityPayments);
router.get('/getUtilityPaymentsByRoom', auth, paymentController.getUtilityPaymentsByRoom);
router.post('/createUtilityPayments', auth, paymentController.createUtilityPayments);
router.post('/createUtilityPaymentForRoom', auth, paymentController.createUtilityPaymentForRoom);
router.get('/getDashboard', auth, paymentController.calculateStatistics);

router.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", message: "Payment service is running" });
});

module.exports = router;
