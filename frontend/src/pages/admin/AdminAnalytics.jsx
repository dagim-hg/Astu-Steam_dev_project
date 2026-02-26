import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../utils/useAuth';
import { BarChart3, PieChart, Activity, TrendingUp, Filter, Calendar } from 'lucide-react';

const AdminAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState('30days');

    const { user } = useAuth();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const res = await axios.get('/api/analytics', config);
                setData(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch analytics');
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchAnalytics();
        }
    }, [user, timeRange]);

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
                <Activity size={32} className="mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">Analytics Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    const { metrics, complaintsByCategory } = data || { metrics: {}, complaintsByCategory: [] };

    // Placeholder Data for visual rendering (In production, map backend data to charting libraries like Recharts or Chart.js)
    const departmentsData = [
        { name: 'ICT', count: 45, width: '80%' },
        { name: 'Facilities', count: 32, width: '60%' },
        { name: 'Dormitory', count: 28, width: '50%' },
        { name: 'Registrar', count: 15, width: '30%' },
        { name: 'Academic', count: 12, width: '25%' },
    ];

    const resolutionRate = metrics.totalComplaints > 0 
        ? Math.round((metrics.resolvedComplaints / metrics.totalComplaints) * 100) 
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Analytics</h1>
                    <p className="text-sm text-gray-500 mt-1">Deep dive into university-wide complaint trends and resolution performance.</p>
                </div>

                <div className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded-xl">
                    <Calendar size={16} className="text-gray-400" />
                    <select 
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
                    >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last Quarter</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>

            {/* Top KPI row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-20 transform group-hover:scale-110 transition-transform">
                        <Activity size={80} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-indigo-100 font-medium mb-1">Issue Volume Index</p>
                        <div className="text-4xl font-bold mb-2">{metrics.totalComplaints}</div>
                        <div className="flex items-center gap-1 text-sm bg-white/20 inline-flex px-2 py-0.5 rounded-md">
                            <TrendingUp size={14} />
                            <span>+12% vs last period</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-20 transform group-hover:scale-110 transition-transform">
                        <PieChart size={80} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-emerald-100 font-medium mb-1">Resolution Success Rate</p>
                        <div className="text-4xl font-bold mb-2">{resolutionRate}%</div>
                        <div className="flex items-center gap-1 text-sm bg-white/20 inline-flex px-2 py-0.5 rounded-md">
                            <TrendingUp size={14} />
                            <span>Optimal (+5% target)</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center group">
                    <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <BarChart3 size={32} />
                    </div>
                    <h3 className="text-gray-900 font-semibold text-lg">Download Full Report</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4">Export detailed CSV analytics for auditing.</p>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                        Generate File &rarr;
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Load Distribution */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <BarChart3 size={20} className="text-indigo-500" />
                                Department Workload
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Number of active issues assigned per department</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                            <Filter size={16} />
                        </div>
                    </div>

                    <div className="flex-1 space-y-5">
                        {departmentsData.map((dept, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-end mb-1.5 text-sm">
                                    <span className="font-medium text-gray-700">{dept.name}</span>
                                    <span className="font-semibold text-gray-900">{dept.count} <span className="text-xs text-gray-400 font-normal">tickets</span></span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div 
                                        className="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                                        style={{ width: dept.width }}
                                    >
                                        <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-white/20 to-transparent"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories Heatmap / Distribution */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <PieChart size={20} className="text-emerald-500" />
                                Category Distribution
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Breakdown of issues by core category</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        {complaintsByCategory.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">No categorical data available.</div>
                        ) : (
                            complaintsByCategory.map((cat, idx) => {
                                const percentage = Math.round((cat.count / metrics.totalComplaints) * 100);
                                const colors = ['bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500'];
                                const color = colors[idx % colors.length];

                                return (
                                    <div key={idx} className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-gray-700 shrink-0 shadow-sm group-hover:border-gray-300 transition-colors">
                                            {percentage}%
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-end mb-1">
                                                <span className="text-sm font-medium text-gray-800">{cat._id}</span>
                                                <span className="text-xs text-gray-500">{cat.count} total</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                <div 
                                                    className={`${color} h-full rounded-full transition-all duration-1000`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
