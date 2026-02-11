import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Filter, Star, Clock, Signal } from 'lucide-react';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState(['All']);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.get('/courses');
                const coursesWithNumbers = data.map(c => ({
                    ...c,
                    price: Number(c.price),
                    rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1), // Mock rating 4.0-5.0
                    reviewCount: Math.floor(Math.random() * 500) + 50
                }));
                setCourses(coursesWithNumbers);
                setFilteredCourses(coursesWithNumbers);

                // Extract unique categories
                const uniqueCategories = ['All', ...new Set(data.map(c => c.category))];
                setCategories(uniqueCategories);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        let result = courses;

        if (selectedCategory !== 'All') {
            result = result.filter(course => course.category === selectedCategory);
        }

        if (searchTerm) {
            result = result.filter(course =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredCourses(result);
    }, [searchTerm, selectedCategory, courses]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Header / Search Section */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Explore Our Courses
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                        Discover new skills and advance your career with our professional courses.
                    </p>

                    <div className="mt-8 max-w-xl mx-auto relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm shadow-sm"
                            placeholder="Search for courses, skills, or topics..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${selectedCategory === category
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Course Grid */}
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredCourses.map((course) => (
                        <Link key={course._id} to={`/course/${course._id}`} className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1">
                            <div className="relative">
                                <img className="h-48 w-full object-cover" src={course.thumbnail} alt={course.title} />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm">
                                    {course.level || 'All Levels'}
                                </div>
                            </div>

                            <div className="flex-1 p-5 flex flex-col">
                                <div className="flex items-center text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                                    {course.category}
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                    {course.title}
                                </h3>

                                <div className="flex items-center mb-4">
                                    <span className="text-yellow-400 flex items-center">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="ml-1 font-bold text-gray-900">{course.rating}</span>
                                    </span>
                                    <span className="mx-1.5 text-gray-300">•</span>
                                    <span className="text-sm text-gray-500">({course.reviewCount} reviews)</span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="text-lg font-bold text-gray-900">
                                        ${course.price}
                                    </div>
                                    <span className="text-sm font-medium text-primary bg-indigo-50 px-3 py-1 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                                        View Details
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No courses found matching your criteria.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                            className="mt-4 text-primary font-medium hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseList;
