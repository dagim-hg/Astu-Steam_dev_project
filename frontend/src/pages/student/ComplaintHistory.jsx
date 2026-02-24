import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, AlertCircle, Clock, CheckCircle2, ChevronDown, Download } from 'lucide-react';
import useAuth from '../../utils/useAuth';

const ComplaintHistory = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [expandedId, setExpandedId] = useState(null);

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
                setError('Failed to fetch complaints history');
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchComplaints();
    }, [user]);

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
            complaint.category.toLowerCase().includes(searchTerm.toLowerCase());
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
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Complaint History</h1>
                    <p className="text-sm text-gray-500 mt-1">View and track all your submitted issues.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search complaints..."
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
                        {searchTerm || statusFilter !== 'All' ? 'No complaints match your filters.' : 'You have no complaint history.'}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredComplaints.map((complaint) => (
                            <div key={complaint._id} className="transition-colors hover:bg-gray-50/50">
                                <div
                                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                                    onClick={() => toggleExpand(complaint._id)}
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
                                            <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-700 text-xs">{complaint.category}</span>
                                            <span>•</span>
                                            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-400 shrink-0">
                                        {/* ID Badge */}
                                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded-md text-gray-500 hidden md:inline-block border border-gray-200">
                                            ID: {complaint._id.substring(18).toUpperCase()}
                                        </span>
                                        <button className={`p-1.5 rounded-full hover:bg-gray-200 transition-transform ${expandedId === complaint._id ? 'rotate-180' : ''}`}>
                                            <ChevronDown size={20} className="text-gray-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {expandedId === complaint._id && (
                                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-gray-50 bg-gray-50/30 animate-fade-in">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h4>
                                                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
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
                                            </div>

                                            <div className="w-full md:w-1/3 space-y-4">
                                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                        <Clock size={14} /> Timeline
                                                    </h4>
                                                    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                            <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                                                            <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-2 rounded-lg bg-gray-50 border border-gray-100 shadow-sm ml-2 md:ml-0 text-xs">
                                                                <div className="font-medium text-gray-900">Submitted</div>
                                                                <div className="text-gray-500 mt-0.5">{new Date(complaint.createdAt).toLocaleString()}</div>
                                                            </div>
                                                        </div>

                                                        {complaint.remarks && complaint.remarks.map((remark, idx) => (
                                                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mt-3">
                                                                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-indigo-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                                                                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg bg-indigo-50 border border-indigo-100 shadow-sm ml-2 md:ml-0 text-xs relative">
                                                                    <div className="font-medium text-indigo-900 border-b border-indigo-100 pb-1 mb-1">
                                                                        Update by {remark.staffName}
                                                                    </div>
                                                                    <div className="text-gray-700 italic">"{remark.comment}"</div>
                                                                    <div className="text-indigo-400 mt-1 text-[10px] text-right">{new Date(remark.date).toLocaleString()}</div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {complaint.status === 'Resolved' && (
                                                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mt-3">
                                                                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                                                    <CheckCircle2 size={12} />
                                                                </div>
                                                                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-2 rounded-lg bg-green-50 border border-green-100 shadow-sm ml-2 md:ml-0 text-xs">
                                                                    <div className="font-medium text-green-900">Resolved</div>
                                                                    <div className="text-green-600 mt-0.5">{new Date(complaint.updatedAt).toLocaleString()}</div>
                                                                </div>
                                                            </div>
                                                        )}
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

export default ComplaintHistory;
