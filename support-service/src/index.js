require('dotenv').config();
const express = require('express');
const connectDB = require('./database/database_config');
const app = express();
const PORT = process.env.PORT || 1000;
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
const supportRoutes = require('./routes/supportRoute');
app.use('/supports', supportRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
