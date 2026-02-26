import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle2, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';
import useAuth from '../../utils/useAuth';

const StaffDashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        inProgress: 0,
        resolved: 0
    });
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                // Fetch assigned complaints to calculate stats
                const { data } = await axios.get('/api/complaints/staff/assigned', config);
                
                const inProgress = data.filter(c => c.status === 'In Progress').length;
                const resolved = data.filter(c => c.status === 'Resolved').length;

                setStats({
                    total: data.length,
                    inProgress,
                    resolved
                });

                // Get 5 most recent complaints
                setRecentComplaints(data.slice(0, 5));
            } catch (err) {
                setError('Failed to fetch dashboard statistics');
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchStats();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
                <AlertCircle size={32} className="mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">Error Loading Dashboard</h3>
                <p>{error}</p>
            </div>
        );
    }

    const resolutionRate = stats.total > 0 
        ? Math.round((stats.resolved / stats.total) * 100) 
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Department Overview</h1>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                        Welcome back, {user?.name}. Here is the current status of the {user?.department || 'Department'} queue.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Assigned */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Assigned</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                            <ClipboardList size={24} />
                        </div>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                            Tickets in Queue
                        </span>
                    </div>
                </div>

                {/* In Progress */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">In Progress</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.inProgress}</h3>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                        <span className="text-amber-600 dark:text-amber-400 font-medium">Currently being worked on</span>
                    </div>
                </div>

                {/* Resolved */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Resolved</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.resolved}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <TrendingUp size={14} /> {resolutionRate}% clear rate
                        </span>
                    </div>
                </div>
            </div>

            {/* Recent Complaints Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Clock className="text-indigo-500" size={18} />
                        Recently Assigned
                    </h3>
                    <Link to="/staff/assigned" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1">
                        View All
                        <ChevronRight size={14} />
                    </Link>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                    {recentComplaints.length > 0 ? (
                        recentComplaints.map(complaint => (
                            <div key={complaint._id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${
                                        complaint.priority === 'Urgent' ? 'bg-red-500' :
                                        complaint.priority === 'High' ? 'bg-orange-500' :
                                        'bg-blue-400'
                                    }`}></div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {complaint.title}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tight">{complaint.complaintId}</span>
                                            <span className="text-[10px] py-0.5 px-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase">{complaint.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <Link 
                                    to={`/staff/update?ticket=${complaint.complaintId}`}
                                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                                >
                                    <ChevronRight size={20} />
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center text-gray-400">
                            <AlertCircle className="mx-auto mb-2 opacity-20" size={40} />
                            <p className="text-sm font-medium">No complaints assigned to your department yet.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                    <CheckCircle2 size={250} />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-2xl font-bold mb-2">Ready to tackle the queue?</h2>
                    <p className="text-indigo-100 mb-6 text-sm">
                        Navigate to your Assigned Complaints to view detailed tickets, add remarks, and update statuses to keep students informed.
                    </p>
                    <Link 
                        to="/staff/assigned"
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-indigo-700 font-medium rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
                    >
                        View Assigned Complaints &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
