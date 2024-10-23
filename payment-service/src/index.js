require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json());

// Import routes
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/payment', paymentRoutes);

app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});
