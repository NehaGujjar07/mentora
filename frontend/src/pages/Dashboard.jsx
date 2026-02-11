import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { PlayCircle, Award, BookOpen, Clock } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const { data } = await api.get('/enrollments/my-courses');
                // Calculate derived progress stats
                const processed = data.map(enrol => ({
                    ...enrol,
                    lastAccessed: new Date().toLocaleDateString(), // Mock
                }));
                setEnrollments(processed);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching enrollments:', error);
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    const filteredEnrollments = enrollments.filter(enrollment => {
        if (activeTab === 'all') return true;
        if (activeTab === 'in-progress') return enrollment.progress > 0 && enrollment.progress < 100;
        if (activeTab === 'completed') return enrollment.progress === 100;
        return true;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            <div className="bg-gray-900 text-white pb-32 pt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight">My Learning</h1>
                    <div className="mt-6 flex space-x-8 text-sm font-medium">
                        <div className="flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-indigo-400" />
                            <span>{enrollments.length} Courses Enrolled</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-indigo-400" />
                            <span>{enrollments.reduce((acc, curr) => acc + (curr.progress > 0 ? 1 : 0), 0)} Active</span>
                        </div>
                        <div className="flex items-center">
                            <Award className="w-5 h-5 mr-2 text-indigo-400" />
                            <span>{enrollments.reduce((acc, curr) => acc + (curr.progress === 100 ? 1 : 0), 0)} Completed</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 px-6">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {['all', 'in-progress', 'completed'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize
                                        ${activeTab === tab
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                    `}
                                >
                                    {tab.replace('-', ' ')}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8">
                        {filteredEnrollments.length === 0 ? (
                            <div className="text-center py-20">
                                <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by exploring our catalog.</p>
                                <div className="mt-6">
                                    <Link
                                        to="/courses"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none"
                                    >
                                        Browse Courses
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredEnrollments.map(({ course, progress, _id }) => (
                                    course ? (
                                        <div key={_id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                                            <div className="h-40 w-full relative">
                                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                                            </div>

                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 min-h-[3.5rem]">
                                                    {course.title}
                                                </h3>

                                                <div className="mt-auto">
                                                    <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                                                        <span>{Math.round(progress)}% Complete</span>
                                                        <span>
                                                            {progress === 100 ? (
                                                                <span className="text-green-600 font-bold flex items-center"><Award className="w-3 h-3 mr-1" /> Certified</span>
                                                            ) : (
                                                                'In Progress'
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                                        <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                                    </div>

                                                    <Link
                                                        to={`/lesson/${course._id}`}
                                                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                                                    >
                                                        {progress > 0 ? 'Continue Learning' : 'Start Course'}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
