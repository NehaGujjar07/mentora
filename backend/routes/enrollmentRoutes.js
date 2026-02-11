const express = require('express');
const router = express.Router();
const { getMyCourses, getEnrollment, markLessonComplete } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-courses', protect, getMyCourses);
router.get('/:courseId', protect, getEnrollment);
router.put('/:courseId/complete-lesson', protect, markLessonComplete);

module.exports = router;
