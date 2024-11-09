const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const Student = require('../database/models/Student');
const Admin = require('../database/models/AdminAccount');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const otpMemory = {};

const register = async (studentId, name, phoneNumber, gender, password, className) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kiểm tra xem studentId đã tồn tại hay chưa
    const existingUser = await Student.findOne({ studentId });
    if (existingUser) throw new Error('Student ID already exists');

    const newUser = new Student({
        studentId,
        name,
        phoneNumber,
        gender,
        password: hashedPassword,
        className
    });

    await newUser.save();

    return { studentId, name, phoneNumber, gender, className };
};

const login = async (username, password) => {
    let user = await Student.findOne({ studentId: username });
    let isAdminAccount = false;
    let role = null;

    if (!user) {
        user = await Admin.findOne({ username: username });
        if (!user || !user.isAdmin) throw new Error('Invalid credentials');
        isAdminAccount = true;
        role = user.role;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const tokenPayload = isAdminAccount
        ? { adminId: user._id, isAdmin: true, role: role }
        : { studentId: user.studentId, isAdmin: false };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token };
};

module.exports = { login };



const sendOtp = async (phoneNumber) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpMemory[phoneNumber] = otp;

    try {
        await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+${phoneNumber}`
        });
        return { message: "OTP sent successfully" };
    } catch (error) {
        throw new Error("Failed to send OTP");
    }
};

const verifyOtp = async (otp, phoneNumber) => {
    if (otpMemory[phoneNumber] === otp) {
        delete otpMemory[phoneNumber];
        return true;
    } else {
        throw new Error("Invalid OTP");
    }
};

module.exports = { register, login, sendOtp, verifyOtp };
