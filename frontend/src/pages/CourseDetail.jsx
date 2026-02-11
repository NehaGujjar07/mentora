import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { PlayCircle, Lock, X, Star, Globe, AlertCircle, Check, Clock, Award, FileText, Monitor } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await api.get(`/courses/${id}`);
                setCourse({
                    ...data,
                    rating: 4.8, // Mocked 
                    students: 12543, // Mocked
                    updatedAt: new Date().toLocaleDateString()
                });

                if (user && user.enrolledCourses && user.enrolledCourses.includes(id)) {
                    setEnrolled(true);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching course:', error);
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id, user]);

    const initiatePayment = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const { data } = await api.post('/payment/create-payment-intent', { courseId: id });
            setClientSecret(data.clientSecret);
            setShowPaymentModal(true);
        } catch (error) {
            console.error('Error initializing payment:', error);
            alert('Failed to initialize payment');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!course) return <div>Course not found</div>;

    const appearance = { theme: 'stripe' };
    const options = { clientSecret, appearance };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-gray-900 text-white py-12 lg:py-16 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row">
                    <div className="lg:w-2/3 pr-0 lg:pr-12">
                        <div className="text-sm font-medium text-indigo-400 mb-4 flex items-center space-x-2">
                            <span>Categories</span>
                            <span>&gt;</span>
                            <span>{course.category}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                            {course.title}
                        </h1>
                        <p className="text-lg text-gray-300 mb-6 max-w-3xl">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                            <span className="bg-yellow-500 text-gray-900 px-2 py-0.5 rounded font-bold flex items-center">
                                <span className="mr-1">{course.rating}</span>
                                <Star className="w-3 h-3 fill-current" />
                            </span>
                            <span className="text-indigo-300 hover:underline cursor-pointer">({course.students.toLocaleString()} ratings)</span>
                            <span className="text-gray-300">{course.students.toLocaleString()} students</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                            <div className="flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                <span>Last updated {course.updatedAt}</span>
                            </div>
                            <div className="flex items-center">
                                <Globe className="w-4 h-4 mr-2" />
                                <span>{course.language || 'English'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        {/* What you'll learn */}
                        <div className="border border-gray-200 rounded-lg p-6 mb-10 bg-white shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">What you'll learn</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.learningOutcomes && course.learningOutcomes.length > 0 ? (
                                    course.learningOutcomes.map((outcome, idx) => (
                                        <li key={idx} className="flex items-start text-sm text-gray-600">
                                            <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                            <span>{outcome}</span>
                                        </li>
                                    ))
                                ) : (
                                    // Fallback if no outcomes
                                    <>
                                        <li className="flex items-start text-sm text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2" />Master the core concepts of {course.title}</li>
                                        <li className="flex items-start text-sm text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2" />Build real-world projects</li>
                                        <li className="flex items-start text-sm text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2" />Apply for jobs in this field</li>
                                        <li className="flex items-start text-sm text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2" />Lifetime access to updates</li>
                                    </>
                                )}
                            </ul>
                        </div>

                        {/* Course Content */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
                            <div className="text-sm text-gray-600 mb-4 flex items-center justify-between">
                                <span>{course.lessons.length} lessons • Total duration: 5h 30m</span>
                                <button className="text-primary font-bold hover:underline">Expand all sections</button>
                            </div>
                            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 bg-white">
                                {course.lessons.map((lesson, index) => (
                                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <PlayCircle className="h-5 w-5 text-gray-400 mr-3" />
                                                <span className="text-sm font-medium text-gray-900">{lesson.title}</span>
                                            </div>
                                            <div className="flex items-center">
                                                {lesson.freePreview ? (
                                                    <span className="text-xs font-semibold text-primary mr-3 hover:underline cursor-pointer">Preview</span>
                                                ) : null}
                                                <span className="text-sm text-gray-500">10:00</span>
                                                {!enrolled && !lesson.freePreview && <Lock className="h-4 w-4 text-gray-400 ml-3" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                {course.requirements && course.requirements.length > 0 ? (
                                    course.requirements.map((req, idx) => <li key={idx}>{req}</li>)
                                ) : (
                                    <li>No prior knowledge required.</li>
                                )}
                            </ul>
                        </div>

                        {/* Description */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                            <div className="prose max-w-none text-gray-700">
                                <p>{course.description}</p>
                                <p className="mt-4">
                                    This course is carefully designed to guide you through the learning process step-by-step.
                                    Whether you are a complete beginner or looking to refresh your skills, this curriculum covers everything you need to know.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Floating Card */}
                    <div className="lg:w-1/3 relative">
                        <div className="sticky top-24">
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
                                <div className="h-48 w-full relative">
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                    {!enrolled && (
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                            <PlayCircle className="w-16 h-16 text-white opacity-80" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <span className="text-3xl font-bold text-gray-900">${course.price}</span>
                                        <span className="ml-2 text-lg text-gray-400 line-through">${(course.price * 5).toFixed(2)}</span>
                                        <span className="ml-auto text-sm font-semibold text-gray-900">80% off</span>
                                    </div>

                                    {enrolled ? (
                                        <button
                                            onClick={() => navigate(`/lesson/${id}`)}
                                            className="w-full bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-lg font-bold text-white hover:bg-green-700 transition"
                                        >
                                            Go to Course
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={initiatePayment}
                                                className="w-full bg-primary border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-lg font-bold text-white hover:bg-indigo-700 transition shadow-md"
                                            >
                                                Enroll Now
                                            </button>
                                            <p className="mt-3 text-xs text-center text-gray-500">30-Day Money-Back Guarantee</p>
                                        </>
                                    )}

                                    <div className="mt-6 space-y-4">
                                        <h4 className="text-sm font-bold text-gray-900">This course includes:</h4>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-center"><Monitor className="w-4 h-4 mr-2" /> {course.lessons.length * 0.5} hours on-demand video</li>
                                            <li className="flex items-center"><FileText className="w-4 h-4 mr-2" /> 5 downloadable resources</li>
                                            <li className="flex items-center"><Clock className="w-4 h-4 mr-2" /> Full lifetime access</li>
                                            <li className="flex items-center"><Monitor className="w-4 h-4 mr-2" /> Access on mobile and TV</li>
                                            <li className="flex items-center"><Award className="w-4 h-4 mr-2" /> Certificate of completion</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && clientSecret && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-filter backdrop-blur-sm" aria-hidden="true" onClick={() => setShowPaymentModal(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                                    onClick={() => setShowPaymentModal(false)}
                                >
                                    <span className="sr-only">Close</span>
                                    <X className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                                        Secure Checkout
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">Complete your purchase for "{course.title}"</p>
                                    <div className="mt-6">
                                        <Elements options={options} stripe={stripePromise}>
                                            <CheckoutForm clientSecret={clientSecret} courseId={id} />
                                        </Elements>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetail;
