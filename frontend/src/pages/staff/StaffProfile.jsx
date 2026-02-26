import { useState } from 'react';
import { User, Building2, Mail, Hash, Shield, GraduationCap, MapPin, Phone } from 'lucide-react';
import useAuth from '../../utils/useAuth';

const StaffProfile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Member Profile</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your department information and personal details.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Profile Header Background */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                    <div className="absolute inset-0 bg-white/10 pattern-dots"></div>
                </div>

                {/* Profile Avatar and Basic Info */}
                <div className="px-8 pb-8 flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 relative z-10">
                    <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg shrink-0">
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-100 to-blue-50 text-indigo-600 flex items-center justify-center text-3xl font-bold border border-indigo-100">
                            {user?.name?.charAt(0) || 'S'}
                        </div>
                    </div>
                    <div className="flex-1 pt-12 sm:pt-0 sm:mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{user?.name}</h2>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1.5 font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                                <Shield size={14} /> {user?.role || 'Staff'} Member
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                <Hash size={14} className="text-slate-400" /> {user?.systemId || 'STF-PENDING'}
                            </span>
                        </div>
                    </div>
                    <div className="w-full sm:w-auto mt-4 sm:mt-12">
                        <button 
                            className="w-full sm:w-auto px-6 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </button>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Profile Details Grid */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <User size={14} /> Personal Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                                    <div className="text-sm font-medium text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100">
                                        {user?.name}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
                                    <div className="text-sm font-medium text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100 flex items-center gap-2">
                                        <Mail size={16} className="text-gray-400" /> {user?.email}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number (Optional)</label>
                                    <div className="text-sm font-medium text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100 flex items-center gap-2">
                                        <Phone size={16} className="text-gray-400" /> Not Provided
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Building2 size={14} /> Department Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Assigned Department</label>
                                    <div className="text-sm font-medium text-indigo-900 bg-indigo-50 px-4 py-2.5 rounded-lg border border-indigo-100 flex items-center gap-2 shadow-sm">
                                        <Building2 size={16} className="text-indigo-500" /> 
                                        {user?.department || 'Department Not Set'}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1.5 ml-1">You will only receive tickets routed to this department.</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Office Building</label>
                                        <div className="text-sm font-medium text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100 flex items-center gap-2">
                                            <MapPin size={16} className="text-gray-400" /> Main Admin
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Permissions</label>
                                        <div className="text-sm font-medium text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100 flex items-center gap-2">
                                            <Shield size={16} className="text-gray-400" /> Standard Staff
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Section Stub */}
                        <div className="pt-4 border-t border-gray-100 mt-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Shield size={14} /> Account Security
                            </h3>
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 px-4 py-2 rounded-lg w-full text-center">
                                Request Password Reset
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StaffProfile;
