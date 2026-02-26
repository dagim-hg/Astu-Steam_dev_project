import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, FileText, History, Users, Settings, X,
    TrendingUp, UserPlus, Building2, Layers, PieChart, ClipboardList, CheckCircle, Bot, MessageSquare
} from 'lucide-react';

const Sidebar = ({ user, isOpen, toggleSidebar }) => {
    if (!user) return null;

    const studentLinks = [
        { name: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Submit Complaint', path: '/student/submit', icon: <FileText size={20} /> },
        { name: 'My Complaints', path: '/student/history', icon: <History size={20} /> },
        { name: 'AI Assistant', path: '/student/ai', icon: <Bot size={20} /> },
        { name: 'Profile', path: '/student/profile', icon: <Settings size={20} /> },
    ];

    const staffLinks = [
        { name: 'Dashboard', path: '/staff/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Assigned Complaints', path: '/staff/assigned', icon: <ClipboardList size={20} /> },
        { name: 'Update Complaint', path: '/staff/update', icon: <CheckCircle size={20} /> },
        { name: 'Profile', path: '/staff/profile', icon: <Settings size={20} /> },
    ];

    const adminLinks = [
        { name: 'Dashboard Overview', path: '/admin/dashboard', icon: <TrendingUp size={20} /> },
        { name: 'Register User', path: '/admin/users/register', icon: <UserPlus size={20} /> },
        { name: 'Manage Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Manage Departments', path: '/admin/departments', icon: <Building2 size={20} /> },
        { name: 'Manage Categories', path: '/admin/categories', icon: <Layers size={20} /> },
        { name: 'View All Complaints', path: '/admin/complaints', icon: <FileText size={20} /> },
        { name: 'Analytics', path: '/admin/analytics', icon: <PieChart size={20} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    ];

    const getNavLinks = () => {
        switch (user.role) {
            case 'Student':
                return studentLinks;
            case 'Staff':
                return staffLinks;
            case 'Admin':
                return adminLinks;
            default:
                return [];
        }
    };

    const navLinks = getNavLinks();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                    <span className="font-bold text-gray-800 dark:text-slate-200 tracking-wide text-sm uppercase text-blue-600 dark:text-blue-400">Menu</span>
                    <button onClick={toggleSidebar} className="lg:hidden text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-100 transition-colors p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path + link.name}
                            to={link.path}
                            onClick={() => {
                                if (window.innerWidth < 1024) toggleSidebar();
                            }}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold shadow-sm'
                                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 group-hover:text-blue-500'} transition-colors z-10`}>
                                        {link.icon}
                                    </div>
                                    <span className="z-10">{link.name}</span>
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 dark:bg-blue-400 rounded-r-md"></div>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* Decorative element at bottom */}
                <div className="p-4 mx-4 mb-4 mt-auto rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border border-blue-100 dark:border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 text-blue-200 dark:text-blue-900/30 opacity-50">
                        <MessageSquare size={64} />
                    </div>
                    <p className="text-xs text-blue-800 dark:text-blue-300 font-medium relative z-10 leading-relaxed">
                        Need help? Check out the AI Chatbot on your dashboard.
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
