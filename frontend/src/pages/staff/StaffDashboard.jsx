import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, AlertCircle, Clock, CheckCircle2, ChevronDown, Download, MessageSquare, Save } from 'lucide-react';
import useAuth from '../../utils/useAuth';

const StaffDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [expandedId, setExpandedId] = useState(null);
    const [updateStatus, setUpdateStatus] = useState('');
    const [remark, setRemark] = useState('');
    const [updating, setUpdating] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        fetchComplaints();
    }, [user]);

    const fetchComplaints = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get('/api/complaints', config);
            setComplaints(data);
        } catch (err) {
            setError('Failed to fetch assigned complaints');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id) => {
        if (!updateStatus && !remark) return;

        setUpdating(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            const payload = {};
            if (updateStatus) payload.status = updateStatus;
            if (remark) payload.remark = remark;

            await axios.put(`/api/complaints/${id}`, payload, config);

            // Refresh local data
            await fetchComplaints();

            // Reset form
            setUpdateStatus('');
            setRemark('');
            setExpandedId(null);
        } catch (err) {
            alert('Failed to update complaint');
        } finally {
            setUpdating(false);
        }
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

    const filteredComplaints = complaints.filter(complaint => {
        const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.studentId.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleExpand = (complaint) => {
        if (expandedId === complaint._id) {
            setExpandedId(null);
            setUpdateStatus('');
            setRemark('');
        } else {
            setExpandedId(complaint._id);
            setUpdateStatus(complaint.status);
            setRemark('');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Workspace</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and update tickets assigned to your department.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by title or student..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                        />
                    </div>

                    <div className="relative w-full sm:w-40">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Filter size={18} />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white appearance-none cursor-pointer"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500 bg-red-50">{error}</div>
                ) : filteredComplaints.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        {searchTerm || statusFilter !== 'All' ? 'No tickets match your search filters.' : 'There are no active complaints for your department.'}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredComplaints.map((complaint) => (
                            <div key={complaint._id} className="transition-colors hover:bg-gray-50/50">
                                <div
                                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                                    onClick={() => toggleExpand(complaint)}
                                >
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {complaint.title}
                                            </h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                                                {getStatusIcon(complaint.status)}
                                                {complaint.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <span className="font-medium text-gray-700">{complaint.studentId.name}</span>
                                            <span>•</span>
                                            <span>{complaint.category}</span>
                                            <span>•</span>
                                            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-400 shrink-0">
                                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded-md text-gray-500 hidden md:inline-block border border-gray-200">
                                            ID: {complaint._id.substring(18).toUpperCase()}
                                        </span>
                                        <button className={`p-1.5 rounded-full hover:bg-gray-200 transition-transform ${expandedId === complaint._id ? 'rotate-180' : ''}`}>
                                            <ChevronDown size={20} className="text-gray-500" />
                                        </button>
                                    </div>
                                </div>

                                {expandedId === complaint._id && (
                                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-gray-50 bg-gray-50/30 animate-fade-in">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Details Section */}
                                            <div className="flex-1 space-y-4">
                                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h4>
                                                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                                        {complaint.description}
                                                    </p>
                                                </div>

                                                {complaint.attachments && complaint.attachments.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Attachments</h4>
                                                        <div className="flex gap-3 flex-wrap">
                                                            {complaint.attachments.map((file, idx) => (
                                                                <a
                                                                    key={idx}
                                                                    href={file.url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="flex items-center gap-2 text-sm bg-white border border-gray-200 px-3 py-2 rounded-lg hover:border-blue-400 hover:shadow-md transition-all text-gray-700 group"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Download className="text-blue-500 group-hover:-translate-y-0.5 transition-transform" size={16} />
                                                                    <span className="max-w-[150px] truncate">{file.filename || `Attachment ${idx + 1}`}</span>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Remakrs History */}
                                                {complaint.remarks && complaint.remarks.length > 0 && (
                                                    <div className="mt-4 border-t border-gray-100 pt-4">
                                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                            <MessageSquare size={14} /> Previous Remarks
                                                        </h4>
                                                        <div className="space-y-3">
                                                            {complaint.remarks.map((rmk, idx) => (
                                                                <div key={idx} className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-sm">
                                                                    <div className="flex justify-between items-center mb-1">
                                                                        <span className="font-semibold text-blue-900">{rmk.staffName}</span>
                                                                        <span className="text-xs text-blue-400">{new Date(rmk.date).toLocaleString()}</span>
                                                                    </div>
                                                                    <p className="text-gray-700">{rmk.comment}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Section */}
                                            <div className="w-full lg:w-1/3 space-y-4">
                                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-20">
                                                    <h4 className="text-sm font-semibold text-gray-900 mb-4 border-b pb-2">Update Ticket Action</h4>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">Change Status To</label>
                                                            <select
                                                                value={updateStatus}
                                                                onChange={(e) => setUpdateStatus(e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                            >
                                                                <option value="Open">Open</option>
                                                                <option value="In Progress">In Progress</option>
                                                                <option value="Resolved">Resolved</option>
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">Add Remark/Note</label>
                                                            <textarea
                                                                value={remark}
                                                                onChange={(e) => setRemark(e.target.value)}
                                                                rows="3"
                                                                placeholder="E.g., Issue identified. Maintenance dispatched..."
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                                                            ></textarea>
                                                        </div>

                                                        <button
                                                            onClick={() => handleUpdate(complaint._id)}
                                                            disabled={updating || (!remark && updateStatus === complaint.status)}
                                                            className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${updating || (!remark && updateStatus === complaint.status)
                                                                    ? 'bg-blue-300 cursor-not-allowed'
                                                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                                                } transition-colors`}
                                                        >
                                                            {updating ? (
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                <Save size={16} className="mr-2" />
                                                            )}
                                                            {updating ? 'Updating...' : 'Save Update'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffDashboard;
