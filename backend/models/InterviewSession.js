const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    type: {
        type: String,
        enum: ['Technical', 'Behavioral', 'Mixed'],
        default: 'Technical'
    },
    questions: [{
        questionText: String,
        userAnswer: String,
        evaluation: {
            technicalScore: Number,
            structureScore: Number,
            depthScore: Number,
            confidenceScore: Number,
            strengths: [String],
            weaknesses: [String],
            improvedAnswer: String
        },
        score: Number
    }],
    overallScore: {
        type: Number,
        default: 0
    },
    strengths: [String],
    weaknesses: [String],
    readinessLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Interview Ready', 'Not Evaluated'],
        default: 'Not Evaluated'
    },
    aiSummary: {
        feedback: String,
        nextSteps: [String],
        recommendedCourses: [String]
    },
    status: {
        type: String,
        enum: ['In Progress', 'Completed'],
        default: 'In Progress'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
