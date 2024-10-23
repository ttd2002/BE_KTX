require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Import routes
const roomRoutes = require('./routes/roomRoutes');
app.use('/room', roomRoutes);

app.listen(PORT, () => {
  console.log(`Room service running on port ${PORT}`);
});
