const express = require('express');
const axios = require('axios');
const router = express.Router();

const STUDENT_SERVICE_URL = process.env.STUDENT_SERVICE_URL;

// Thêm sinh viên
router.post('/addStudent', async (req, res) => {
    try {
        const response = await axios.post(`${STUDENT_SERVICE_URL}/addStudent`, req.body, {
            headers: { Authorization: req.headers.authorization }
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            res.status(500).json({ error: "No response from service" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Xóa sinh viên theo ID
router.delete('/deleteStudent/:id', async (req, res) => {
    try {
        const response = await axios.delete(`${STUDENT_SERVICE_URL}/deleteStudent/${req.params.id}`, {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            res.status(500).json({ error: "No response from service" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Cập nhật sinh viên theo ID (với params)
router.put('/updateStudent/:id', async (req, res) => {
    try {
        const response = await axios.put(`${STUDENT_SERVICE_URL}/updateStudent/${req.params.id}`, req.body, {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            res.status(500).json({ error: "No response from service" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Cập nhật sinh viên không cần ID (sử dụng token để lấy ID)
router.put('/updateStudent', async (req, res) => {
    try {
        const response = await axios.put(`${STUDENT_SERVICE_URL}/updateStudent`, req.body, {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            res.status(500).json({ error: "No response from service" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Lấy danh sách sinh viên theo phòng
router.get('/getStudentsByRoom', async (req, res) => {
    try {
        const response = await axios.get(`${STUDENT_SERVICE_URL}/getStudentsByRoom`, {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            res.status(500).json({ error: "No response from service" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});
router.get('/getStudentsByRoom/:roomName', async (req, res) => {
    try {
        const response = await axios.get(`${STUDENT_SERVICE_URL}/getStudentsByRoom/${req.params.roomName}`, {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            res.status(500).json({ error: "No response from service" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Chọn phòng cho sinh viên
router.put('/selectRoom/:roomName', async (req, res) => {
    try {
        const response = await axios.put(`${STUDENT_SERVICE_URL}/selectRoom/${req.params.roomName}`, req.body, {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            res.status(500).json({ error: "No response from service" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Lấy danh sách sinh viên theo trạng thái
router.get('/getStudentsByStatus', async (req, res) => {
    try {
        const response = await axios.get(`${STUDENT_SERVICE_URL}/getStudentsByStatus`, {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            res.status(500).json({ error: "No response from service" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;
