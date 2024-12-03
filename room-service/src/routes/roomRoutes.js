const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const auth = require('../middlewares/authMiddleware');

router.get('/rooms', roomController.getBuildings);
router.get('/getRoomsForRegister', auth, roomController.getRoomsForRegister);
router.get('/getRoomsAvailable/:gender', auth, roomController.getRoomsAvailable);
router.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", message: "Room service is running" });
});
module.exports = router;
