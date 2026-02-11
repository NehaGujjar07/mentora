const { OpenAI } = require('openai');
const { analyzeResume } = require('./resumeService');
const InterviewSession = require('../models/InterviewSession');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const generateAIFeedback = async (resumeText, score, weaknesses, missingSections) => {
    if (!process.env.OPENAI_API_KEY) {
        return {
            summaryFeedback: "OpenAI API key missing. Algorithmic analysis complete, but AI-driven feedback is unavailable.",
            detailedSuggestions: weaknesses,
            rewrittenExamples: ["Example: 'Led a team of 5' instead of 'Was in charge of people'"]
        };
    }

    try {
        const prompt = `
            You are an expert HR Manager and Career Coach. Analyze this resume text and provide professional feedback.
            
            EXTRACTED RESUME TEXT:
            "${resumeText.substring(0, 4000)}"
            
            ALGORITHMIC ANALYSIS:
            Score: ${score}/100
            Identified Weaknesses: ${weaknesses.join(', ')}
            Missing Sections: ${missingSections.join(', ')}

            Return a clear JSON object with the following structure:
            {
                "summaryFeedback": "A concise 2-3 sentence overview of the resume quality.",
                "detailedSuggestions": ["At least 3 specific, actionable improvement tips based on the text."],
                "rewrittenExamples": ["Provide 2-3 'Before' and 'After' examples of bullet points found in the resume, rewritten for higher impact."]
            }
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a professional resume reviewer. Always return valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return {
            summaryFeedback: "Unable to generate AI feedback at this time.",
            detailedSuggestions: weaknesses,
            rewrittenExamples: []
        };
    }
};

/**
 * Generate 5 structured interview questions based on role, difficulty and type
 */
const generateInterviewQuestions = async (role, difficulty, type) => {
    try {
        const prompt = `You are an expert technical interviewer. Generate 5 highly relevant interview questions for a ${role} position.
        Difficulty Level: ${difficulty}
        Interview Type: ${type}

        The questions should:
        1. Be realistic and commonly asked in top-tier tech companies.
        2. Increase slightly in difficulty.
        3. For Technical: focus on core concepts, problem-solving, and architecture.
        4. For Behavioral: focus on STAR method, leadership, and conflict resolution.

        Return exactly a JSON array of strings. No extra text.
        Format: ["question1", "question2", "question3", "question4", "question5"]`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a professional hiring manager. Output only valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(response.choices[0].message.content);
        // Sometimes AI returns { "questions": [...] }, handle both
        return Array.isArray(content) ? content : (content.questions || Object.values(content)[0]);

    } catch (error) {
        console.error('AI Question Generation Error:', error);
        // Fallback static questions if AI fails
        return [
            `Can you describe your experience working with ${role} technologies?`,
            "What is the most challenging project you've worked on recently?",
            "How do you handle tight deadlines and shifting priorities?",
            "Explain a core concept in your field to a non-technical person.",
            "Where do you see yourself professionally in the next 3 years?"
        ];
    }
};

/**
 * Evaluate a single interview answer
 */
const evaluateInterviewAnswer = async (question, answer, role) => {
    try {
        const prompt = `Evaluate the following interview answer for a ${role} role.
        
        Question: "${question}"
        User Answer: "${answer}"

        Provide a structured evaluation across these metrics (0-10):
        1. technicalScore: Accuracy and depth of knowledge.
        2. structureScore: Clarity and logical flow.
        3. depthScore: How well they explained 'why' or provided examples.
        4. confidenceScore: Professionalism and tone of the text.

        Also provide:
        - strengths: What they did well.
        - weaknesses: What was missing or incorrect.
        - improvedAnswer: A high-quality version of how they should have answered.

        Return ONLY a JSON object.
        Format: {
            "technicalScore": 8,
            "structureScore": 7,
            "depthScore": 6,
            "confidenceScore": 8,
            "strengths": ["...", "..."],
            "weaknesses": ["...", "..."],
            "improvedAnswer": "..."
        }`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an expert interviewer evaluation engine. Output only valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

    } catch (error) {
        console.error('AI Answer Evaluation Error:', error);
        return {
            technicalScore: 5,
            structureScore: 5,
            depthScore: 5,
            confidenceScore: 5,
            strengths: ["Provided an answer"],
            weaknesses: ["AI evaluation unavailable"],
            improvedAnswer: "OpenAI Quota Exceeded. Please check your billing settings to restore AI feedback."
        };
    }
};

/**
 * Generate final session summary
 */
const generateFinalInterviewSummary = async (role, questions) => {
    try {
        const performanceData = questions.map(q => ({
            q: q.questionText,
            score: q.score,
            weaknesses: q.evaluation?.weaknesses
        }));

        const prompt = `Based on these 5 interview responses for a ${role} role, provide a final performance summary.
        Data: ${JSON.stringify(performanceData)}

        Return a JSON object with:
        1. feedback: Overall summary of performance.
        2. readinessLevel: One of ["Beginner", "Intermediate", "Interview Ready"].
        3. nextSteps: 3 specific areas to study.
        4. recommendedCourses: 2 general course topics (e.g. ['Advanced React', 'System Design']).

        Return ONLY JSON.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a career coach. Output only valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        return {
            feedback: "Session completed. Great effort on practicing!",
            readinessLevel: "Intermediate",
            nextSteps: ["Keep practicing core concepts", "Work on structuring answers"],
            recommendedCourses: ["Data Structures", "System Design"]
        };
    }
};

module.exports = {
    generateAIFeedback,
    generateInterviewQuestions,
    evaluateInterviewAnswer,
    generateFinalInterviewSummary
};
