const jwt = require('jsonwebtoken');
const Student = require('../database/models/Students');
const Admin = require('../database/models/AdminAccount');
const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user;
        if (decoded.isAdmin) {
            user = await Admin.findById(decoded.adminId);
            if (!user) return res.status(401).json({ error: 'Invalid token' });

            req.user = user
        } else {
            user = await Student.findOne({ studentId: decoded.studentId });
            if (!user) return res.status(401).json({ error: 'Invalid token' });

            req.user = user
        }

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
