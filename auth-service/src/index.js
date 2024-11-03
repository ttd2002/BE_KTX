require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/database_config'); 
const app = express();
const PORT = process.env.PORT || 3000;
// Cấu hình CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Kết nối tới MongoDB
connectDB();

app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
