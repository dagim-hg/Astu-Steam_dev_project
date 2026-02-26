import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ user, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
            <Sidebar user={user} isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Navbar toggleSidebar={toggleSidebar} user={user} onLogout={onLogout} />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto custom-scrollbar">
                    <div className="animate-fade-in w-full text-gray-900 dark:text-slate-100">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
