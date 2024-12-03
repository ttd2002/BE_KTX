const express = require('express');
const axios = require('axios');
const router = express.Router();

const SUPPORT_SERVICE_URL = process.env.SUPPORT_SERVICE_URL;

router.post('/addSupport', async (req, res) => {
    try {
        const response = await axios.post(`${SUPPORT_SERVICE_URL}/addSupport`, req.body, {
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
router.put('/updateSupport/:id', async (req, res) => {
    try {
        const response = await axios.put(`${SUPPORT_SERVICE_URL}/updateSupport/${req.params.id}`, req.body, {
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
router.get('/getSupports', async (req, res) => {
    try {
        console.log("req.headers.authorization", req.headers.authorization)
        const response = await axios.get(`${SUPPORT_SERVICE_URL}/getSupports`, {
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

router.get('/getSupportsByRoom', async (req, res) => {
    try {
        console.log("req.headers.authorization", req.headers.authorization)
        const response = await axios.get(`${SUPPORT_SERVICE_URL}/getSupportsByRoom`, {
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