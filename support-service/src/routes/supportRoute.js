const express = require('express');
const suportController = require('../controllers/supportController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/addSupport', auth, suportController.addSupport);
router.put('/updateSupport/:id', auth, suportController.updateSupport);
router.get('/getSupports', auth, suportController.getSupports);
router.get('/getSupportsByRoom', auth, suportController.getSupportsByRoom);
router.delete('/deleteSupport/:id', auth, suportController.deleteSupport);
router.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", message: "Support service is running" });
});
module.exports = router; 