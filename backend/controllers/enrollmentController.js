const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Get user enrollments
// @route   GET /api/enrollments/my-courses
// @access  Private
const getMyCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user._id })
            .populate('course')
            .sort('-createdAt');
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get specific enrollment
// @route   GET /api/enrollments/:courseId
// @access  Private
const getEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({
            user: req.user._id,
            course: req.params.courseId
        });

        if (enrollment) {
            res.json(enrollment);
        } else {
            res.status(404).json({ message: 'Enrollment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark lesson as completed
// @route   PUT /api/enrollments/:courseId/complete-lesson
// @access  Private
const markLessonComplete = async (req, res) => {
    try {
        const { lessonId } = req.body;
        const enrollment = await Enrollment.findOne({
            user: req.user._id,
            course: req.params.courseId
        });

        if (enrollment) {
            if (!enrollment.completedLessons.includes(lessonId)) {
                enrollment.completedLessons.push(lessonId);

                // Calculate progress
                const course = await Course.findById(req.params.courseId);
                if (course && course.lessons.length > 0) {
                    enrollment.progress = (enrollment.completedLessons.length / course.lessons.length) * 100;
                }

                await enrollment.save();
            }
            res.json(enrollment);
        } else {
            res.status(404).json({ message: 'Enrollment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMyCourses, getEnrollment, markLessonComplete };
