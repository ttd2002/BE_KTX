const express = require('express');
const axios = require('axios');
const router = express.Router();

const ROOM_SERVICE_URL = process.env.ROOM_SERVICE_URL;


router.get('/rooms', async (req, res) => {
  try {
    const response = await axios.get(`${ROOM_SERVICE_URL}/rooms`);
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
router.get('/getRoomsForRegister', async (req, res) => {
  try {
    const response = await axios.get(`${ROOM_SERVICE_URL}/getRoomsForRegister`, {
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


router.get('/getRoomsAvailable/:gender', async (req, res) => {
  try {
    const response = await axios.get(`${ROOM_SERVICE_URL}/getRoomsAvailable/${req.params.gender}`, {
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

module.exports = router;
