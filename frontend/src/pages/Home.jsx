import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, Star, CheckCircle, Play, Sparkles } from 'lucide-react';

const Home = () => {
    const stats = [
        { label: 'Active Students', value: '50K+', icon: Users },
        { label: 'Total Courses', value: '1.2K+', icon: BookOpen },
        { label: 'Expert Mentors', value: '300+', icon: Award },
    ];

    const trustedBy = [
        'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative pt-16 pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-50 to-white opacity-40"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left flex flex-col justify-center">
                            <div className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-700 mb-6 w-fit mx-auto lg:mx-0">
                                <Sparkles className="w-4 h-4 mr-2" />
                                New Year Sale: 80% Off All Courses
                            </div>
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                                <span className="block">Transform your future</span>
                                <span className="block text-primary mt-2">with Mentora</span>
                            </h1>
                            <p className="mt-6 text-base text-gray-500 sm:text-lg lg:text-xl">
                                Join 50,000+ students learning the most in-demand skills in tech, business, and design.
                                Master everything from Web Development to AI with courses from top industry experts.
                            </p>
                            <div className="mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                                <Link
                                    to="/courses"
                                    className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-primary hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Explore Courses
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                                <Link
                                    to="/register"
                                    className="mt-3 sm:mt-0 flex items-center justify-center px-8 py-4 border-2 border-gray-100 text-base font-bold rounded-xl text-gray-900 bg-white hover:bg-gray-50 transition-all duration-300"
                                >
                                    Join for Free
                                </Link>
                            </div>

                            <div className="mt-10 flex items-center space-x-4 sm:justify-center lg:justify-start">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <img
                                            key={i}
                                            className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                            src={`https://i.pravatar.cc/150?u=${i}`}
                                            alt=""
                                        />
                                    ))}
                                </div>
                                <div className="text-sm">
                                    <div className="flex items-center text-yellow-400">
                                        {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                        <span className="ml-2 text-gray-900 font-bold">4.9/5</span>
                                    </div>
                                    <p className="text-gray-500">From 20,000+ reviews</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                            <div className="relative mx-auto w-full rounded-3xl shadow-2xl overflow-hidden border-8 border-white group">
                                <img
                                    className="w-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                    alt="Mentora Platform Preview"
                                />
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                                        <Play className="w-8 h-8 text-primary fill-current" />
                                    </div>
                                </div>
                                {/* Floating Badge */}
                                <div className="absolute bottom-6 right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-3 max-w-[200px]">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <Award className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Certified Partner</p>
                                        <p className="text-[10px] text-gray-500">Official Edu Provider</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trusted By */}
            <div className="bg-gray-50 py-12 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by teams at</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
                        {trustedBy.map((brand) => (
                            <span key={brand} className="text-2xl font-black italic tracking-tighter text-gray-900">{brand}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
                        {stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center text-center p-8 rounded-3xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:shadow-xl transition-all duration-300">
                                <div className="p-4 bg-indigo-100 rounded-2xl mb-6">
                                    <stat.icon className="w-8 h-8 text-primary" />
                                </div>
                                <p className="text-4xl font-black text-gray-900 mb-2">{stat.value}</p>
                                <p className="text-gray-500 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features/Value Props */}
            <div className="bg-gray-900 text-white py-24 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                        <div>
                            <h2 className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-4">Why Mentora</h2>
                            <h3 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
                                Learning that fits your <br /> lifestyle and career.
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { title: 'Learn from anywhere', desc: 'Access your courses on any device, anytime.' },
                                    { title: 'Industry-recognized certificates', desc: 'Earn badges and certificates to boost your Resume.' },
                                    { title: 'Hands-on projects', desc: 'Build a portfolio with real-world industry tasks.' },
                                    { title: 'Community driven', desc: 'Engage with mentors and fellow students in real-time.' }
                                ].map((item) => (
                                    <div key={item.title} className="flex items-start">
                                        <CheckCircle className="w-6 h-6 text-indigo-400 mr-4 flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="text-lg font-bold">{item.title}</h4>
                                            <p className="text-gray-400 mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-16 lg:mt-0 relative">
                            <div className="bg-gradient-to-tr from-primary to-indigo-400 rounded-3xl p-1 shadow-2xl">
                                <div className="bg-gray-800 rounded-3xl p-8 overflow-hidden h-96 flex flex-col justify-center">
                                    <div className="space-y-4 animate-pulse">
                                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                                        <div className="h-20 bg-gray-700 rounded w-full"></div>
                                        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                                    </div>
                                    <div className="mt-12 text-center">
                                        <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                                        <p className="text-2xl font-bold">Interactive Learning Hub</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white py-24">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-primary rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                        <div className="absolute top-0 right-0 -m-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -m-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                        <h3 className="text-3xl md:text-5xl font-black mb-6 relative z-10">Ready to start learning?</h3>
                        <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                            Join thousands of students and start your journey today. Get unlimited access to all courses for a monthly subscription.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                            <Link to="/register" className="bg-white text-primary px-10 py-4 rounded-xl font-black hover:bg-indigo-50 transition-colors shadow-lg">
                                Get Started Now
                            </Link>
                            <Link to="/courses" className="bg-primary-dark text-white border-2 border-white/20 px-10 py-4 rounded-xl font-black hover:bg-white/10 transition-colors">
                                View Library
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
