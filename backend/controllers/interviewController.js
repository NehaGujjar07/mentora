const InterviewSession = require('../models/InterviewSession');
const {
    generateInterviewQuestions,
    evaluateInterviewAnswer,
    generateFinalInterviewSummary
} = require('../services/aiService');

/**
 * Start a new interview session
 */
const startInterview = async (req, res) => {
    try {
        const { role, difficulty, type } = req.body;

        if (!role || !difficulty || !type) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // 1. Generate Questions
        const questionsList = await generateInterviewQuestions(role, difficulty, type);

        // 2. Format for DB
        const questions = questionsList.map(q => ({
            questionText: q,
            userAnswer: '',
            score: 0
        }));

        // 3. Create Session
        const session = new InterviewSession({
            userId: req.user._id,
            role,
            difficulty,
            type,
            questions,
            status: 'In Progress'
        });

        await session.save();

        res.status(201).json({
            sessionId: session._id,
            totalQuestions: questions.length,
            firstQuestion: questions[0].questionText
        });

    } catch (error) {
        console.error('Start Interview Error:', error);
        res.status(500).json({ message: 'Failed to start interview session' });
    }
};

/**
 * Handle answer submission for a specific question
 */
const submitAnswer = async (req, res) => {
    try {
        const { sessionId, questionIndex, answer } = req.body;

        const session = await InterviewSession.findById(sessionId);
        if (!session || session.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.status === 'Completed') {
            return res.status(400).json({ message: 'Session is already completed' });
        }

        const currentQuestion = session.questions[questionIndex];
        if (!currentQuestion) {
            return res.status(400).json({ message: 'Invalid question index' });
        }

        // 1. AI Evaluation
        const evaluation = await evaluateInterviewAnswer(currentQuestion.questionText, answer, session.role);

        // 2. Calculate individual score (average of metrics)
        const questionScore = Math.round(
            (evaluation.technicalScore + evaluation.structureScore + evaluation.depthScore + evaluation.confidenceScore) / 4
        );

        // 3. Update Session
        session.questions[questionIndex].userAnswer = answer;
        session.questions[questionIndex].evaluation = evaluation;
        session.questions[questionIndex].score = questionScore;

        await session.save();

        const isLastQuestion = questionIndex === session.questions.length - 1;

        res.json({
            evaluation,
            score: questionScore,
            isLastQuestion,
            nextQuestion: isLastQuestion ? null : session.questions[questionIndex + 1].questionText
        });

    } catch (error) {
        console.error('Submit Answer Error:', error);
        res.status(500).json({ message: 'Failed to evaluate answer' });
    }
};

/**
 * Complete session and get final results
 */
const getSessionResults = async (req, res) => {
    try {
        const session = await InterviewSession.findById(req.params.id);

        if (!session || session.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // If not already completed, generate final summary
        if (session.status !== 'Completed') {
            const allAnswered = session.questions.every(q => q.userAnswer && q.userAnswer.trim().length > 0);

            if (allAnswered) {
                const finalResults = await generateFinalInterviewSummary(session.role, session.questions);

                // Calculate overall score
                const totalScore = session.questions.reduce((acc, q) => acc + q.score, 0);
                const overallScore = Math.round(totalScore / session.questions.length);

                // Collect all strengths/weaknesses
                const allStrengths = [...new Set(session.questions.flatMap(q => q.evaluation?.strengths || []))].slice(0, 5);
                const allWeaknesses = [...new Set(session.questions.flatMap(q => q.evaluation?.weaknesses || []))].slice(0, 5);

                session.overallScore = overallScore;
                session.strengths = allStrengths;
                session.weaknesses = allWeaknesses;
                session.readinessLevel = finalResults.readinessLevel;
                session.aiSummary = {
                    feedback: finalResults.feedback,
                    nextSteps: finalResults.nextSteps,
                    recommendedCourses: finalResults.recommendedCourses
                };
                session.status = 'Completed';

                await session.save();
            }
        }

        res.json(session);

    } catch (error) {
        console.error('Get Session Results Error:', error);
        res.status(500).json({ message: 'Failed to retrieve session results' });
    }
};

/**
 * Get user's interview history
 */
const getInterviewHistory = async (req, res) => {
    try {
        const history = await InterviewSession.find({ userId: req.user._id })
            .select('role difficulty type overallScore readinessLevel createdAt status')
            .sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch interview history' });
    }
};

module.exports = {
    startInterview,
    submitAnswer,
    getSessionResults,
    getInterviewHistory
};
