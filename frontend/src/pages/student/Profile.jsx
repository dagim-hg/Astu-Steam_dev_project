import { User, Mail, Shield, Building, Badge, Calendar, Lock, AlertCircle } from 'lucide-react';
import useAuth from '../../utils/useAuth';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative z-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Your Profile</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account information and preferences.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden relative">
                {/* Header Gradient */}
                <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 opacity-20 pointer-events-none transform -skew-y-12 translate-y-8"></div>
                </div>

                <div className="px-8 pb-8 relative">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:-mt-12 mb-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-xl shadow-blue-600/20">
                                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center text-gray-400">
                                    <User size={64} />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm ring-2 ring-transparent"></div>
                        </div>
                        <div className="pb-1">
                            <h2 className="text-3xl font-extrabold text-gray-900 leading-none">{user.name}</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-widest">{user.role}</span>
                                <span className="text-gray-400 font-medium text-sm">•</span>
                                <span className="text-gray-500 font-medium text-sm">Joined {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <Badge size={18} className="text-blue-500" />
                                Personal Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shrink-0">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shrink-0">
                                        <Building size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department / Info</p>
                                        <p className="text-sm font-semibold text-gray-900">{user.department || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shrink-0">
                                        <Shield size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Identifier</p>
                                        <p className="text-sm font-mono font-bold text-blue-600">{user.systemId || 'ASTU-' + user._id.substring(0, 8)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <Lock size={18} className="text-indigo-500" />
                                Account Security
                            </h3>
                            <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-gray-600 leading-relaxed italic">
                                        Account information visibility is controlled by the ASTU IT department. To change critical details like Name or Role, please visit the central registrar's office.
                                    </p>
                                </div>
                                <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors shadow-sm uppercase tracking-widest">
                                    Request Account Change
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
