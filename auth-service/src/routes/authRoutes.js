const express = require('express');
const {
  registerController,
  loginController,
  verifyOtpController,
  sendOtpController,
  getStudentInfoController,
  changePasswordController,
  forgotPasswordController,
  resetPasswordController
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/send-otp', sendOtpController);
router.post('/verify-otp', verifyOtpController);
router.put('/changePassword', authMiddleware, changePasswordController);
router.post('/forgotPassword', forgotPasswordController);
router.put('/resetPassword', resetPasswordController);
router.get('/info', authMiddleware, (req, res) => {
  res.json(req.user);
});
router.get('/health', (req, res) => {
  res.status(200).json({ status: "OK", message: "Auth service is running" });
});
module.exports = router;
