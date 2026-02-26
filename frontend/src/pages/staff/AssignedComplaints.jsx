import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, AlertCircle, Clock, CheckCircle2, ChevronDown, Download, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../../utils/useAuth';

const AssignedComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [expandedId, setExpandedId] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        fetchComplaints();
    }, [user]);

    const fetchComplaints = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get('/api/complaints/staff/assigned', config);
            setComplaints(data);
        } catch (err) {
            setError('Failed to fetch assigned complaints');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Resolved': return 'bg-green-50 text-green-700 border-green-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Low': return 'text-gray-600 bg-gray-50 border-gray-100';
            case 'Medium': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'High': return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'Urgent': return 'text-red-600 bg-red-50 border-red-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
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
            complaint.complaintId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.studentId.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Assigned Complaints</h1>
                    <p className="text-sm text-gray-500 mt-1">Review tickets generated for the {user?.department || 'your'} department.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search TICK-ID or Title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white outline-none transition-all"
                        />
                    </div>

                    <div className="relative w-full sm:w-40">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Filter size={18} />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white appearance-none outline-none cursor-pointer transition-all"
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
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500 bg-red-50 border-b border-red-100">{error}</div>
                ) : filteredComplaints.length === 0 ? (
                    <div className="p-16 text-center text-gray-500 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 text-gray-400 flex items-center justify-center rounded-full mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Catching up!</h3>
                        <p>{searchTerm || statusFilter !== 'All' ? 'No tickets match your filters.' : 'The queue is completely clear. Great job!'}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {/* Table Header Context for larger screens */}
                        <div className="hidden md:flex items-center px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <div className="w-32 shrink-0">ID</div>
                            <div className="flex-1">Title & Requester</div>
                            <div className="w-32 text-center shrink-0">Priority</div>
                            <div className="w-40 text-center shrink-0">Status</div>
                            <div className="w-24 text-right shrink-0">Actions</div>
                        </div>

                        {filteredComplaints.map((complaint) => (
                            <div key={complaint._id} className="transition-colors hover:bg-indigo-50/30">
                                <div
                                    className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                                    onClick={() => toggleExpand(complaint._id)}
                                >
                                    {/* ID Section */}
                                    <div className="w-auto md:w-32 shrink-0 flex items-center">
                                        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                            {complaint.complaintId || 'PENDING'}
                                        </span>
                                    </div>

                                    {/* Title & User Section */}
                                    <div className="flex-1 space-y-1">
                                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {complaint.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 flex-wrap">
                                            <span className="font-semibold text-gray-800 flex items-center gap-1">
                                                <Users size={14} className="text-gray-400" />
                                                {complaint.studentId.name}
                                            </span>
                                            <span className="hidden sm:inline">•</span>
                                            <span className="italic block sm:inline">{complaint.category}</span>
                                            <span className="hidden sm:inline">•</span>
                                            <span className="block sm:inline">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Priority Badge */}
                                    <div className="w-auto md:w-32 shrink-0 flex items-center md:justify-center">
                                        <span className={`inline-flex flex-row items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(complaint.priority)}`}>
                                            <AlertCircle size={10} className="mr-1" />
                                            {complaint.priority || 'Medium'}
                                        </span>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="w-auto md:w-40 shrink-0 flex items-center md:justify-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                                            {getStatusIcon(complaint.status)}
                                            {complaint.status}
                                        </span>
                                    </div>

                                    {/* Actions & Expand Chevron */}
                                    <div className="w-auto md:w-24 shrink-0 flex items-center justify-between md:justify-end gap-3 text-gray-400">
                                        <Link 
                                            to={`/staff/update?ticket=${complaint._id}`}
                                            className="hidden md:flex items-center justify-center p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                            title="Update Ticket Action"
                                        >
                                            <ExternalLink size={16} />
                                        </Link>
                                        <button className={`p-1.5 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-transform ${expandedId === complaint._id ? 'rotate-180' : ''}`}>
                                            <ChevronDown size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Detail Drawer */}
                                {expandedId === complaint._id && (
                                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-gray-100 bg-slate-50/50 animate-fade-in">
                                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pb-4 border-b border-gray-100">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400">Student System ID</span>
                                                    <span className="text-sm font-medium text-gray-800">{complaint.studentId.studentIdNum || 'N/A'}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400">Dorm Block</span>
                                                    <span className="text-sm font-medium text-gray-800">{complaint.studentId.dormBlock || 'N/A'}</span>
                                                </div>
                                                {complaint.location && (
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] uppercase font-bold text-indigo-400">Incident Location</span>
                                                        <span className="text-sm font-medium text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded">{complaint.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h4>
                                                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed max-w-4xl">
                                                    {complaint.description}
                                                </p>
                                            </div>

                                            {complaint.attachments && complaint.attachments.length > 0 && (
                                                <div className="pt-2">
                                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Attachments ({complaint.attachments.length})</h4>
                                                    <div className="flex gap-3 flex-wrap">
                                                        {complaint.attachments.map((file, idx) => (
                                                            <a
                                                                key={idx}
                                                                href={file.url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex items-center gap-2 text-sm bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg hover:border-indigo-400 hover:text-indigo-700 transition-all text-gray-600 group"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <Download className="text-gray-400 group-hover:text-indigo-500 transition-colors" size={16} />
                                                                <span className="max-w-[200px] truncate">{file.filename || `Attachment ${idx + 1}`}</span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="pt-4 flex justify-end items-center gap-4 border-t border-gray-50 mt-4">
                                                <Link
                                                    to={`/staff/update?ticket=${complaint._id}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 shadow-sm transition-transform active:scale-95"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <ExternalLink size={16} /> Update Status & Add Remark
                                                </Link>
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

export default AssignedComplaints;
