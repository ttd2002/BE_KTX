const jwt = require('jsonwebtoken');

const getStudentInfoFromToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

module.exports = { getStudentInfoFromToken };
