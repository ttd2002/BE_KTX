const equipmentService = require('../services/equipmentService');

exports.getStudentsByRoom = async (req, res) => {
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