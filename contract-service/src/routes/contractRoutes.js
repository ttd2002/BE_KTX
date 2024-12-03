const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const auth = require('../middlewares/authMiddleware');

router.get('/getContractsByStudentId', auth, contractController.getContractsByStudentId);
router.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", message: "Room Contract is running" });
});
module.exports = router;
