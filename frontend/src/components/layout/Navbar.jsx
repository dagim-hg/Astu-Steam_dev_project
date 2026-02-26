import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, Menu, Sun, Moon } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ toggleSidebar, user, onLogout }) => {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useTheme();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30 w-full h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm transition-all duration-300">
            <div className="flex items-center gap-4">
                {user && (
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 lg:hidden text-gray-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <Menu size={24} />
                    </button>
                )}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
                        A
                    </div>
                    <span className="font-bold text-xl text-gray-800 dark:text-white hidden sm:block tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">
                        ASTU Complaints
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="Toggle Dark Mode"
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {user ? (
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        
                        <div className="hidden md:flex flex-col text-right">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
                            <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-medium px-2 py-0.5 rounded-full inline-block mt-0.5">
                                {user.role} {user.department && `- ${user.department}`}
                            </span>
                        </div>

                        <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 hidden sm:block"></div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg shadow-sm shadow-blue-600/20"
                        >
                            Login
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
