const express = require('express');
const axios = require('axios');
const router = express.Router();

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL;

router.get('/getPaymentsByStudentId', async (req, res) => {
    try {
        const response = await axios.get(`${PAYMENT_SERVICE_URL}/getPaymentsByStudentId`, {
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
router.get('/getRoomPaymentDetails', async (req, res) => {
    try {
        const response = await axios.get(`${PAYMENT_SERVICE_URL}/getRoomPaymentDetails`, {
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
router.get('/getUtilityPayments', async (req, res) => {
    try {
        const response = await axios.get(`${PAYMENT_SERVICE_URL}/getUtilityPayments`, {
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
router.get('/getUtilityPaymentsByRoom', async (req, res) => {
    try {
        const response = await axios.get(`${PAYMENT_SERVICE_URL}/getUtilityPaymentsByRoom`, {
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
router.post('/pay/:paymentId', async (req, res) => {
    try {
        const response = await axios.post(`${PAYMENT_SERVICE_URL}/pay/${req.params.paymentId}`, req.body, {
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

router.post('/createUtilityPayments', async (req, res) => {
    try {
        const response = await axios.post(`${PAYMENT_SERVICE_URL}/createUtilityPayments`, req.body, {
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

router.post('/createUtilityPaymentForRoom', async (req, res) => {
    try {
        const response = await axios.post(`${PAYMENT_SERVICE_URL}/createUtilityPaymentForRoom`, req.body, {
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
