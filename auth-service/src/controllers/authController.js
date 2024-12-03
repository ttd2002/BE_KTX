const { register, login, sendOtp, verifyOtp, changePassword, forgotPassword, resetPassword } = require('../services/authService');
const { getStudentInfoFromToken } = require('../services/tokenService');
const registerController = async (req, res) => {
  const { studentId, name, phoneNumber, gender, password, className } = req.body;
  try {
    const user = await register(studentId, name, phoneNumber, gender, password, className);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginController = async (req, res) => {
  const { studentId, password } = req.body;
  try {
    const { token } = await login(studentId, password);
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const sendOtpController = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const response = await sendOtp(phoneNumber);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const verifyOtpController = async (req, res) => {
  const { otp, phoneNumber } = req.body;
  try {
    const verification = await verifyOtp(otp, phoneNumber);
    res.status(200).json(verification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getStudentInfoController = (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const studentInfo = getStudentInfoFromToken(token);
    res.status(200).json(studentInfo);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
const changePasswordController = async (req, res) => {
  try {
    if (!req.user || !req.user.studentId) {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }
    const { oldPassword, newPassword } = req.body
    const message = await changePassword(req.user.studentId, oldPassword, newPassword);
    res.status(200).json(message);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
const forgotPasswordController = async (req, res) => {
  try {
    const studentId = req.body.studentId
    const message = await forgotPassword(studentId);
    res.status(200).json(message);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
const resetPasswordController = async (req, res) => {
  try {
    const { studentId, newPassword } = req.body
    const message = await resetPassword(studentId, newPassword);
    res.status(200).json(message);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
module.exports = {
  registerController,
  loginController,
  sendOtpController,
  verifyOtpController,
  getStudentInfoController,
  changePasswordController,
  forgotPasswordController,
  resetPasswordController
};
