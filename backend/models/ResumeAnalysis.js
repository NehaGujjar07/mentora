const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    strengths: [String],
    weaknesses: [String],
    missingSections: [String],
    detectedSkills: [String],
    aiFeedback: {
        summaryFeedback: String,
        detailedSuggestions: [String],
        rewrittenExamples: [String]
    },
    fileName: String,
    fileType: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
