import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Trash2 } from 'lucide-react';

const EditCourse = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await api.get(`/courses/${id}`);
                setTitle(data.title);
                setDescription(data.description);
                setPrice(data.price);
                setCategory(data.category);
                setThumbnail(data.thumbnail);
                setLessons(data.lessons || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching course:', error);
                alert('Failed to fetch course');
                navigate('/admin/dashboard');
            }
        };
        fetchCourse();
    }, [id, navigate]);

    const addLesson = () => {
        setLessons([...lessons, { title: '', content: '', videoUrl: '', freePreview: false }]);
    };

    const removeLesson = (index) => {
        const newLessons = lessons.filter((_, i) => i !== index);
        setLessons(newLessons);
    };

    const handleLessonChange = (index, field, value) => {
        const newLessons = [...lessons];
        newLessons[index][field] = value;
        setLessons(newLessons);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/courses/${id}`, {
                title,
                description,
                price: Number(price),
                category,
                thumbnail,
                lessons
            });
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Error updating course:', error);
            alert('Failed to update course');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 text-black">
            <h1 className="text-3xl font-bold mb-8">Edit Course</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Course Title</label>
                        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                        <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                        <input type="url" required value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                </div>

                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium text-gray-900">Lessons</h2>
                        <button type="button" onClick={addLesson} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <Plus className="mr-2 h-4 w-4" /> Add Lesson
                        </button>
                    </div>

                    {lessons.map((lesson, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-md mb-4 relative border border-gray-200">
                            <button type="button" onClick={() => removeLesson(index)} className="absolute top-2 right-2 text-red-600 hover:text-red-800">
                                <Trash2 className="h-5 w-5" />
                            </button>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Lesson Title</label>
                                    <input type="text" required value={lesson.title} onChange={(e) => handleLessonChange(index, 'title', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Video URL</label>
                                        <input type="url" required value={lesson.videoUrl} onChange={(e) => handleLessonChange(index, 'videoUrl', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
                                    </div>
                                    <div className="flex items-center mt-6">
                                        <input
                                            id={`free-preview-${index}`}
                                            type="checkbox"
                                            checked={lesson.freePreview}
                                            onChange={(e) => handleLessonChange(index, 'freePreview', e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`free-preview-${index}`} className="ml-2 block text-sm text-gray-900">Free Preview</label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Content</label>
                                    <textarea required rows={2} value={lesson.content} onChange={(e) => handleLessonChange(index, 'content', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-5">
                    <div className="flex justify-end">
                        <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Update Course
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditCourse;
