require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/database_config'); 
const app = express();
const PORT = process.env.PORT || 2000;
// Cấu hình CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

connectDB();

app.use(express.json());

// Import routes
const contractRoutes = require('./routes/contractRoutes');
app.use('/contracts', contractRoutes);

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
