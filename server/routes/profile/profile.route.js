const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth.middleware');
const profileController = require('../../controllers/profile/profile.controller');

// Get student profile (includes feedback forms and responses)
router.get('/student/:studentId', auth, profileController.getStudentProfile);

// Get all students
router.get('/student', auth, profileController.getAllStudents);

// Get teacher profile (includes group feedback summary)
router.get('/teacher/:teacherId', auth, profileController.getTeacherProfile);

// Get all teachers
router.get('/teacher', auth, profileController.getAllTeachers);

module.exports = router;
