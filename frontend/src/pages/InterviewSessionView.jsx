import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { MessageSquare, Send, Zap, ChevronRight, Award, AlertCircle, Loader2 } from 'lucide-react';

const InterviewSessionView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [questions, setQuestions] = useState([]);


    useEffect(() => {
        const fetchInitialState = async () => {
            try {
                // We re-fetch session to see where we were (in case of refresh)
                const { data } = await api.get(`/interview/${id}`);
                setSession(data);

                // Find first unanswered question
                const index = data.questions.findIndex(q => !q.userAnswer);
                setCurrentQuestionIndex(index === -1 ? 0 : index);
                setQuestions(data.questions);

                if (data.status === 'Completed') {
                    navigate(`/interview/report/${id}`);
                }
            } catch (err) {
                console.error('Failed to fetch session:', err);
            }
        };
        fetchInitialState();
    }, [id]);


    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        if (!answer.trim() || loading) return;

        setLoading(true);
        try {
            const { data } = await api.post('/interview/answer', {
                sessionId: id,
                questionIndex: currentQuestionIndex,
                answer: answer.trim()
            });

            setFeedback(data.evaluation);
            setIsLastQuestion(data.isLastQuestion);

            // Update local state for questions
            const updatedQuestions = [...questions];
            updatedQuestions[currentQuestionIndex].userAnswer = answer;
            setQuestions(updatedQuestions);

        } catch (err) {
            console.error('Failed to submit answer:', err);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            navigate(`/interview/report/${id}`);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setFeedback(null);
            setAnswer('');
        }
    };

    if (!session || questions.length === 0) return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
    );

    const activeQuestion = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">

                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                            <MessageSquare className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">{session.role} Interview</h2>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                {session.difficulty} • {session.type} Phase
                            </p>
                        </div>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-6">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">Progress</p>
                            <p className="text-sm font-black text-primary">{currentQuestionIndex + 1} / 5</p>
                        </div>
                        <div className="w-px h-8 bg-gray-100" />
                        <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">Time Limit</p>
                            <p className="text-sm font-black text-gray-900">N/A</p>
                        </div>
                    </div>
                </div>

                {/* Main Interaction Area */}
                <div className="space-y-6">
                    {/* Question Bubble */}
                    <div className="flex justify-start">
                        <div className="max-w-xl bg-white rounded-t-3xl rounded-br-3xl p-6 md:p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            <p className="text-lg font-bold text-gray-900 leading-relaxed">
                                {activeQuestion.questionText}
                            </p>
                        </div>
                    </div>

                    {/* Feedback (if answered) */}
                    {feedback && (
                        <div className="space-y-6">
                            <div className="flex justify-end">
                                <div className="max-w-xl bg-primary text-white rounded-t-3xl rounded-bl-3xl p-6 shadow-xl shadow-primary/20">
                                    <p className="font-medium">{activeQuestion.userAnswer}</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
                                <div className="flex items-center justify-between pb-6 border-bottom border-gray-50">
                                    <h3 className="text-lg font-black text-gray-900 flex items-center">
                                        <Zap className="w-5 h-5 mr-2 text-yellow-500 fill-yellow-500" /> Real-time AI Analysis
                                    </h3>
                                    <div className="flex items-center bg-green-50 text-green-600 px-4 py-1.5 rounded-xl">
                                        <Award className="w-4 h-4 mr-2" />
                                        <span className="text-sm font-black">Question Score: {Math.round((feedback.technicalScore + feedback.structureScore + feedback.depthScore + feedback.confidenceScore) / 4)}/10</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Strengths</h4>
                                        <div className="space-y-2">
                                            {feedback.strengths.map((s, i) => (
                                                <div key={i} className="flex items-center text-sm font-bold text-gray-700">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" /> {s}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">To Improve</h4>
                                        <div className="space-y-2">
                                            {feedback.weaknesses.map((w, i) => (
                                                <div key={i} className="flex items-center text-sm font-bold text-gray-700">
                                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2" /> {w}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Model Answer</h4>
                                    <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                                        "{feedback.improvedAnswer}"
                                    </p>
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center transition-all group"
                                >
                                    {isLastQuestion ? 'Complete Interview & View Results' : 'Proceed to Next Question'}
                                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Answer Input (if not answered) */}
                    {!feedback && (
                        <div className="mt-12 bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                            <form onSubmit={handleSubmitAnswer} className="relative">
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Type your response here..."
                                    className="w-full h-40 p-6 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-medium text-gray-900 resize-none transition-all"
                                    disabled={loading}
                                />
                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center text-gray-400 text-sm font-medium">
                                        <AlertCircle className="w-4 h-4 mr-2" /> Use the STAR method for best results
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!answer.trim() || loading}
                                        className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-black flex items-center shadow-lg shadow-primary/20 disabled:opacity-50 transition-all"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Answer <Send className="ml-2 w-4 h-4" /></>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewSessionView;
