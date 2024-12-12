const paymentService = require('../services/paymentServices');

exports.getPaymentsByStudentId = async (req, res) => {
    try {
        if (!req.user || !req.user.studentId) {
            return res.status(403).json({ message: 'Access denied. Students only.' });
        }
        const studentId = req.user.studentId;
        const payments = await paymentService.getPaymentsByStudentId(studentId);
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.payPaymentById = async (req, res) => {
    try {
        if (!req.user || !req.user.studentId) {
            return res.status(403).json({ message: 'Access denied. Students only.' });
        }
        const { paymentId } = req.params;
        const clientIp = req.ip === '::1' ? '192.168.0.1' : req.ip;
        const updatedPayment = await paymentService.createPaymentUrl(paymentId, clientIp, req.user.isLeader);
        res.status(200).json(updatedPayment);
        // res.set("Content-type", "text/html");
        // res.redirect(updatedPayment)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.handleVnpayCallback = async (req, res) => {
    try {
        const updatedPayment = await paymentService.handleVnpayReturn(req.query);
        // res.status(200).json(updatedPayment);
        console.log("updatedPayment", updatedPayment)
        res.redirect(updatedPayment);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getRoomPaymentDetails = async (req, res) => {
    try {
        if (!req.user || typeof req.user.isAdmin === 'undefined') {
            return res.status(403).json({ error: 'Only admin can use this function' });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Only admin can use this function' });
        }
        const data = await paymentService.getRoomPaymentDetails();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createUtilityPayments = async (req, res) => {
    try {
        if (!req.user || typeof req.user.isAdmin === 'undefined') {
            return res.status(403).json({ error: 'Only admin can use this function' });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Only admin can use this function' });
        }
        const data = await paymentService.createUtilityPayments(req.body.dueDate);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createUtilityPaymentForRoom = async (req, res) => {
    try {
        if (!req.user || typeof req.user.isAdmin === 'undefined') {
            return res.status(403).json({ error: 'Only admin can use this function' });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Only admin can use this function' });
        }
        const data = await paymentService.createUtilityPaymentForRoom(req.body.roomNumber, req.body.dueDate);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUtilityPayments = async (req, res) => {
    try {
        if (!req.user || typeof req.user.isAdmin === 'undefined') {
            return res.status(403).json({ error: 'Only admin can use this function' });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Only admin can use this function' });
        }
        const data = await paymentService.getUtilityPayments();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUtilityPaymentsByRoom = async (req, res) => {
    try {
        if (!req.user || !req.user.studentId) {
            return res.status(403).json({ message: 'Access denied. Students only.' });
        }
        const data = await paymentService.getUtilityPaymentsByRoom(req.user.roomName);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.calculateStatistics = async (req, res) => {
    try {
        if (!req.user || typeof req.user.isAdmin === 'undefined') {
            return res.status(403).json({ error: 'Only admin can use this function' });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Only admin can use this function' });
        }
        const data = await paymentService.calculateStatistics();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};