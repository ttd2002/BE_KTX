const express = require('express');
const studentController = require('../controllers/studentController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/addStudent', auth, studentController.addStudent);
router.delete('/deleteStudent/:id', auth, studentController.deleteStudent);
router.put('/updateStudent/:id', auth, studentController.updateStudent);
router.put('/updateStudent', auth, studentController.updateStudent);
router.get('/getStudentsByRoom', auth, studentController.getStudentsByRoom);
router.put('/selectRoom/:roomName', auth, studentController.selectRoom);
router.get('/getStudentsByStatus', auth, studentController.getStudentsByStatus);

module.exports = router;
