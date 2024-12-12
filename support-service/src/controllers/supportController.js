const supportServices = require('../services/supportService');

exports.addSupport = async (req, res) => {
    try {
        if (!req.user || !req.user.studentId) {
            return res.status(403).json({ message: 'Access denied. Students only.' });
        }
        const message = await supportServices.addSupport(req.user, req.body);
        res.status(201).json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateSupport = async (req, res) => {
    try {
        if (!req.params.id) {
            res.status(400).json('params required');
        }
        const message = await supportServices.updateSupport(req.user, req.body, req.params.id);
        res.status(201).json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getSupportsByRoom = async (req, res) => {
    try {
        if (!req.user || !req.user.studentId) {
            return res.status(403).json({ message: 'Access denied. Students only.' });
        }
        const message = await supportServices.getSupportsByRoom(req.user.roomName);
        res.status(201).json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getSupports = async (req, res) => {
    try {
        if (!req.user || typeof req.user.isAdmin === 'undefined') {
            return res.status(403).json({ error: 'Only admin can get this list' });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Only admin can get this list' });
        }
        const message = await supportServices.getSupports();
        res.status(201).json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.deleteSupport = async (req, res) => {
    try {
        if (!req.user || !req.user.studentId) {
            return res.status(403).json({ message: 'Access denied. Students only.' });
        }

        await supportServices.deleteSupport(req.params.id, req.user.studentId);
        res.status(200).json({ message: 'Support deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};