const express = require('express');
const router = express.Router();
const { getBuildings } = require('../controllers/roomController');

router.get('/rooms', getBuildings);

module.exports = router;
