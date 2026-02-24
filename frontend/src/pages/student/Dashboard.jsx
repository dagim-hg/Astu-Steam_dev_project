import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Open': return <AlertCircle size={16} className="mr-1.5" />;
            case 'In Progress': return <Clock size={16} className="mr-1.5" />;
            case 'Resolved': return <CheckCircle2 size={16} className="mr-1.5" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Student Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}. Here's an overview of your complaints.</p>
                </div>
                <Link
                    to="/student/submit"
                    className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30"
                >
                    <PlusCircle size={18} className="mr-2" />
                    New Complaint
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Submitted', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                    { label: 'Open', value: stats.open, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
                    { label: 'In Progress', value: stats.inProgress, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                    { label: 'Resolved', value: stats.resolved, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
                ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-2xl border ${stat.border} ${stat.bg} shadow-sm`}>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Complaints */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FileText size={20} className="text-blue-500" />
                        Recent Complaints
                    </h2>
                    <Link to="/student/history" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</Link>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading complaints...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : complaints.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <FileText size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No complaints found</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-sm">You haven't submitted any complaints yet. If you have an issue, you can submit one now.</p>
                        <Link to="/student/submit" className="text-blue-600 font-medium hover:underline">Submit a complaint</Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {complaints.slice(0, 5).map((complaint) => (
                            <div key={complaint._id} className="p-6 hover:bg-gray-50/80 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-base font-semibold text-gray-900">{complaint.title}</h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                                                {getStatusIcon(complaint.status)}
                                                {complaint.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                {complaint.category}
                                            </span>
                                            <span>•</span>
                                            <span>Submitted on {new Date(complaint.createdAt).toLocaleDateString()}</span>
                                            {complaint.attachments && complaint.attachments.length > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-blue-600">{complaint.attachments.length} attachment(s)</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {/* Detailed view link could go here */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
