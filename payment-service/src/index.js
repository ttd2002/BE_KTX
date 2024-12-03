require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 6000;
const cors = require('cors');
const connectDB = require('./database/database_config'); 

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
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/payments', paymentRoutes);

app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});
