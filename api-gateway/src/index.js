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

const roomRoute = require('./routes/roomRoute');
app.use('/room', roomRoute);

const studentRoute = require('./routes/studentRoutes');
app.use('/students', studentRoute);

const equipmentRoute = require('./routes/equipmentRoutes');
app.use('/equipments', equipmentRoute);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
