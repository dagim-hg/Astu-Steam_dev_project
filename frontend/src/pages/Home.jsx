import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Zap, Info } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Minimalist Header */}
            <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <span className="font-bold text-xl text-gray-900 tracking-tight">ASTU Smart Complaint System</span>
                    </div>
                    <Link
                        to="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-md active:scale-95"
                    >
                        Login
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
                        <Zap size={16} />
                        <span>Empowering Campus Voice</span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                        ASTU Smart Complaint & <br />
                        <span className="text-blue-600">Issue Tracking System</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        A smart digital platform for reporting and tracking campus issues efficiently and transparently.
                        Dedicated to improving student life at Adama Science and Technology University.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-blue-200 flex items-center gap-2 group"
                        >
                            Get Started
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="#features"
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* Features View Only */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Core System Features</h2>
                        <p className="text-gray-500">Professional workflow designed for university management.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Zap className="text-blue-500" />,
                                title: "Submit Complaints",
                                desc: "Easy submission with categories, locations, and priority levels."
                            },
                            {
                                icon: <CheckCircle className="text-green-500" />,
                                title: "Track Issues",
                                desc: "Real-time updates on status with unique tracking IDs."
                            },
                            {
                                icon: <Shield className="text-indigo-500" />,
                                title: "AI Assistant",
                                desc: "Smart guidance and FAQ support for all students."
                            },
                            {
                                icon: <Zap className="text-purple-500" />,
                                title: "Transparent Flow",
                                desc: "Clear visibility into assigned staff and resolution process."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                                <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <span className="font-bold text-gray-900">ASTU Smart System v1.0</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span>© 2026 ASTU. All rights reserved.</span>
                            <div className="flex items-center gap-2">
                                <Info size={14} />
                                <span>Secured by Admin Protocol</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
