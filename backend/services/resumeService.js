const TECH_SKILLS = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB',
    'AWS', 'Docker', 'TypeScript', 'Express', 'Next.js', 'PostgreSQL',
    'C++', 'Ruby', 'HTML', 'CSS', 'Tailwind', 'Redux', 'Git'
];

const SECTIONS = ['Summary', 'Experience', 'Education', 'Skills', 'Projects'];

const ACTION_VERBS = ['Developed', 'Built', 'Led', 'Designed', 'Managed', 'Implemented', 'Created', 'Optimized'];

const analyzeResume = (text) => {
    const textLower = text.toLowerCase();

    // 1. Detected Skills
    const detectedSkills = TECH_SKILLS.filter(skill => {
        const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`\\b${escapedSkill}\\b`, 'i').test(textLower);
    });

    // 2. Section Detection
    const detectedSections = SECTIONS.filter(section =>
        new RegExp(`\\b${section}\\b`, 'i').test(text)
    );
    const missingSections = SECTIONS.filter(section => !detectedSections.includes(section));

    // 3. Keyword/Impact Analysis
    const foundActionVerbs = ACTION_VERBS.filter(verb =>
        new RegExp(`\\b${verb}\\b`, 'i').test(text)
    );

    // Check for metrics (numbers, percentages)
    const hasMetrics = /([0-9]+%|[0-9]+\+|[0-9]+ (users|clients|projects|million|billion))/i.test(text);

    // 4. Scoring Logic (0-100)
    let scores = {
        structure: detectedSections.length * 4, // Up to 20
        skills: Math.min(detectedSkills.length * 5, 30), // Up to 30
        impact: (foundActionVerbs.length >= 3 ? 10 : 0) + (hasMetrics ? 10 : 0), // Up to 20
        keywords: Math.min(foundActionVerbs.length * 2, 15), // Up to 15
        completeness: (missingSections.length === 0 ? 15 : (SECTIONS.length - missingSections.length) * 3) // Up to 15
    };

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    // 5. Strengths & Weaknesses
    const strengths = [];
    const weaknesses = [];

    if (detectedSkills.length > 5) strengths.push('Strong technical skill set detected.');
    if (hasMetrics) strengths.push('Good use of measurable impact and metrics.');
    if (foundActionVerbs.length > 4) strengths.push('Strong use of action-oriented language.');
    if (missingSections.length === 0) strengths.push('Excellent resume structure and completeness.');

    if (missingSections.length > 0) weaknesses.push(`Missing key sections: ${missingSections.join(', ')}.`);
    if (!hasMetrics) weaknesses.push('Lacks quantifiable metrics and measurable impact.');
    if (detectedSkills.length < 3) weaknesses.push('Technical skill section could be more robust.');
    if (foundActionVerbs.length < 3) weaknesses.push('Consider using more strong action verbs (e.g., Developed, Optimized).');

    return {
        score: Math.min(totalScore, 100),
        strengths,
        weaknesses,
        missingSections,
        detectedSkills
    };
};

module.exports = { analyzeResume };
