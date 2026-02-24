import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileText, CheckCircle2, Clock, AlertCircle, TrendingUp, PieChart } from 'lucide-react';
import useAuth from '../../utils/useAuth';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user } = useAuth();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const response = await axios.get('/api/analytics', config);
                setData(response.data);
            } catch (err) {
                setError('Failed to fetch analytics data');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
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

    const { metrics, complaintsByCategory } = data;

    // Calculate resolution rate
    const resolutionRate = metrics.totalComplaints > 0
        ? Math.round((metrics.resolvedComplaints / metrics.totalComplaints) * 100)
        : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Overview</h1>
                <p className="text-sm text-gray-500 mt-1">High-level metrics and system analytics for administrators.</p>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
                        <FileText size={64} className="text-blue-500" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <FileText size={18} className="text-blue-500" />
                            <span className="text-sm font-medium">Total Complaints</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{metrics.totalComplaints}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle2 size={64} className="text-green-500" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <TrendingUp size={18} className="text-green-500" />
                            <span className="text-sm font-medium">Resolution Rate</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-3xl font-bold text-gray-900">{resolutionRate}%</div>
                            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 flex items-center rounded-full">
                                {metrics.resolvedComplaints} resolved
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
                        <Clock size={64} className="text-yellow-500" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Clock size={18} className="text-yellow-500" />
                            <span className="text-sm font-medium">Open & Pending</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{metrics.openComplaints + metrics.inProgressComplaints}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
                        <Users size={64} className="text-indigo-500" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Users size={18} className="text-indigo-500" />
                            <span className="text-sm font-medium">System Users</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-3xl font-bold text-gray-900">{metrics.totalUsers}</div>
                            <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 flex items-center rounded-full">
                                {metrics.totalStaff} staff
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Category Breakdown list */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm lg:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                        <PieChart size={20} className="text-blue-500" />
                        Issues by Category
                    </h3>

                    <div className="space-y-4">
                        {complaintsByCategory.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">No data available yet</p>
                        ) : (
                            complaintsByCategory.map((cat, index) => {
                                const percentage = Math.round((cat.count / metrics.totalComplaints) * 100);
                                const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500'];
                                const color = colors[index % colors.length];

                                return (
                                    <div key={cat._id} className="group">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-sm font-medium text-gray-700">{cat._id}</span>
                                            <span className="text-xs font-semibold text-gray-500">{cat.count} ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`${color} h-2 rounded-full transition-all duration-1000 ease-out`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Status Pipeline */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Complaint Fulfillment Pipeline</h3>

                    <div className="relative max-w-2xl mx-auto h-full min-h-[250px] flex items-center">
                        {metrics.totalComplaints === 0 ? (
                            <p className="text-sm text-gray-500 text-center w-full">System has zero complaints recorded.</p>
                        ) : (
                            <div className="w-full space-y-8">
                                {/* Pipeline Step 1 */}
                                <div className="relative">
                                    <div className="flex items-center justify-between z-10 relative">
                                        <div className="w-10 h-10 rounded-full bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center font-bold text-yellow-700 z-10">1</div>
                                        <div className="flex-1 ml-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center group hover:border-yellow-200 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-800">Newly Submitted (Open)</span>
                                                <span className="text-xs text-gray-500">Awaiting staff assignment</span>
                                            </div>
                                            <span className="text-2xl font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-lg">{metrics.openComplaints}</span>
                                        </div>
                                    </div>
                                    {/* Connector line */}
                                    <div className="absolute top-10 left-4.5 bottom-[-2rem] w-1 bg-gradient-to-b from-yellow-300 to-blue-300 z-0 hidden sm:block"></div>
                                </div>

                                {/* Pipeline Step 2 */}
                                <div className="relative pt-2">
                                    <div className="flex items-center justify-between z-10 relative">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center font-bold text-blue-700 z-10">2</div>
                                        <div className="flex-1 ml-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center group hover:border-blue-200 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-800">In Progress</span>
                                                <span className="text-xs text-gray-500">Being actively worked on by Staff</span>
                                            </div>
                                            <span className="text-2xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{metrics.inProgressComplaints}</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-10 left-4.5 bottom-[-2rem] w-1 bg-gradient-to-b from-blue-300 to-green-300 z-0 hidden sm:block"></div>
                                </div>

                                {/* Pipeline Step 3 */}
                                <div className="relative pt-2">
                                    <div className="flex items-center justify-between z-10 relative">
                                        <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center font-bold text-green-700 z-10">3</div>
                                        <div className="flex-1 ml-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center group hover:border-green-200 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-800">Resolved Successfully</span>
                                                <span className="text-xs text-gray-500">Completed and closed issues</span>
                                            </div>
                                            <span className="text-2xl font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">{metrics.resolvedComplaints}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
