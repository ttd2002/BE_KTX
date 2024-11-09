const studentService = require('../services/studentService');

exports.addStudent = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Only admins can add students' });
        }

        const newStudent = await studentService.addStudent(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Only admins can delete students' });
        }

        await studentService.deleteStudent(req.params.id);
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        let studentId;
        let isAdmin = false;
        if (req.user && req.user.studentId) {
            studentId = req.user.studentId;
        } else if (req.params.id && req.user.isAdmin) {
            studentId = req.params.id;
            isAdmin = true;
        } else {
            return res.status(403).json({ error: 'need params for studentId' });
        }
        const updatedStudent = await studentService.updateStudent(studentId, isAdmin, req.body);
        return res.status(200).json(updatedStudent);
    } catch (err) {
        return res.status(400).json({
            error: err.message,
        });
    }
};


exports.selectRoom = async (req, res) => {
    const { roomName } = req.params;
    const studentId = req.user.studentId;

    try {
        const result = await studentService.selectRoom(studentId, roomName);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getStudentsByStatus = async (req, res) => {
    try {
        if (!req.user || typeof req.user.isAdmin === 'undefined') {
            return res.status(403).json({ error: 'Only admin can get this list' });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Only admin can get this lista' });
        }
        const students = await studentService.getStudentsByStatus();
        res.status(200).json(students);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getStudentsByRoom = async (req, res) => {
    try {
        const roomName = req.user.roomName;
        const students = await studentService.getStudentsByRoom(roomName);
        res.status(200).json(students);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
