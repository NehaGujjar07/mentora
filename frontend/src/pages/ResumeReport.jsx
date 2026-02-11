import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { CheckCircle2, XCircle, BrainCircuit, Target, Lightbulb, ArrowRight, Download, Share2, Award, Zap, ChevronRight } from 'lucide-react';

const ResumeReport = () => {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data } = await api.get(`/resume/${id}`);
                setReport(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching report:', err);
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex flex-col justify-center items-center h-screen bg-gray-50/50">
            <Zap className="w-12 h-12 text-primary animate-pulse mb-6" />
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-gray-900">Evaluating your expertise...</h2>
                <p className="text-gray-500">Our AI is generating your personalized career report.</p>
            </div>
        </div>
    );

    if (!report) return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Report not found</h2>
                <Link to="/resume/analyzer" className="text-primary font-bold hover:underline">Go back to analyzer</Link>
            </div>
        </div>
    );

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header & Score Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-center">
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-12">
                            <div className="relative">
                                <svg className="w-40 h-40 transform -rotate-90">
                                    <circle cx="80" cy="80" r="70" className="stroke-gray-100 fill-none stroke-[12]" />
                                    <circle
                                        cx="80" cy="80" r="70"
                                        className={`fill-none stroke-[12] transition-all duration-1000 ease-out 
                                            ${report.score >= 80 ? 'stroke-green-500' : report.score >= 60 ? 'stroke-yellow-500' : 'stroke-red-500'}`}
                                        strokeDasharray={440}
                                        strokeDashoffset={440 - (440 * report.score) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-gray-900">{report.score}</span>
                                    <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Score</span>
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-black text-gray-900 mb-2">Resume Evaluation</h1>
                                <p className="text-gray-500 font-medium mb-6">File: {report.fileName}</p>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {report.score >= 80 ? (
                                        <div className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center">
                                            <Award className="w-4 h-4 mr-2" /> Resume is Market-Ready
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center">
                                            <Target className="w-4 h-4 mr-2" /> Improvement Recommended
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary rounded-3xl p-8 shadow-xl shadow-indigo-200/50 text-white flex flex-col justify-center relative overflow-hidden">
                        <sparkles className="absolute top-0 right-0 w-32 h-32 text-indigo-100/10 -mr-8 -mt-8" />
                        <h3 className="text-xl font-black mb-4 flex items-center">
                            <BrainCircuit className="w-6 h-6 mr-2" /> AI Summary
                        </h3>
                        <p className="text-indigo-50 leading-relaxed font-medium">
                            {report.aiFeedback.summaryFeedback}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Detailed Analysis */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Skills Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                                <Target className="w-6 h-6 mr-3 text-primary" /> Detected Skills
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {report.detectedSkills.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold border border-gray-100">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Rewrite Examples */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                                <Lightbulb className="w-6 h-6 mr-3 text-yellow-500" /> Improvement Examples
                            </h3>
                            <div className="space-y-6">
                                {report.aiFeedback.rewrittenExamples.map((example, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
                                        <p className="text-gray-700 font-medium italic">{example}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detailed Suggestions */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                                <BrainCircuit className="w-6 h-6 mr-3 text-purple-500" /> Critical Suggestions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {report.aiFeedback.detailedSuggestions.map((suggestion, i) => (
                                    <div key={i} className="flex items-start p-4 bg-purple-50/30 rounded-2xl">
                                        <ChevronRight className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm font-medium text-purple-900">{suggestion}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Strengths & Weaknesses */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center uppercase tracking-wider">
                                <CheckCircle2 className="w-5 h-5 mr-3 text-green-500" /> Strengths
                            </h3>
                            <ul className="space-y-4">
                                {report.strengths.map((str, i) => (
                                    <li key={i} className="flex items-start text-sm text-gray-600 font-medium">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                                        {str}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center uppercase tracking-wider">
                                <XCircle className="w-5 h-5 mr-3 text-red-500" /> Areas for Improvement
                            </h3>
                            <ul className="space-y-4">
                                {report.weaknesses.map((weak, i) => (
                                    <li key={i} className="flex items-start text-sm text-gray-600 font-medium">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                                        {weak}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-gray-900 rounded-3xl p-8 text-white text-center">
                            <p className="text-sm text-gray-400 mb-6 font-medium uppercase tracking-widest">Share this result</p>
                            <div className="flex justify-center space-x-4">
                                <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeReport;
