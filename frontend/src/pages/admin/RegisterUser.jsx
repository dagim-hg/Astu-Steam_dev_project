import { useState } from 'react';
import axios from 'axios';
import { Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import useAuth from '../../utils/useAuth';
import { DEPARTMENTS, STUDENT_DEPARTMENTS } from '../../utils/constants';

const RegisterUser = () => {
    const { user } = useAuth();

    // User creation state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [department, setDepartment] = useState('');
    const [studentIdNum, setStudentIdNum] = useState('');
    const [dormBlock, setDormBlock] = useState('');

    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        setFormSuccess('');

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const payload = {
                name,
                email,
                password,
                role,
                department: (role === 'Student' || role === 'Staff') ? department : undefined,
                studentIdNum: role === 'Student' ? studentIdNum : undefined,
                dormBlock: role === 'Student' ? dormBlock : undefined
            };

            const response = await axios.post('/api/admin/create-user', payload, config);

            setFormSuccess(`Successfully created ${role} account for ${name} (ID: ${response.data.systemId})`);

            // Reset form
            setName('');
            setEmail('');
            setPassword('');
            setRole('Student');
            setDepartment('');
            setStudentIdNum('');
            setDormBlock('');
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to create user');
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Register New User</h1>
                <p className="text-sm text-gray-500 mt-1">Create accounts for Students, Staff members, or new Administrators.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                    <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Account Details</h3>
                        <p className="text-xs text-gray-500">System IDs are automatically generated based on the selected role.</p>
                    </div>
                </div>

                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Basic Info Column */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 focus-within:text-indigo-600 transition-colors">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all hover:border-gray-400"
                                placeholder="Enter full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 focus-within:text-indigo-600 transition-colors">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all hover:border-gray-400"
                                placeholder="name@astu.edu.et"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 focus-within:text-indigo-600 transition-colors">
                                Initial Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all hover:border-gray-400"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Role & Specific Info Column */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 focus-within:text-indigo-600 transition-colors">
                                Account Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    setDepartment('');
                                }}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none bg-white transition-all hover:border-gray-400 cursor-pointer"
                            >
                                <option value="Student">Student (ugr/xxxx/xx)</option>
                                <option value="Staff">Staff (STF-xxxxx)</option>
                                <option value="Admin">Administrator (ADM-xxxxx)</option>
                            </select>
                        </div>

                        {/* Dynamic Fields based on Role */}
                        <div className="min-h-[160px]">
                            {(role === 'Staff' || role === 'Student') && (
                                <div className="animate-fade-in group mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 group-focus-within:text-indigo-600 transition-colors">
                                        Department / Faculty <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none bg-white transition-all hover:border-gray-400 cursor-pointer"
                                    >
                                        <option value="" disabled>Select Department</option>

                                        {role === 'Student' && (
                                            <>
                                                {STUDENT_DEPARTMENTS.map(group => (
                                                    <optgroup key={group.label} label={group.label}>
                                                        {group.options.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </>
                                        )}

                                        {role === 'Staff' && (
                                            <>
                                                {DEPARTMENTS.filter(d => d.value !== 'Other').map(dept => (
                                                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                </div>
                            )}

                            {role === 'Student' && (
                                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5 group-focus-within:text-indigo-600 transition-colors">
                                            Student ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={studentIdNum}
                                            onChange={(e) => setStudentIdNum(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all hover:border-gray-400"
                                            placeholder="ATR/0000/00"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5 group-focus-within:text-indigo-600 transition-colors">
                                            Dorm Block <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={dormBlock}
                                            onChange={(e) => setDormBlock(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all hover:border-gray-400"
                                            placeholder="Block 50x"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Status Messages */}
                        <div className="h-14">
                            {formError && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2 animate-fade-in">
                                    <AlertCircle size={18} className="shrink-0" />
                                    <span className="truncate" title={formError}>{formError}</span>
                                </div>
                            )}

                            {formSuccess && (
                                <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2 animate-fade-in">
                                    <CheckCircle2 size={18} className="shrink-0" />
                                    <span className="truncate" title={formSuccess}>{formSuccess}</span>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={formLoading}
                                className={`w-full py-3 px-4 rounded-xl text-white font-semibold transition-all shadow-lg shadow-indigo-200/50 active:scale-[0.98] flex justify-center items-center gap-2 
                                ${formLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300/50'}`}
                            >
                                {formLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Creating System Account...
                                    </>
                                ) : (
                                    'Register New Account'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterUser;
