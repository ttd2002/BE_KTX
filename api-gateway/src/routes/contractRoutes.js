const express = require('express');
const axios = require('axios');
const router = express.Router();

const CONTRACT_SERVICE_URL = process.env.CONTRACT_SERVICE_URL;

router.get('/getContractsByStudentId', async (req, res) => {
  try {
    const response = await axios.get(`${CONTRACT_SERVICE_URL}/getContractsByStudentId`, {
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
