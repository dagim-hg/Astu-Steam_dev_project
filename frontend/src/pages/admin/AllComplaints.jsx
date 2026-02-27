import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../utils/useAuth';
import { FileText, Search, Filter, AlertCircle, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AllComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filtering states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [departmentFilter, setDepartmentFilter] = useState('All');

    const { user } = useAuth();

    useEffect(() => {
        const fetchAllComplaints = async () => {
            try {
                setLoading(true);
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                
                // Usually an admin endpoint, but if the generic one returns all for admin:
                const { data } = await axios.get('/api/complaints', config);
                setComplaints(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch complaints');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.token) {
            fetchAllComplaints();
        }
    }, [user]);

    // Unique departments for filter
    const departments = ['All', ...new Set(complaints.map(c => c.assignedDepartment).filter(Boolean))];

    // Filtered complaints
    const filteredComplaints = complaints.filter(comp => {
        const matchesSearch = 
            (comp.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (comp.trackingId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (comp.student?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || comp.status === statusFilter;
        const matchesDept = departmentFilter === 'All' || comp.assignedDepartment === departmentFilter;

        return matchesSearch && matchesStatus && matchesDept;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Open': return <AlertCircle size={16} className="text-yellow-500" />;
            case 'In Progress': return <Clock size={16} className="text-blue-500" />;
            case 'Resolved': return <CheckCircle2 size={16} className="text-green-500" />;
            case 'Rejected': return <XCircle size={16} className="text-red-500" />;
            default: return null;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Open': return 'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/50';
            case 'In Progress': return 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50';
            case 'Resolved': return 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50';
            case 'Rejected': return 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50';
            default: return 'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
        }
    };

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
                <h3 className="text-lg font-semibold mb-1">Error Loading Complaints</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">System Complaints</h1>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Master view of all issues reported across the university.</p>
                </div>

                <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-lg font-medium">
                    <FileText size={18} />
                    <span>{complaints.length} Total Records</span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="relative md:col-span-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-slate-500">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search tracking ID, title, or user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-all"
                    />
                </div>

                <div className="relative w-full md:col-span-3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-slate-500">
                        <Filter size={18} />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-all appearance-none cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <div className="relative w-full md:col-span-3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-slate-500">
                        <Filter size={18} />
                    </div>
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-all appearance-none cursor-pointer"
                    >
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Complaints List */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-600 dark:text-slate-300">
                                <th className="p-4 pl-6">Tracking ID & Title</th>
                                <th className="p-4">Submitter</th>
                                <th className="p-4">Department / Staff</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right pr-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {filteredComplaints.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-slate-400">
                                        No complaints match your current filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredComplaints.map((comp) => (
                                    <tr key={comp._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="font-semibold text-gray-900 dark:text-slate-100 line-clamp-1">{comp.title}</div>
                                            <div className="text-xs text-gray-500 dark:text-slate-400 font-mono mt-1 pr-2 bg-gray-100 dark:bg-slate-800 rounded inline-block px-1">
                                                {comp.trackingId}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-medium text-gray-800 dark:text-slate-200">{comp.student?.name || 'Unknown User'}</div>
                                            <div className="text-xs text-gray-500 dark:text-slate-500">{new Date(comp.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-medium text-indigo-700 dark:text-indigo-400">{comp.assignedDepartment || 'Unassigned'}</div>
                                            <div className="text-xs text-gray-500 dark:text-slate-500">
                                                {comp.assignedStaff ? `Staff: ${comp.assignedStaff.name}` : 'Awaiting Assignment'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusStyle(comp.status)}`}>
                                                {getStatusIcon(comp.status)}
                                                {comp.status}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <Link 
                                                to={`/staff/update?ticket=${comp.complaintId}`} 
                                                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                                            >
                                                Manage <ArrowRight size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllComplaints;
