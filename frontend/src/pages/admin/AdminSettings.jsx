import { useState } from 'react';
import { 
    User, Lock, Bell, Shield, Database, 
    Save, ToggleLeft, ToggleRight, ServerCrash, 
    Smartphone, Mail, AlertTriangle, Monitor, Globe
} from 'lucide-react';
import useAuth from '../../utils/useAuth';

const AdminSettings = () => {
    const { user } = useAuth();
    
    // UI State for toggles
    const [toggles, setToggles] = useState({
        emailAlerts: true,
        smsAlerts: false,
        weeklyDigest: true,
        maintenanceMode: false,
        autoAssign: true,
        twoFactor: false
    });

    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const handleToggle = (key) => {
        setToggles(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        setSaveMessage('');
        
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setSaveMessage('Settings updated successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        }, 800);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage platform configuration, security, and your administrator profile.</p>
                </div>

                <div className="flex items-center gap-3">
                    {saveMessage && (
                        <span className="text-sm text-emerald-600 font-medium animate-fade-in bg-emerald-50 px-3 py-1 rounded-lg">
                            {saveMessage}
                        </span>
                    )}
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Settings Sidebar Navigation */}
                <div className="lg:w-64 shrink-0 space-y-1">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm
                            ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <User size={18} />
                        Admin Profile
                    </button>
                    <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm
                            ${activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <Bell size={18} />
                        Notifications
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm
                            ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <Shield size={18} />
                        Security & Access
                    </button>
                    <button 
                        onClick={() => setActiveTab('system')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm
                            ${activeTab === 'system' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <Monitor size={18} />
                        Platform Preferences
                    </button>
                </div>

                {/* Settings Content Area */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        
                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="p-8 animate-fade-in">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Administrator Profile</h2>
                                
                                <div className="space-y-6 max-w-2xl">
                                    <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                            {user?.name?.charAt(0) || 'A'}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
                                            <p className="text-sm text-gray-500 mb-2">{user?.role} Account • {user?.email}</p>
                                            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                                                Change Avatar
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5 focus-within:text-indigo-600 transition-colors">Full Name</label>
                                            <input type="text" defaultValue={user?.name} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5 focus-within:text-indigo-600 transition-colors">Email Address</label>
                                            <input type="email" defaultValue={user?.email} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all" />
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5 focus-within:text-indigo-600 transition-colors">Admin Bio (Internal)</label>
                                        <textarea rows="3" placeholder="Add a short bio or contact instructions for staff..." className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all resize-none"></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className="p-8 animate-fade-in">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Alerts & Notifications</h2>
                                
                                <div className="space-y-6 max-w-2xl">
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Mail size={20} /></div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Email Alerts</h4>
                                                <p className="text-sm text-gray-500">Receive emails for high-priority server alerts.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleToggle('emailAlerts')} className={`text-3xl ${toggles.emailAlerts ? 'text-indigo-600' : 'text-gray-300'} transition-colors`}>
                                            {toggles.emailAlerts ? <ToggleRight /> : <ToggleLeft />}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Smartphone size={20} /></div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                                                <p className="text-sm text-gray-500">Get text messages when critical systems fail.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleToggle('smsAlerts')} className={`text-3xl ${toggles.smsAlerts ? 'text-indigo-600' : 'text-gray-300'} transition-colors`}>
                                            {toggles.smsAlerts ? <ToggleRight /> : <ToggleLeft />}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Globe size={20} /></div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Weekly Digest</h4>
                                                <p className="text-sm text-gray-500">A weekly summary report of all platform analytics.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleToggle('weeklyDigest')} className={`text-3xl ${toggles.weeklyDigest ? 'text-indigo-600' : 'text-gray-300'} transition-colors`}>
                                            {toggles.weeklyDigest ? <ToggleRight /> : <ToggleLeft />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <div className="p-8 animate-fade-in">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Security & Access Control</h2>
                                
                                <div className="space-y-8 max-w-2xl">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Authentication</h3>
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-amber-100 bg-amber-50/30">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Lock size={20} /></div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Two-Factor Authentication (2FA)</h4>
                                                    <p className="text-sm text-gray-500">Add an extra layer of security to your Admin account.</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleToggle('twoFactor')} className={`text-3xl ${toggles.twoFactor ? 'text-indigo-600' : 'text-gray-300'} transition-colors`}>
                                                {toggles.twoFactor ? <ToggleRight /> : <ToggleLeft />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Active Sessions</h3>
                                        <div className="p-4 rounded-xl border border-gray-200">
                                            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <Monitor size={18} className="text-gray-400" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Windows PC • Chrome</p>
                                                        <p className="text-xs text-green-600 font-medium">Active Now (This Device)</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400">Addis Ababa, ET</span>
                                            </div>
                                            <button className="text-sm text-red-600 font-medium hover:text-red-800 transition-colors py-1">
                                                Log out of all other sessions
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SYSTEM TAB */}
                        {activeTab === 'system' && (
                            <div className="p-8 animate-fade-in">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Platform Preferences</h2>
                                
                                <div className="space-y-6 max-w-2xl">
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Database size={20} /></div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Smart Ticket Routing</h4>
                                                <p className="text-sm text-gray-500">Automatically assign incoming tickets based on department selected.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleToggle('autoAssign')} className={`text-3xl ${toggles.autoAssign ? 'text-indigo-600' : 'text-gray-300'} transition-colors`}>
                                            {toggles.autoAssign ? <ToggleRight /> : <ToggleLeft />}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl border-red-100 bg-red-50/30 transition-colors group">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={20} /></div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                                                <p className="text-sm text-gray-500">Lock out all non-admin users to perform system updates.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleToggle('maintenanceMode')} className={`text-3xl ${toggles.maintenanceMode ? 'text-red-500' : 'text-gray-300'} transition-colors`}>
                                            {toggles.maintenanceMode ? <ToggleRight /> : <ToggleLeft />}
                                        </button>
                                    </div>
                                    
                                    <div className="pt-6 mt-6 border-t border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Advanced Danger Zone</h3>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">System Database Reset</p>
                                                <p className="text-xs text-gray-500">Purge all logs and reset metric caches.</p>
                                            </div>
                                            <button className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                                                Purge Logs Let
                                            </button>
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

export default AdminSettings;
