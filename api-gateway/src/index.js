require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Cấu hình CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Import routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Add routes for room and payment services here
// const roomRoutes = require('./routes/roomRoutes');
// app.use('/room', roomRoutes);
// const paymentRoutes = require('./routes/paymentRoutes');
// app.use('/payment', paymentRoutes);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
