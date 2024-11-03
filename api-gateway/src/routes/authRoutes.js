const express = require('express');
const axios = require('axios');
const router = express.Router();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/register`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/login`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
  }
});

// Gửi OTP
router.post('/send-otp', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/send-otp`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
  }
});

// Xác thực OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/verify-otp`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
  }
});

// Thông tin người dùng
router.get('/info', async (req, res) => {
  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/info`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
  }
});

module.exports = router;
