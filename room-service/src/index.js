require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const roomRoutes = require('./routes/roomRoutes');
const connectDB = require('./database/database_config'); 
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Kết nối MongoDB
connectDB();

// Sử dụng routes
app.use('/api', roomRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
