const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    startInterview,
    submitAnswer,
    getSessionResults,
    getInterviewHistory
} = require('../controllers/interviewController');

// All routes protected by JWT
router.use(protect);

router.post('/start', startInterview);
router.post('/answer', submitAnswer);
router.get('/history', getInterviewHistory);
router.get('/:id', getSessionResults);

module.exports = router;
