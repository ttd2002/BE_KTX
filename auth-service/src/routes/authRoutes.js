const express = require('express');
const {
  registerController,
  loginController,
  verifyOtpController,
  sendOtpController,
  getStudentInfoController
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/send-otp', sendOtpController);
router.post('/verify-otp', verifyOtpController);
router.get('/info', authMiddleware, getStudentInfoController);

module.exports = router;
