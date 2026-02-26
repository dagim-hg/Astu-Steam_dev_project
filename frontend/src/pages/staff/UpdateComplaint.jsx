import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, AlertCircle, Save, Image as ImageIcon, ArrowLeft, CheckCircle2, Clock, X } from 'lucide-react';
import useAuth from '../../utils/useAuth';

const UpdateComplaint = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const ticketId = searchParams.get('ticket');

    const [searchQuery, setSearchQuery] = useState(ticketId || '');
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(!!ticketId);
    const [error, setError] = useState('');

    // Form State
    const [updateStatus, setUpdateStatus] = useState('');
    const [remark, setRemark] = useState('');
    const [updating, setUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [selectedFile, setSelectedFile] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        if (ticketId) {
            handleSearch(ticketId);
        }
    }, [ticketId]);

    const handleSearch = async (idToSearch) => {
        const query = idToSearch || searchQuery;
        if (!query) return;

        setLoading(true);
        setError('');
        setComplaint(null);
        setSuccessMessage('');

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            // Direct tracking lookup
            const { data } = await axios.get(`/api/complaints/tracking/${query}`, config);
            setComplaint(data);
            setUpdateStatus(data.status);
        } catch (err) {
            setError(err.response?.data?.message || 'Ticket not found or not authorized.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        if (!complaint) return;
        if (!remark && updateStatus === complaint.status && !selectedFile) return;

        setUpdating(true);
        setError('');

        try {
            const formData = new FormData();
            if (updateStatus) formData.append('status', updateStatus);
            if (remark) formData.append('remark', remark);
            if (selectedFile) formData.append('resolutionImage', selectedFile);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            const { data } = await axios.put(`/api/complaints/${complaint._id}`, formData, config);

            setSuccessMessage('Ticket updated successfully.');
            setRemark('');
            setSelectedFile(null);

            // Update local state to reflect changes without remounting
            setComplaint(data);
            setUpdateStatus(data.status);

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update ticket.');
        } finally {
            setUpdating(false);
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

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Update Complaint</h1>
                    <p className="text-sm text-gray-500 mt-1">Search for a ticket or select one from the queue to process.</p>
                </div>
                <button
                    onClick={() => navigate('/staff/assigned')}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Queue
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex gap-3">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Scan or enter Ticket ID (E.g. CMP-108342) or Database ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 transition-all font-mono"
                    />
                </div>
                <button
                    onClick={() => handleSearch()}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
                >
                    Find Ticket
                </button>
            </div>

            {/* Error and Loading States */}
            {loading && (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-500 font-medium tracking-wide animate-pulse">Retrieving ticket details...</p>
                </div>
            )}

            {error && !loading && (
                <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex items-start gap-4">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={24} />
                    <div>
                        <h3 className="text-red-800 font-semibold mb-1">Retrieval Failed</h3>
                        <p className="text-red-600 text-sm leading-relaxed">{error}</p>
                    </div>
                </div>
            )}

            {/* Ticket Workspace */}
            {complaint && !loading && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">

                    {/* Header Strip */}
                    <div className="bg-gray-50 border-b border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-sm font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded shadow-sm border border-slate-200">
                                    {complaint.complaintId || 'PENDING ID'}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>
                                    {complaint.status}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{complaint.title}</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-500">Submitted by</p>
                            <p className="text-sm font-bold text-gray-900">{complaint.studentId?.name || 'Unknown Student'}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{new Date(complaint.createdAt).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Details */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Issue Description</h3>
                                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[120px]">
                                    {complaint.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</h3>
                                    <p className="font-medium text-gray-900">{complaint.category}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</h3>
                                    <p className="font-medium text-gray-900">{complaint.location || 'N/A'}</p>
                                </div>
                            </div>

                            {complaint.remarks && complaint.remarks.length > 0 && (
                                <div className="pt-4 border-t border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Clock size={14} /> Resolution Timeline
                                    </h3>
                                    <div className="space-y-4">
                                        {complaint.remarks.map((rmk, idx) => (
                                            <div key={idx} className="relative pl-4 border-l-2 border-indigo-100 py-1">
                                                <div className="absolute w-2 h-2 bg-indigo-500 rounded-full -left-[5px] top-2 shadow border-2 border-white"></div>
                                                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-50 text-sm">
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <span className="font-semibold text-indigo-900">{rmk.staffName}</span>
                                                        <span className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider">
                                                            {new Date(rmk.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700 leading-snug">{rmk.comment}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Action Form */}
                        <div>
                            <form onSubmit={handleSubmitUpdate} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-1">Take Action</h3>
                                <p className="text-sm text-slate-500 mb-6">Update the status and append an official remark to the ticket history.</p>

                                {successMessage && (
                                    <div className="mb-4 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium border border-emerald-100 flex items-center gap-2 animate-fade-in">
                                        <CheckCircle2 size={16} /> {successMessage}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Set Status</label>
                                        <select
                                            value={updateStatus}
                                            onChange={(e) => setUpdateStatus(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium text-slate-900 transition-all outline-none"
                                        >
                                            <option value="Open">Open (Pending Triage)</option>
                                            <option value="In Progress">In Progress (Actively Working)</option>
                                            <option value="Resolved">Resolved (Issue Fixed)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Official Remark</label>
                                        <textarea
                                            value={remark}
                                            onChange={(e) => setRemark(e.target.value)}
                                            rows="4"
                                            placeholder="Document your actions, findings, or resolution details here. This will be visible in the history logs..."
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all resize-none outline-none"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Attach Proof (Optional)</label>
                                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-white hover:bg-slate-50 transition-colors cursor-pointer text-center">
                                            <ImageIcon className="mx-auto text-slate-400 mb-2" size={24} />
                                            <span className="text-sm text-slate-500 font-medium">Click to upload resolution image</span>
                                            <input type="file" className="hidden" />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={updating || (!remark && updateStatus === complaint.status)}
                                        className="w-full mt-4 flex justify-center items-center gap-2 px-6 py-3.5 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                                    >
                                        {updating ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Save size={18} />
                                        )}
                                        {updating ? 'Saving Changes...' : 'Confirm Update & Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateComplaint;
