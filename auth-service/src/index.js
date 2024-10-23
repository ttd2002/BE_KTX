require('dotenv').config();
const express = require('express');
const firebaseAdmin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 3000;

// Firebase setup
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_PROJECT_ID
  })
});

app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
