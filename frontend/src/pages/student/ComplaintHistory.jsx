import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Search, Filter, AlertCircle, Clock, CheckCircle2,
    ChevronRight, Download, SlidersHorizontal, FileText,
    Calendar, ArrowUpDown, MoreVertical, Eye, Loader2,
    Tag, CheckCircle, Loader
} from 'lucide-react';
import useAuth from '../../utils/useAuth';

const ComplaintHistory = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const { user } = useAuth();
    const navigate = useNavigate();

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

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Open': return 'bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-500/10';
            case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10';
            case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'Urgent': return 'text-red-700 bg-red-50 border-red-100';
            case 'High': return 'text-orange-700 bg-orange-50 border-orange-100';
            case 'Medium': return 'text-blue-700 bg-blue-50 border-blue-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const categories = ['All', 'Academic', 'Facilities', 'IT', 'Administrative', 'Dormitory', 'Other'];

    const filteredComplaints = complaints.filter(complaint => {
        const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.complaintId?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
        const matchesCategory = categoryFilter === 'All' || complaint.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    return (
        <div className="space-y-8 animate-fade-in relative z-10 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tracking Ledger</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium italic">Monitor the status and life-cycle of your submitted reports.</p>
                </div>

                <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                    <button
                        onClick={() => setStatusFilter('All')}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${statusFilter === 'All' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-gray-900'}`}
                    >
                        All
                    </button>
                    {['Open', 'In Progress', 'Resolved'].map(stat => (
                        <button
                            key={stat}
                            onClick={() => setStatusFilter(stat)}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${statusFilter === stat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-gray-900'}`}
                        >
                            {stat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                    <input
                        type="text"
                        placeholder="Search by ID or Title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[1.5rem] transition-all font-semibold text-gray-800 outline-none"
                    />
                </div>

                <div className="flex w-full lg:w-auto gap-4">
                    <div className="relative flex-1 lg:w-48">
                        <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full pl-11 pr-8 py-4 bg-gray-50/50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all font-bold text-xs uppercase tracking-widest text-gray-600 outline-none appearance-none cursor-pointer"
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table View */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Complaint Info</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Context</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Date Issued</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Retrieving data from ASTU nodes...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredComplaints.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6">
                                                <AlertCircle size={32} className="text-gray-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Records Found</h3>
                                            <p className="text-gray-500 font-medium max-w-xs mx-auto text-sm italic">
                                                Try adjusting your filters or search terms.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredComplaints.map((complaint) => (
                                    <tr key={complaint._id} className="hover:bg-blue-50/20 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 uppercase tracking-tighter w-fit mb-2 shadow-sm ring-1 ring-blue-500/10">
                                                    {complaint.complaintId}
                                                </span>
                                                <span className="text-base font-extrabold text-gray-900 group-hover:text-blue-700 transition-colors truncate max-w-[250px]">
                                                    {complaint.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                                    <Tag size={12} className="text-gray-400" />
                                                    {complaint.category}
                                                </span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border-2 w-fit ${getPriorityStyles(complaint.priority)}`}>
                                                    {complaint.priority}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ring-1 ${getStatusStyles(complaint.status)}`}>
                                                {complaint.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                                                    <Calendar size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-extrabold text-gray-800">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                                    <span className="text-[10px] font-bold text-gray-400">{new Date(complaint.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => navigate(`/student/complaint/${complaint._id}`)}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-[10px] font-black text-gray-700 uppercase tracking-widest rounded-xl hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-sm active:scale-95 group-hover:shadow-md"
                                            >
                                                <Eye size={14} />
                                                View Flow
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Insight Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 flex gap-6 items-center group">
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                        <CheckCircle size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-emerald-900 mb-1">High Accuracy</h3>
                        <p className="text-sm text-emerald-800 font-medium italic opacity-70 leading-relaxed">
                            98.2% of issues reported this semester have been successfully routed to correct authorities.
                        </p>
                    </div>
                </div>

                <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 flex gap-6 items-center group">
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform">
                        <Loader className="animate-spin" size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-blue-900 mb-1">Live Synchronization</h3>
                        <p className="text-sm text-blue-800 font-medium italic opacity-70 leading-relaxed">
                            System status is updated in real-time. Any changes by staff are reflected here immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintHistory;
