const express = require('express');
const registrationController = require('../controllers/registrationController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/addRegistration', auth, registrationController.addRegistration);
router.put('/updateRegistration/:id', auth, registrationController.updateRegistration);
router.get('/getRegistrations', auth, registrationController.getRegistrations);
router.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", message: "Registration service is running" });
});
module.exports = router;
