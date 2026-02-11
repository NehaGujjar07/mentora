import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Briefcase, Target, Layers, Play, ChevronRight, Info } from 'lucide-react';

const InterviewSetup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        role: 'Frontend Developer',
        difficulty: 'Medium',
        type: 'Technical'
    });

    const roles = [
        'Frontend Developer', 'Backend Developer', 'Fullstack Developer',
        'Data Scientist', 'Product Manager', 'UX Designer',
        'DevOps Engineer', 'Mobile Developer', 'AI/ML Engineer'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/interview/start', formData);
            navigate(`/interview/session/${data.sessionId}`);
        } catch (err) {
            console.error('Failed to start interview:', err);
            alert('Failed to initialize interview. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
                        <Target className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">AI Mock Interview</h1>
                    <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
                        Sharpen your skills with our industry-leading AI interviewer. Get realistic questions and instant professional feedback.
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 overflow-hidden relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full -ml-32 -mb-32 blur-3xl" />

                    <form onSubmit={handleSubmit} className="relative space-y-8">
                        {/* Role Selection */}
                        <div className="space-y-4">
                            <label className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                                <Briefcase className="w-4 h-4 mr-2" /> Target Role
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {roles.map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role })}
                                        className={`px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 border-2 text-left flex items-center justify-between
                                            ${formData.role === role
                                                ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10'
                                                : 'border-gray-50 bg-gray-50 hover:border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        {role}
                                        {formData.role === role && <ChevronRight className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            {/* Difficulty */}
                            <div className="space-y-4">
                                <label className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                                    <Layers className="w-4 h-4 mr-2" /> Difficulty Level
                                </label>
                                <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                    {['Easy', 'Medium', 'Hard'].map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, difficulty: level })}
                                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300
                                                ${formData.difficulty === level
                                                    ? 'bg-white text-gray-900 shadow-md'
                                                    : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Interview Type */}
                            <div className="space-y-4">
                                <label className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                                    <Info className="w-4 h-4 mr-2" /> Interview Focus
                                </label>
                                <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                    {['Technical', 'Behavioral', 'Mixed'].map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: t })}
                                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300
                                                ${formData.type === t
                                                    ? 'bg-white text-gray-900 shadow-md'
                                                    : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Start Interview Session <Play className="ml-3 w-5 h-5 fill-current" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-gray-400 text-sm font-medium mt-6">
                                Estimated duration: 15-20 minutes • 5 structured questions
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InterviewSetup;
