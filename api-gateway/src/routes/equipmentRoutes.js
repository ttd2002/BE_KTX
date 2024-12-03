const express = require('express');
const axios = require('axios');
const router = express.Router();

const EQUIPMENT_SERVICE_URL = process.env.EQUIPMENT_SERVICE_URL;


router.get('/getEquipByRoom', async (req, res) => {
    try {
        const response = await axios.get(`${EQUIPMENT_SERVICE_URL}/getEquipByRoom`, {
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

router.get('/getEquipByRoom/:roomName', async (req, res) => {
    try {
        const response = await axios.get(`${EQUIPMENT_SERVICE_URL}/getEquipByRoom/${req.params.roomName}`, {
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
router.get('/getAllEquipments', async (req, res) => {
    try {
        const response = await axios.get(`${EQUIPMENT_SERVICE_URL}/getAllEquipments`, {
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

router.post('/addEquipments', async (req, res) => {
    try {
        const response = await axios.post(`${EQUIPMENT_SERVICE_URL}/addEquipments`, req.body, {
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


router.put('/updateEquipment/:key', async (req, res) => {
    try {
        const response = await axios.put(`${EQUIPMENT_SERVICE_URL}/updateEquipment/${req.params.key}`, req.body, {
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
