require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

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
