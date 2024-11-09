require('dotenv').config();
const express = require('express');
const equipmentRoutes = require('./routes/equipmentRoute');
const connectDB = require('./database/database_config');
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require('cors');

// Cấu hình CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


// Kết nối MongoDB
connectDB();

// Sử dụng routes
app.use('/equipments', equipmentRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
