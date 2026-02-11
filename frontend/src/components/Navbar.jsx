import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { GraduationCap, Menu, X, User as UserIcon, LogOut, LayoutDashboard, BookOpen } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Scroll effect for navbar transparency/shadow
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform duration-300">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <span className="ml-3 text-2xl font-black text-gray-900 tracking-tighter">Mentora</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-1">
                        <Link to="/courses" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/courses') ? 'text-primary bg-indigo-50' : 'text-gray-600 hover:text-primary hover:bg-gray-50'}`}>
                            Courses
                        </Link>
                        <Link to="/resume/analyzer" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/resume/analyzer') ? 'text-primary bg-indigo-50' : 'text-gray-600 hover:text-primary hover:bg-gray-50'}`}>
                            Resume AI
                        </Link>
                        <Link to="/interview/setup" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/interview/setup') ? 'text-primary bg-indigo-50' : 'text-gray-600 hover:text-primary hover:bg-gray-50'}`}>
                            Interview AI
                        </Link>

                        {user ? (
                            <div className="flex items-center ml-4 pl-4 border-l border-gray-200 space-x-3">
                                <Link
                                    to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Dashboard</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center ml-4 space-x-2">
                                <Link to="/login" className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all">
                                    Sign In
                                </Link>
                                <Link to="/register" className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-black hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5 active:scale-95">
                                    Join Mentora
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-20 left-4 right-4 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-top ${isOpen ? 'scale-100 opacity-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <div className="p-6 space-y-4">
                    <Link to="/courses" className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-indigo-50 text-gray-700 hover:text-primary transition-all">
                        <BookOpen className="w-5 h-5" />
                        <span className="font-bold">Browse Courses</span>
                    </Link>

                    {user ? (
                        <>
                            <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="flex items-center space-x-3 p-3 rounded-2xl bg-gray-900 text-white shadow-xl shadow-gray-200">
                                <LayoutDashboard className="w-5 h-5" />
                                <span className="font-bold">My Dashboard</span>
                            </Link>
                            <button onClick={logout} className="flex items-center space-x-3 w-full p-3 rounded-2xl hover:bg-red-50 text-red-600 transition-all">
                                <LogOut className="w-5 h-5" />
                                <span className="font-bold">Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <Link to="/login" className="flex items-center justify-center py-3 rounded-2xl font-bold bg-gray-50 text-gray-700">
                                Sign In
                            </Link>
                            <Link to="/register" className="flex items-center justify-center py-3 rounded-2xl font-bold bg-primary text-white shadow-lg shadow-indigo-100">
                                Join Free
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
