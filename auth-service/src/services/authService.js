const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const firebaseAdmin = require('firebase-admin');
const db = firebaseAdmin.firestore();

const register = async (studentId, name, phoneNumber, gender, password, className) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = db.collection('users').doc(studentId);

    const userDoc = await userRef.get();
    if (userDoc.exists) throw new Error('Student ID already exists');

    await userRef.set({
        studentId,
        name,
        phoneNumber,
        gender,
        password: hashedPassword,
        className,
        address: "",    
        email: "",
        roomName: "",
        isLeader: false,
        equipmentName: "",
    });

    return { studentId, name, phoneNumber, gender, className };
};

const login = async (studentId, password) => {
    const userRef = db.collection('users').doc(studentId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) throw new Error('Invalid credentials');

    const user = userDoc.data();
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ studentId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, studentId };
};

const verifyOtp = async (otp, phoneNumber) => {
    const verification = await firebaseAdmin.auth().verifyIdToken(otp);
    if (verification.phone_number !== phoneNumber) throw new Error('Invalid OTP');
    return verification;
};

module.exports = { register, login, verifyOtp };
