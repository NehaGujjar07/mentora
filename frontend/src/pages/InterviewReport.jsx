import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Award, Target, TrendingUp, CheckCircle2, ChevronRight, BookOpen, RefreshCw, Star } from 'lucide-react';

const InterviewReport = () => {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data } = await api.get(`/interview/${id}`);
                setReport(data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch report:', err);
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex flex-col justify-center items-center h-screen bg-gray-50/50">
            <RefreshCw className="w-12 h-12 text-primary animate-spin mb-6" />
            <h2 className="text-2xl font-black text-gray-900">Finalizing Evaluation...</h2>
            <p className="text-gray-500 font-medium">AI is compiling your performance metrics.</p>
        </div>
    );

    if (!report) return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">Report not found</h2>
                <Link to="/interview/setup" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all inline-block">
                    Start New Interview
                </Link>
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Hero Header */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 h-full flex flex-col justify-between overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                        <div className="relative">
                            <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
                                <div className="relative">
                                    <svg className="w-48 h-48 transform -rotate-90">
                                        <circle cx="96" cy="96" r="84" className="stroke-gray-100 fill-none stroke-[16]" />
                                        <circle
                                            cx="96" cy="96" r="84"
                                            className={`fill-none stroke-[16] transition-all duration-1000 ease-out 
                                                ${report.overallScore >= 80 ? 'stroke-green-500' : report.overallScore >= 60 ? 'stroke-yellow-500' : 'stroke-red-500'}`}
                                            strokeDasharray={527}
                                            strokeDashoffset={527 - (527 * report.overallScore) / 100}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-6xl font-black ${getScoreColor(report.overallScore)}`}>{report.overallScore}</span>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Average</span>
                                    </div>
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Interview Outcome</h1>
                                    <p className="text-gray-500 font-bold mb-6 italic">{report.role} • {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                        <div className="bg-primary/10 text-primary px-6 py-2.5 rounded-2xl text-sm font-black flex items-center shadow-sm">
                                            <Star className="w-4 h-4 mr-2" /> Level: {report.readinessLevel}
                                        </div>
                                        <div className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-2xl text-sm font-black flex items-center shadow-sm">
                                            <Target className="w-4 h-4 mr-2" /> Goal: Market Ready
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-gray-50 rounded-3xl border border-gray-100 relative">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">AI Executive Summary</h3>
                            <p className="text-gray-700 font-bold leading-relaxed">{report.aiSummary.feedback}</p>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-gray-900/30">
                        <Award className="w-20 h-20 text-white/5 absolute -top-4 -right-4" />
                        <h3 className="text-2xl font-black mb-8 flex items-center">
                            <TrendingUp className="w-6 h-6 mr-3 text-primary" /> Personalized Roadmap
                        </h3>

                        <div className="space-y-8">
                            <div>
                                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Recommended Courses</h4>
                                <div className="space-y-3">
                                    {report.aiSummary.recommendedCourses.map((course, i) => (
                                        <div key={i} className="flex items-center p-4 bg-white/10 rounded-2xl hover:bg-white/15 transition-all text-sm font-black">
                                            <BookOpen className="w-4 h-4 mr-3 text-primary" /> {course}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Critical Next Steps</h4>
                                <div className="space-y-3">
                                    {report.aiSummary.nextSteps.map((step, i) => (
                                        <div key={i} className="flex items-start text-sm font-bold text-white/80">
                                            <CheckCircle2 className="w-4 h-4 mr-3 text-green-400 flex-shrink-0 mt-0.5" /> {step}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button className="mt-10 w-full bg-white text-gray-900 py-4 rounded-2xl font-black flex items-center justify-center hover:bg-gray-100 transition-all">
                            Explore Curriculum <ChevronRight className="ml-2 w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Score Detail Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Technical Accuracy', key: 'technicalScore', color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Structure & Logic', key: 'structureScore', color: 'text-purple-500', bg: 'bg-purple-50' },
                        { label: 'Explanation Depth', key: 'depthScore', color: 'text-green-500', bg: 'bg-green-50' },
                        { label: 'Confidence Score', key: 'confidenceScore', color: 'text-orange-500', bg: 'bg-orange-50' }
                    ].map((metric) => {
                        const score = Math.round(report.questions.reduce((acc, q) => acc + (q.evaluation?.[metric.key] || 0), 0) / report.questions.length);
                        return (
                            <div key={metric.key} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{metric.label}</h4>
                                <div className={`text-3xl font-black ${metric.color} mb-1`}>{score * 10}%</div>
                                <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden mt-2">
                                    <div className={`h-full ${metric.bg.replace('bg-', 'bg-').split(' ')[0].replace('50', '500')} rounded-full`} style={{ width: `${score * 10}%` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Question Breakdown */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <h3 className="text-2xl font-black text-gray-900 mb-10 tracking-tight">Technical Breakdown per Question</h3>

                    <div className="space-y-12">
                        {report.questions.map((q, i) => (
                            <div key={i} className="group relative">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="md:w-1/3">
                                        <div className="flex items-center mb-4">
                                            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm mr-3">Q{i + 1}</span>
                                            <h4 className="text-base font-black text-gray-900 leading-tight">{q.questionText}</h4>
                                        </div>
                                        <div className={`text-2xl font-black ${getScoreColor(q.score * 10)} ml-11`}>{q.score * 10}% <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Score</span></div>
                                    </div>
                                    <div className="md:w-2/3 space-y-4">
                                        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                            <p className="text-sm text-gray-500 font-black uppercase tracking-widest mb-2">Your Lead Answer</p>
                                            <p className="text-gray-700 font-medium italic">"{q.userAnswer}"</p>
                                        </div>
                                        <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                                            <p className="text-sm text-primary font-black uppercase tracking-widest mb-2">AI Optimized Version</p>
                                            <p className="text-gray-700 font-medium leading-relaxed italic">"{q.evaluation.improvedAnswer}"</p>
                                        </div>
                                    </div>
                                </div>
                                {i !== report.questions.length - 1 && <div className="h-px bg-gray-100 w-full mt-12" />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link to="/interview/setup" className="bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 transform hover:-translate-y-1 transition-all inline-flex items-center">
                        Practice Again <RefreshCw className="ml-3 w-6 h-6" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InterviewReport;
