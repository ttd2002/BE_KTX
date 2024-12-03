const equipmentService = require('../services/equipmentService');

exports.getEquipsByRoom = async (req, res) => {
    try {
        let roomName;
        if (req.user && req.user.roomName) {
            roomName = req.user.roomName;
        } else if (req.params.roomName && req.user.isAdmin) {
            roomName = req.params.roomName;
        } else {
            return res.status(403).json({ error: 'need params for roomName' });
        }
        const equipments = await equipmentService.getEquipByRoom(roomName);
        res.status(200).json(equipments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getAllEquips = async (req, res) => {
    try {
        if (!req.user || typeof req.user.isAdmin === 'undefined') {
            return res.status(403).json({ error: 'Only admin can get this list' });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Only admin can get this list' });
        }
        const equipments = await equipmentService.getEquipments();
        res.status(200).json(equipments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.addEquipments = async (req, res) => {
    try {
        if (!req.user || typeof req.user.isAdmin === 'undefined') {
            return res.status(403).json({ error: 'Only admin can use this function' });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Only admin can use this function' });
        }
        const equipments = await equipmentService.addEquipments(req.body);
        res.status(200).json(equipments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateEquipment = async (req, res) => {
    try {
        if (!req.user || typeof req.user.isAdmin === 'undefined') {
            return res.status(403).json({ error: 'Only admin can use this function' });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Only admin can use this function' });
        }
        const equipment = await equipmentService.updateEquipment(req.params.key, req.body);
        res.status(200).json(equipment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};