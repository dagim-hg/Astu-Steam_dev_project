import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    PlusCircle, Clock, CheckCircle, AlertCircle, FileText,
    ArrowRight, TrendingUp, Sparkles, Zap, MessageSquare, History
} from 'lucide-react';
import useAuth from '../../utils/useAuth';

const StudentDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('/api/complaints', config);
                setComplaints(data);
            } catch (err) {
                setError('Failed to fetch complaints');
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchComplaints();
    }, [user]);

    const stats = {
        total: complaints.length,
        open: complaints.filter(c => c.status === 'Open').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Open': return 'bg-yellow-50 text-yellow-700 border-yellow-100 ring-yellow-500/10';
            case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/10';
            case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/10';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative z-10 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-8 sm:p-12 text-white shadow-2xl shadow-blue-900/20">
                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/20 border border-blue-400/30 text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                            <Sparkles size={12} className="text-yellow-300" />
                            ASTU Student Portal
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
                            Smart Issue <span className="text-blue-300">Tracking</span>
                        </h1>
                        <p className="text-lg text-blue-100/80 font-medium leading-relaxed">
                            Welcome back, {user?.name.split(' ')[0]}. Resolve your campus concerns efficiently with our digital tracing system.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/student/submit"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 font-extrabold rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-black/10 group"
                        >
                            <PlusCircle size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
                            New Complaint
                        </Link>
                        <Link
                            to="/student/ai"
                            className="inline-flex items-center justify-center px-8 py-4 bg-blue-400/20 border border-white/20 text-white font-extrabold rounded-2xl hover:bg-white/30 transition-all backdrop-blur-md group"
                        >
                            <Zap size={20} className="mr-2 text-yellow-300 group-animate-pulse" />
                            Ask Assistant
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { label: 'Submissions', value: stats.total, icon: <FileText className="text-blue-600" />, color: 'from-blue-50 to-indigo-50', border: 'border-blue-100' },
                    { label: 'Pending', value: stats.open, icon: <AlertCircle className="text-amber-500" />, color: 'from-amber-50 to-orange-50', border: 'border-amber-100' },
                    { label: 'Active', value: stats.inProgress, icon: <Clock className="text-indigo-600" />, color: 'from-indigo-50 to-purple-50', border: 'border-indigo-100' },
                    { label: 'Resolved', value: stats.resolved, icon: <CheckCircle className="text-emerald-500" />, color: 'from-emerald-50 to-teal-50', border: 'border-emerald-100' },
                ].map((stat, i) => (
                    <div key={i} className={`p-6 sm:p-8 rounded-[2rem] border ${stat.border} bg-gradient-to-br ${stat.color} shadow-sm transition-all hover:shadow-md group`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">{stat.icon}</div>
                            <TrendingUp size={16} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-4xl font-black text-gray-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Complaints Table-like structure */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                    <div className="px-8 py-7 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                <History size={20} />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Recent Tracking</h2>
                        </div>
                        <Link to="/student/history" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group">
                            View History
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {loading ? (
                            <div className="p-12 text-center text-gray-400 font-medium italic animate-pulse">Synchronizing with system...</div>
                        ) : complaints.length === 0 ? (
                            <div className="p-16 text-center flex flex-col items-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 border border-gray-100">
                                    <FileText size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No active records</h3>
                                <p className="text-gray-500 text-sm mb-8 max-w-xs font-medium">Your submission history is empty. Start by reporting a campus issue.</p>
                                <Link to="/student/submit" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                                    Report First Issue
                                </Link>
                            </div>
                        ) : (
                            complaints.slice(0, 4).map((complaint) => (
                                <Link
                                    key={complaint._id}
                                    to={`/student/complaint/${complaint._id}`}
                                    className="block p-7 hover:bg-blue-50/30 transition-all group"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 uppercase tracking-tighter shadow-sm">
                                                    {complaint.complaintId}
                                                </span>
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors uppercase tracking-tight truncate max-w-[200px] sm:max-w-sm">
                                                    {complaint.title}
                                                </h3>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-400">
                                                <span className="flex items-center gap-1.5 text-gray-600 italic">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                                    {complaint.category}
                                                </span>
                                                <span>•</span>
                                                <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ring-1 ${getStatusStyles(complaint.status)}`}>
                                                {complaint.status}
                                            </span>
                                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-blue-500 group-hover:border-blue-200 transition-all shadow-sm">
                                                <ArrowRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-8">
                    {/* Help Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-900/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 text-white/5 opacity-40 group-hover:rotate-12 transition-transform duration-500">
                            <MessageSquare size={160} />
                        </div>
                        <h3 className="text-2xl font-black mb-4 relative z-10">Need Help?</h3>
                        <p className="text-indigo-100 font-medium text-sm leading-relaxed mb-8 relative z-10">
                            Our AI Assistant is available 24/7 to guide you through ASTU campus procedures and system usage.
                        </p>
                        <Link to="/student/ai" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg shadow-black/10 relative z-10">
                            Start Chat
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Stats Summary Card */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/30">
                        <h3 className="text-xl font-black text-gray-900 mb-6">System Health</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Issue Resolution Rate', value: '94%', color: 'bg-emerald-500' },
                                { label: 'Average Response Time', value: '1.2 days', color: 'bg-blue-500' },
                                { label: 'System Uptime', value: '99.9%', color: 'bg-indigo-500' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        <span>{item.label}</span>
                                        <span className="text-gray-900">{item.value}</span>
                                    </div>
                                    <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
                                        <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: item.value }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
