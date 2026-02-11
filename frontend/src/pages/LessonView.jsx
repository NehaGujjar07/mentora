import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { CheckCircle, Play } from 'lucide-react';

const LessonView = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch course and enrollment data in parallel
                const [courseRes, enrollmentRes] = await Promise.all([
                    api.get(`/courses/${courseId}`),
                    api.get(`/enrollments/${courseId}`)
                ]);
                setCourse(courseRes.data);
                setEnrollment(enrollmentRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
                // navigate('/dashboard'); // Handle error appropriately
            }
        };
        fetchData();
    }, [courseId, navigate]);

    const markComplete = async (lessonIndex) => {
        if (!course || !course.lessons[lessonIndex]) return;

        const lessonId = course.lessons[lessonIndex]._id;
        try {
            const { data } = await api.put(`/enrollments/${courseId}/complete-lesson`, {
                lessonId
            });
            setEnrollment(data);
        } catch (error) {
            console.error('Error marking lesson complete:', error);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!course) return <div className="flex h-screen items-center justify-center">Course not found</div>;

    const currentLesson = course.lessons[currentLessonIndex];
    const isCompleted = enrollment?.completedLessons.includes(currentLesson._id);
    const progress = enrollment?.progress || 0;

    return (
        <div className="flex h-screen bg-gray-100 flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-80 bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">{course.title}</h2>
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
                <ul className="divide-y divide-gray-200">
                    {course.lessons.map((lesson, index) => {
                        const isLessonCompleted = enrollment?.completedLessons.includes(lesson._id);
                        return (
                            <li
                                key={lesson._id}
                                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${currentLessonIndex === index ? 'bg-indigo-50 border-l-4 border-primary' : ''}`}
                                onClick={() => setCurrentLessonIndex(index)}
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-0.5">
                                        {isLessonCompleted ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <div className={`h-5 w-5 rounded-full border-2 ${currentLessonIndex === index ? 'border-primary' : 'border-gray-300'}`}></div>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <p className={`text-sm font-medium ${currentLessonIndex === index ? 'text-indigo-700' : 'text-gray-900'}`}>{lesson.title}</p>
                                        <p className="text-xs text-gray-500">{lesson.duration || '10 min'}</p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden shadow-lg mb-8">
                        <div className="w-full h-full flex items-center justify-center text-white">
                            {currentLesson.videoUrl ? (
                                <iframe
                                    src={currentLesson.videoUrl.replace('watch?v=', 'embed/')}
                                    title={currentLesson.title}
                                    className="w-full h-full md:h-[500px]"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Play className="h-16 w-16 text-gray-500" />
                                    <p className="mt-4 text-gray-400">Video Placeholder</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{currentLesson.title}</h1>
                            <p className="mt-4 text-gray-700 leading-relaxed max-w-3xl">{currentLesson.content}</p>
                        </div>
                        <button
                            onClick={() => markComplete(currentLessonIndex)}
                            disabled={isCompleted}
                            className={`flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors ${isCompleted
                                    ? 'bg-green-600 cursor-default'
                                    : 'bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                }`}
                        >
                            {isCompleted ? (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Completed
                                </>
                            ) : (
                                'Mark as Complete'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonView;
