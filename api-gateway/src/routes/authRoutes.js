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
    const response = await axios.get(`${AUTH_SERVICE_URL}/info`, {
      headers: { Authorization: req.headers.authorization }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
  }
});
router.put('/changePassword', async (req, res) => {
  try {
    const response = await axios.put(`${AUTH_SERVICE_URL}/changePassword`, req.body, {
      headers: { Authorization: req.headers.authorization }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error from service:", error.response.data);
      console.error("Status Code:", error.response.status);
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
      res.status(500).json({ error: "No response from service" });
    } else {
      console.error("Request error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

});
router.post('/forgotPassword', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/forgotPassword`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error from service:", error.response.data);
      console.error("Status Code:", error.response.status);
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
      res.status(500).json({ error: "No response from service" });
    } else {
      console.error("Request error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

});
router.put('/resetPassword', async (req, res) => {
  try {
    const response = await axios.put(`${AUTH_SERVICE_URL}/resetPassword`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error from service:", error.response.data);
      console.error("Status Code:", error.response.status);
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
      res.status(500).json({ error: "No response from service" });
    } else {
      console.error("Request error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

});
module.exports = router;
