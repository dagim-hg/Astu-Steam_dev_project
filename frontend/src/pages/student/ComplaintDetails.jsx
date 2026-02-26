import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, CheckCircle, AlertCircle, ArrowLeft, FileText, User, Calendar, MapPin } from 'lucide-react';
import useAuth from '../../utils/useAuth';

const ComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get(`/api/complaints/${id}`, config);
                setComplaint(data);
            } catch (err) {
                setError('Failed to fetch complaint details');
            } finally {
                setLoading(false);
            }
        };

        if (user && id) fetchComplaint();
    }, [user, id]);

    if (loading) return <div className="p-8 text-center text-gray-500 italic animate-pulse">Loading detailed view...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-medium bg-red-50 rounded-xl m-4 border border-red-100">{error}</div>;
    if (!complaint) return <div className="p-8 text-center text-gray-500">Complaint not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative z-10 pb-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium group"
            >
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to List
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded border border-blue-200">
                            {complaint.complaintId}
                        </span>
                        <span className="text-sm font-medium text-gray-500">Submitted on {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{complaint.title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border shadow-sm flex items-center gap-2 ${complaint.status === 'Open' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        complaint.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-green-50 text-green-700 border-green-200'
                        }`}>
                        {complaint.status === 'Open' ? <AlertCircle size={16} /> :
                            complaint.status === 'In Progress' ? <Clock size={16} /> :
                                <CheckCircle size={16} />}
                        {complaint.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</p>
                                <p className="text-gray-900 font-semibold flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    {complaint.category}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</p>
                                <p className={`font-bold inline-flex px-2 py-0.5 rounded text-xs border ${complaint.priority === 'Urgent' ? 'bg-red-50 text-red-700 border-red-200' :
                                    complaint.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                        'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}>
                                    {complaint.priority}
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg italic bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200">
                                "{complaint.description}"
                            </p>
                        </div>

                        {complaint.location && (
                            <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
                                <MapPin size={18} className="text-gray-400" />
                                <span className="text-gray-700 font-medium">Location: <span className="text-gray-900">{complaint.location}</span></span>
                            </div>
                        )}
                    </div>

                    {complaint.attachments && complaint.attachments.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-indigo-500" />
                                Evidence & Attachments
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {complaint.attachments.map((file, idx) => (
                                    <a
                                        key={idx}
                                        href={file.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center p-3 border border-gray-100 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                                            <FileText size={20} className="text-gray-400 group-hover:text-blue-600" />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{file.filename}</p>
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">View File</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-gray-900">
                            <Clock size={80} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 relative z-10">Complaint Journey</h3>
                        <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-100">
                            <div className="relative pl-8">
                                <div className="absolute left-0 w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow-sm z-10"></div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-gray-900">Submitted</p>
                                    <p className="text-xs text-gray-500 font-medium italic">{new Date(complaint.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            {complaint.remarks && complaint.remarks.map((remark, idx) => (
                                <div key={idx} className="relative pl-8">
                                    <div className="absolute left-0 w-6 h-6 rounded-full bg-indigo-500 border-4 border-white shadow-sm z-10"></div>
                                    <div className="space-y-2 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                                        <p className="text-sm font-bold text-indigo-900 leading-tight">Staff Remark: {remark.staffName}</p>
                                        <p className="text-sm text-gray-700 italic">"{remark.comment}"</p>
                                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">{new Date(remark.date).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}

                            {complaint.status === 'Resolved' && (
                                <div className="relative pl-8">
                                    <div className="absolute left-0 w-6 h-6 rounded-full bg-green-500 border-4 border-white shadow-sm z-10 flex items-center justify-center">
                                        <CheckCircle size={12} className="text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-green-700">Problem Resolved</p>
                                        <p className="text-xs text-gray-500 font-medium italic">{new Date(complaint.updatedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetails;
