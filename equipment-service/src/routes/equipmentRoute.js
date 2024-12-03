const express = require('express');
const equipController = require('../controllers/equipmentController');
const auth = require('../middlewares/authMiddeware');

const router = express.Router();

router.get('/getEquipByRoom', auth, equipController.getEquipsByRoom);
router.get('/getEquipByRoom/:roomName', auth, equipController.getEquipsByRoom);
router.get('/getAllEquipments', auth, equipController.getAllEquips);
router.post('/addEquipments', auth, equipController.addEquipments);
router.put('/updateEquipment/:key', auth, equipController.updateEquipment);
router.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", message: "Equipment service is running" });
});

module.exports = router;
