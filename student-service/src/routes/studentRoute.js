const express = require('express');
const studentController = require('../controllers/studentController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/addStudent', auth, studentController.addStudent);
router.delete('/deleteStudent/:id', auth, studentController.deleteStudent);
router.put('/updateStudent/:id', auth, studentController.updateStudent);
router.put('/updateStudent', auth, studentController.updateStudent);
router.get('/getStudentsByRoom', auth, studentController.getStudentsByRoom);
router.get('/getStudentsByRoom/:roomName', auth, studentController.getStudentsByRoom);
router.put('/selectRoom/:roomName', auth, studentController.selectRoom);
router.get('/getStudentsByStatus', auth, studentController.getStudentsByStatus);
router.get('/getStudentsInDorm', auth, studentController.getStudentsInDorm);
router.put('/approveAll', auth, studentController.approvePendingStudents);
router.put('/approve/:studentId', auth, studentController.approveStudent);
router.put('/revertApproved', auth, studentController.revertApprovedStudents);

router.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", message: "Student service is running" });
});
module.exports = router;
