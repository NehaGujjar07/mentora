import { Link } from 'react-router-dom';
import { GraduationCap, Facebook, Twitter, Linkedin, Instagram, Github } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center group">
                            <div className="p-2 bg-primary rounded-xl">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <span className="ml-3 text-2xl font-black text-white tracking-tighter">Mentora</span>
                        </Link>
                        <p className="text-gray-400 max-w-xs leading-relaxed">
                            Empowering learners worldwide with accessible, high-quality education. Join our community and start your journey today.
                        </p>
                        <div className="flex space-x-4">
                            {[Facebook, Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                                <a key={i} href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary hover:text-white transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links - Platform */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Platform</h4>
                        <ul className="space-y-4">
                            {['Browse Courses', 'Mentors', 'Community', 'Pricing', 'Newsletter'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="hover:text-primary transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links - Company */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Careers', 'Blog', 'Contact', 'Affiliate'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="hover:text-primary transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Subscription */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Stay Updated</h4>
                        <p className="text-sm text-gray-400 mb-4">Subscribe to get the latest course updates and career tips.</p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            />
                            <button className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/20">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-gray-500">
                    <p>© {currentYear} Mentora Inc. All rights reserved.</p>
                    <div className="flex space-x-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
