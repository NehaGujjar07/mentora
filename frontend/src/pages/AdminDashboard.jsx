import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
    const [courses, setCourses] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/courses');
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const deleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/courses/${id}`);
                setCourses(courses.filter((course) => course._id !== id));
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 pb-6 sm:px-0 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <Link
                    to="/admin/create-course"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 shadow-sm"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {courses.length === 0 ? (
                        <li className="px-4 py-8 text-center text-gray-500">No courses found. Create one to get started.</li>
                    ) : (
                        courses.map((course) => (
                            <li key={course._id}>
                                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img className="h-12 w-12 rounded-lg object-cover" src={course.thumbnail} alt={course.title} />
                                        <div className="ml-4">
                                            <div className="text-lg font-medium text-primary truncate">{course.title}</div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <span className="truncate">{course.category}</span>
                                                <span className="mx-2">•</span>
                                                <span className="font-semibold text-gray-900">${course.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/admin/edit-course/${course._id}`}
                                            className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => deleteCourse(course._id)}
                                            className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
