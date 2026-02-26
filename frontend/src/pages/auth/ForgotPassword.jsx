import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, CheckCircle2, ArrowRight, KeyRound, RefreshCw } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [receivedOtp, setReceivedOtp] = useState(''); // Dev mode only

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await axios.post('/api/auth/forgot-password', { email });
            setStep(2);
            if (data.otp) {
                setReceivedOtp(data.otp);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error requesting OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }
        if (newPassword.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setIsLoading(true);
        setError('');

        try {
            const { data } = await axios.post('/api/auth/reset-password', {
                email,
                otp,
                newPassword
            });
            setSuccessMessage(data.message);
            setStep(3); // Success state
        } catch (err) {
            setError(err.response?.data?.message || 'Error resetting password. Invalid or expired OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="max-w-md w-full space-y-8 glass-panel p-10 rounded-2xl relative z-10">
                <div>
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/50 mb-6">
                        <KeyRound className="text-white" size={32} />
                    </div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                        {step === 3 ? 'Success!' : 'Reset Password'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {step === 1 && 'Enter your registered email to receive a recovery code'}
                        {step === 2 && 'Enter the 6-digit code and your new password'}
                        {step === 3 && 'Your password has been successfully updated'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
                        <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={18} />
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {step === 1 && (
                    <form className="mt-8 space-y-6" onSubmit={handleRequestOtp}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm bg-white/50"
                                    placeholder="your-email@astu.edu.et"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            >
                                {isLoading ? <RefreshCw className="animate-spin h-5 w-5" /> : 'Send Recovery Code'}
                            </button>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                        {receivedOtp && (
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                <p className="text-xs text-blue-800 font-semibold mb-1 uppercase tracking-wider">Debug Mode: Your OTP is</p>
                                <p className="text-2xl font-mono font-bold text-blue-900 tracking-[0.5em]">{receivedOtp}</p>
                                <p className="text-[10px] text-blue-600 mt-2">In production, this would be sent to your email.</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit Code</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-xl font-mono tracking-widest bg-white/50"
                                    placeholder="000000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/50"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/50"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            >
                                {isLoading ? <RefreshCw className="animate-spin h-5 w-5" /> : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <div className="mt-8 text-center space-y-6">
                        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="text-green-600" size={32} />
                        </div>
                        <p className="text-gray-600">{successMessage}</p>
                        <Link
                            to="/login"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                        >
                            Back to Login <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                )}

                {step !== 3 && (
                    <div className="text-center">
                        <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
