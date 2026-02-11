const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const { analyzeResume } = require('../services/resumeService');
const { generateAIFeedback } = require('../services/aiService');
const ResumeAnalysis = require('../models/ResumeAnalysis');

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const filePath = req.file.path;
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        let extractedText = '';

        // 1. Extract text based on file type
        try {
            if (fileExt === '.pdf') {
                const dataBuffer = fs.readFileSync(filePath);
                const data = await pdf(dataBuffer);
                extractedText = data.text;
            } else if (fileExt === '.docx') {
                const result = await mammoth.extractRawText({ path: filePath });
                extractedText = result.value;
            } else {
                throw new Error('Unsupported file format');
            }
        } catch (error) {
            console.error('File Extraction Error:', error);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            return res.status(400).json({ message: `Failed to extract text: ${error.message}` });
        }

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        if (!extractedText || extractedText.trim().length < 50) {
            return res.status(400).json({ message: 'Resume content seems too short or empty' });
        }

        // 2. Algorithmic Analysis
        const analysis = analyzeResume(extractedText);

        // 3. AI Feedback Generation
        const aiFeedback = await generateAIFeedback(
            extractedText,
            analysis.score,
            analysis.weaknesses,
            analysis.missingSections
        );

        // 4. Save to Database
        const newAnalysis = new ResumeAnalysis({
            userId: req.user._id,
            score: analysis.score,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            missingSections: analysis.missingSections,
            detectedSkills: analysis.detectedSkills,
            aiFeedback: aiFeedback,
            fileName: req.file.originalname,
            fileType: fileExt
        });

        await newAnalysis.save();
        res.status(201).json(newAnalysis);

    } catch (error) {
        console.error('Resume Upload Controller Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAnalysisHistory = async (req, res) => {
    try {
        const history = await ResumeAnalysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history' });
    }
};

const getAnalysisById = async (req, res) => {
    try {
        const analysis = await ResumeAnalysis.findById(req.params.id);
        if (!analysis || analysis.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Analysis not found' });
        }
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analysis' });
    }
};

module.exports = {
    uploadResume,
    getAnalysisHistory,
    getAnalysisById
};
