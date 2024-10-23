const express = require('express');
const router = express.Router();

// Placeholder routes for room management
router.get('/', (req, res) => {
  res.send("Room management service is working!");
});

// You can add more routes here for room creation, deletion, etc.

module.exports = router;
