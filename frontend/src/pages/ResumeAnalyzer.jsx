import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

const ResumeAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (selectedFile) => {
        if (!selectedFile) return;

        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(selectedFile.type)) {
            setError('Please upload a PDF or DOCX file.');
            setFile(null);
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size exceeds 5MB limit.');
            setFile(null);
            return;
        }

        setFile(selectedFile);
        setError('');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const { data } = await api.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate(`/resume/report/${data._id}`);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Failed to analyze resume. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-primary text-sm font-bold mb-4">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI-Powered Career Tools
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
                        Resume <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Analyzer</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Upload your resume and get instant AI-driven feedback, skill matching, and structural scoring to help you land your dream job.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">
                    {/* Upload Area */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-300 p-12 text-center 
                            ${isDragging ? 'border-primary bg-indigo-50/50 scale-[1.01]' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}
                            ${file ? 'bg-indigo-50/30' : ''}`}
                        onClick={() => !loading && fileInputRef.current.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf,.docx"
                        />

                        {file ? (
                            <div className="space-y-4">
                                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                                    <FileText className="w-10 h-10 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">{file.name}</p>
                                    <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                    className="text-sm font-bold text-red-500 hover:text-red-600"
                                >
                                    Remove and choose another
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <Upload className="w-10 h-10 text-gray-400 group-hover:text-primary transition-colors" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">Click or drag resume here</p>
                                    <p className="text-sm text-gray-500 mt-2">Supports PDF and DOCX (Max 5MB)</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center text-red-700">
                            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-8">
                        <button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className={`w-full py-4 rounded-2xl text-lg font-black transition-all duration-300 flex items-center justify-center space-x-3
                                ${!file || loading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-primary text-white hover:bg-black hover:shadow-2xl hover:shadow-indigo-200 active:scale-95'}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>Analyzing Resume...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-6 h-6" />
                                    <span>Analyze My Resume</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Security Info */}
                    <div className="mt-8 flex items-center justify-center space-x-6 text-xs text-gray-400 font-medium">
                        <div className="flex items-center">
                            <ShieldCheck className="w-4 h-4 mr-1.5 text-green-500" />
                            Secure processing
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1.5 text-green-500" />
                            Deleted after analysis
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Smart Scoring', desc: 'Get a professional score based on industry standards.' },
                        { title: 'Skill Detection', desc: 'Find missing keywords for your target tech roles.' },
                        { title: 'AI Suggestions', desc: 'Personalized bullet point rewrites using GPT-4.' }
                    ].map((feature, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white border border-gray-100 text-center">
                            <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-500">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResumeAnalyzer;
