const express = require('express');
const equipController = require('../controllers/equipmentController');
const auth = require('../middlewares/authMiddeware');

const router = express.Router();

router.get('/getEquipByRoom', auth, equipController.getStudentsByRoom);
router.get('/getEquipByRoom/:roomName', auth, equipController.getStudentsByRoom);


module.exports = router;
