import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, GraduationCap, Briefcase, ShieldCheck, User } from 'lucide-react';
import useAuth from '../../utils/useAuth';

const ROLES = [
    { id: 'Student', label: 'Student', icon: GraduationCap },
    { id: 'Staff', label: 'Staff', icon: Briefcase },
    { id: 'Admin', label: 'Admin', icon: ShieldCheck },
];

const Login = () => {
    const [selectedRole, setSelectedRole] = useState('Student');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const redirectPath = user.role === 'Admin' ? '/admin/dashboard' :
                user.role === 'Staff' ? '/staff/dashboard' : '/student/dashboard';
            navigate(redirectPath);
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const userData = await login(identifier, password, selectedRole);
            const redirectPath = userData.role === 'Admin' ? '/admin/dashboard' :
                userData.role === 'Staff' ? '/staff/dashboard' : '/student/dashboard';
            navigate(redirectPath);
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const isStudent = selectedRole === 'Student';
    const inputLabel = isStudent ? 'Student ID' : 'Email or System ID';
    const inputPlaceholder = isStudent ? 'ugr/1234/12' : 'email@astu.edu.et or STF-00001';
    const inputType = isStudent ? 'text' : 'text';
    const InputIcon = isStudent ? User : Mail;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
            {/* Decorative blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>

            <div className="max-w-md w-full space-y-8 glass-panel p-10 rounded-3xl relative z-10 border border-white/40 dark:border-slate-800 shadow-2xl transition-all duration-300">
                <div className="animate-fade-in">
                    <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30 mb-8 transform hover:scale-110 transition-transform cursor-default">
                        <span className="text-white text-4xl font-black tracking-tighter">A</span>
                    </div>
                    <h2 className="text-center text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-3">
                        System Access
                    </h2>
                    <p className="text-center text-base text-gray-600 dark:text-slate-400 font-semibold tracking-wide">
                        ASTU Smart Complaint Platform
                    </p>
                </div>

                {/* Role Toggle */}
                <div className="flex rounded-2xl bg-gray-200/50 dark:bg-slate-800/50 p-1.5 gap-1.5 border border-gray-200 dark:border-slate-700 backdrop-blur-sm">
                    {ROLES.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => { setSelectedRole(id); setIdentifier(''); setError(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                                selectedRole === id
                                    ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-lg scale-100'
                                    : 'text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <Icon size={18} />
                            {label}
                        </button>
                    ))}
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 p-4 rounded-xl flex items-start animate-fade-in">
                            <AlertCircle className="text-red-500 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" size={20} />
                            <p className="text-sm text-red-800 dark:text-red-300 font-bold">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-sm font-black text-gray-700 dark:text-slate-300 mb-2 ml-1 uppercase tracking-widest">{inputLabel}</label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-slate-500 group-focus-within/input:text-blue-600 dark:group-focus-within/input:text-blue-400 transition-colors">
                                    <InputIcon size={22} />
                                </div>
                                <input
                                    type={inputType}
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="appearance-none block w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 dark:focus:border-blue-500 transition-all sm:text-base font-bold bg-white dark:bg-slate-900 dark:text-white"
                                    placeholder={inputPlaceholder}
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-black text-gray-700 dark:text-slate-300 mb-2 ml-1 uppercase tracking-widest">Password</label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-slate-500 group-focus-within/input:text-blue-600 dark:group-focus-within/input:text-blue-400 transition-colors">
                                    <Lock size={22} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 dark:focus:border-blue-500 transition-all sm:text-base font-bold bg-white dark:bg-slate-900 dark:text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Link to="/forgot-password" text="Forgot Password?" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-black decoration-2 underline-offset-4 hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-black rounded-2xl text-white shadow-2xl transform active:scale-95 transition-all duration-300 ${
                                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/50'
                            }`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <span className="flex items-center tracking-tight">
                                    Sign in as {selectedRole}
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </div>
                </form>

                <div className="pt-4">
                    <p className="text-center text-xs text-gray-500 dark:text-slate-500 bg-gray-100 dark:bg-slate-900/50 py-4 px-6 rounded-2xl border border-gray-100 dark:border-slate-800 font-bold leading-relaxed">
                        ASTU Smart System Security Protocol enforced. Registration restricted.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
