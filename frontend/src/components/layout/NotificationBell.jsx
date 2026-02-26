import { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, ExternalLink, Clock, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get('/api/notifications');
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`/api/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axios.put('/api/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getTypeStyles = (type) => {
        switch (type) {
            case 'success': return 'bg-green-100 text-green-700 border-green-200';
            case 'warning': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle2 size={14} />;
            case 'warning': return <AlertCircle size={14} />;
            default: return <Bell size={14} />;
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 focus:outline-none"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            Notifications
                            {unreadCount > 0 && (
                                <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">
                                    {unreadCount} New
                                </span>
                            )}
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                            >
                                <Check size={14} />
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto cursor-default">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif._id}
                                        className={`p-4 transition-colors hover:bg-gray-50 flex gap-3 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <div className={`mt-1 h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${getTypeStyles(notif.type)}`}>
                                            {getTypeIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className={`text-sm font-bold truncate ${notif.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                                    {notif.title}
                                                </p>
                                                {!notif.isRead && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notif._id)}
                                                        className="text-gray-400 hover:text-blue-600"
                                                        title="Mark as read"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                                                {notif.message}
                                            </p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                                                    <Clock size={10} />
                                                    {formatTime(notif.createdAt)}
                                                </span>
                                                {notif.link && (
                                                    <Link
                                                        to={notif.link}
                                                        onClick={() => { setIsOpen(false); handleMarkAsRead(notif._id); }}
                                                        className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5"
                                                    >
                                                        Details
                                                        <ChevronRight size={12} />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                                    <Bell size={24} />
                                </div>
                                <p className="text-gray-500 font-medium">No notifications yet</p>
                                <p className="text-xs text-gray-400 mt-1">We'll alert you when something happens</p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            ASTU Complaints System
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
