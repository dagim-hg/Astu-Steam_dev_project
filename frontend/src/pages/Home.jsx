import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Zap, Info, ShieldCheck, TrendingUp } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            {/* Minimalist Header */}
            <header className="border-b border-gray-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-50 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">ASTU Smart Complaint System</span>
                    </div>
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Features</a>
                        <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">About</a>
                        <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Contact</a>
                        <Link
                            to="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-md active:scale-95"
                        >
                            Login
                        </Link>
                    </div>
                    {/* Mobile Login */}
                    <Link
                        to="/login"
                        className="md:hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                        Login
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center py-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://z-p3-scontent.fadd2-1.fna.fbcdn.net/v/t39.30808-6/480999840_1039809391496819_1134655804215493369_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=2a1932&_nc_ohc=Rx2K_4V3pwcQ7kNvwHhB5S9&_nc_oc=Adm_kUSMvc25oJDP93C8cX_OpSvIowOAi-jRNRkNi5rXYZd4hjMtssnMDTydvGY9Zlk&_nc_zt=23&_nc_ht=z-p3-scontent.fadd2-1.fna&_nc_gid=MykIBfgCEsku7MqNGVf0Cw&oh=00_AfsL2T3Qu_cPCC_miTI21ayfL5JTWJcvQ_EOnyEiNXUgmQ&oe=69A6AD90" 
                        alt="ASTU Campus" 
                        className="w-full h-full object-cover"
                    />
                    {/* Light overlay: extremely light to show background */}
                    <div className="absolute inset-0 bg-white/10 dark:hidden"></div>
                    {/* Dark overlay: balanced for visibility and readability */}
                    <div className="absolute inset-0 hidden dark:block bg-slate-950/35 transition-opacity"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-gray-50 dark:via-slate-950/30 dark:to-slate-950"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/90 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-sm font-bold mb-6 backdrop-blur-md border border-blue-200/50 dark:border-blue-700/50">
                        <Zap size={16} className="text-blue-600 dark:text-blue-400" />
                        <span>Empowering Campus Voice</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 drop-shadow-md">
                        ASTU Smart Complaint & <br />
                        <span className="text-blue-700 dark:text-blue-400 drop-shadow-lg">Issue Tracking System</span>
                    </h1>
                    
                    <p className="text-2xl md:text-3xl text-blue-800 dark:text-blue-300 font-bold mb-8 italic drop-shadow-md">
                        "We are dedicated to innovating knowledge"
                    </p>

                    <p className="text-xl text-gray-900 dark:text-slate-100 max-w-2xl mx-auto mb-10 leading-relaxed font-bold drop-shadow-lg bg-white/20 dark:bg-black/30 backdrop-blur-[2px] rounded-2xl p-6 border border-white/30 dark:border-white/10">
                        A smart digital platform for reporting and tracking campus issues efficiently and transparently.
                        Dedicated to improving student life at Adama Science and Technology University.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-blue-500/50 flex items-center justify-center gap-2 group active:scale-95"
                        >
                            Get Started
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="#features"
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-gray-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center active:scale-95 shadow-md"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* Features View */}
            <section id="features" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Core System Features</h2>
                        <p className="text-gray-600 dark:text-slate-400 text-lg font-medium">Professional workflow designed for university management.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Zap className="text-blue-600 dark:text-blue-400" />,
                                title: "Submit Complaints",
                                desc: "Easy submission with categories, locations, and priority levels."
                            },
                            {
                                icon: <CheckCircle className="text-green-600 dark:text-green-400" />,
                                title: "Track Issues",
                                desc: "Real-time updates on status with unique tracking IDs."
                            },
                            {
                                icon: <Shield className="text-indigo-600 dark:text-indigo-400" />,
                                title: "AI Assistant",
                                desc: "Smart guidance and FAQ support for all students."
                            },
                            {
                                icon: <TrendingUp className="text-purple-600 dark:text-purple-400" />,
                                title: "Transparent Flow",
                                desc: "Clear visibility into assigned staff and resolution process."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-gray-50/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-900/50 transition-all hover:-translate-y-2 group">
                                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-gray-50 dark:bg-slate-900/50 transition-colors">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">About the System</h2>
                    <p className="text-xl text-gray-600 dark:text-slate-300 leading-relaxed mb-10 font-medium">
                        The ASTU Smart Complaint System is an innovative digital bridge connecting the campus community. 
                        We handle everything from infrastructure issues to academic grievances, ensuring that Adama Science and Technology University 
                        remains a pinnacle of excellence through efficient issue resolution and transparent communication.
                    </p>
                    <div className="inline-block p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-3xl">
                        <Info size={32} className="text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                        <p className="text-lg font-bold text-blue-900 dark:text-blue-200">
                            Innovating Knowledge & Empowering Voices
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-white dark:bg-slate-950 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
                        <p className="text-gray-600 dark:text-slate-400 text-lg font-medium">Get in touch with the relevant university offices.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* International Relations */}
                        <div className="bg-gray-50 dark:bg-slate-900 p-10 rounded-[2.5rem] border border-gray-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 transition-all shadow-sm">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">International Relations and Corporate Communications</h3>
                            <div className="space-y-6">
                                <div>
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">Telephone</span>
                                    <p className="text-lg text-gray-800 dark:text-slate-200 font-semibold">+251 -22-211-3961</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">Official Email</span>
                                    <p className="text-lg text-gray-800 dark:text-slate-200 font-semibold">irccd@astu.edu.et</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">Location</span>
                                    <p className="text-lg text-gray-800 dark:text-slate-200 font-semibold">P.O.Box: 1888 Adama, Ethiopia</p>
                                </div>
                            </div>
                        </div>

                        {/* Office of Registrar */}
                        <div className="bg-gray-50 dark:bg-slate-900 p-10 rounded-[2.5rem] border border-gray-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 transition-all shadow-sm">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Office of Registrar</h3>
                            <div className="space-y-6">
                                <div>
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">Telephone</span>
                                    <p className="text-lg text-gray-800 dark:text-slate-200 font-semibold">+251 -221-100001</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">Official Email</span>
                                    <p className="text-lg text-gray-800 dark:text-slate-200 font-semibold">sar@astu.edu.et</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">Location</span>
                                    <p className="text-lg text-gray-800 dark:text-slate-200 font-semibold">P.O.Box: 1888 Adama, Ethiopia</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-16 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Zap size={20} className="text-white fill-current" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-2xl tracking-tight">ASTU Smart Complaint</span>
                    </div>
                    <p className="text-gray-600 dark:text-slate-400 font-medium mb-4">
                        &copy; {new Date().getFullYear()} Adama Science and Technology University. All rights reserved.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-slate-500">
                        <ShieldCheck size={16} />
                        <span>Official University Platform</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
