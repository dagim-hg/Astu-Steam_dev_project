import { NavLink } from 'react-router-dom';
import {
    BarChart3,
    FileText,
    PlusCircle,
    Users,
    Settings,
    X,
    MessageSquare
} from 'lucide-react';

const Sidebar = ({ user, isOpen, toggleSidebar }) => {
    if (!user) return null;

    const getNavLinks = () => {
        switch (user.role) {
            case 'Student':
                return [
                    { name: 'Dashboard', path: '/student/dashboard', icon: <BarChart3 size={20} /> },
                    { name: 'Submit Complaint', path: '/student/submit', icon: <PlusCircle size={20} /> },
                    { name: 'My History', path: '/student/history', icon: <FileText size={20} /> },
                ];
            case 'Staff':
                return [
                    { name: 'Staff Dashboard', path: '/staff/dashboard', icon: <BarChart3 size={20} /> },
                ];
            case 'Admin':
                return [
                    { name: 'Analytics Dashboard', path: '/admin/dashboard', icon: <BarChart3 size={20} /> },
                    { name: 'Manage Users', path: '/admin/users', icon: <Users size={20} /> },
                    { name: 'System Settings', path: '/admin/settings', icon: <Settings size={20} /> },
                ];
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
                className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-gray-50/50">
                    <span className="font-bold text-gray-800 tracking-wide text-sm uppercase text-blue-600">Menu</span>
                    <button onClick={toggleSidebar} className="lg:hidden text-gray-500 hover:text-gray-800 transition-colors p-1 rounded hover:bg-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => {
                                if (window.innerWidth < 1024) toggleSidebar();
                            }}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'} transition-colors z-10`}>
                                        {link.icon}
                                    </div>
                                    <span className="z-10">{link.name}</span>
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 rounded-r-md"></div>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* Decorative element at bottom */}
                <div className="p-4 mx-4 mb-4 mt-auto rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 text-blue-200 opacity-50">
                        <MessageSquare size={64} />
                    </div>
                    <p className="text-xs text-blue-800 font-medium relative z-10 leading-relaxed">
                        Need help? Check out the AI Chatbot on your dashboard.
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
