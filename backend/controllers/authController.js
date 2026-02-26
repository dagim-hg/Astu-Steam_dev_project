import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import mongoose from 'mongoose';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                message: 'Database Connection Error. Please check your internet or MongoDB Atlas whitelist.',
                error: 'ECONNREFUSED or DB Down'
            });
        }

        const { identifier, password, role } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ message: 'Please provide credentials' });
        }

        let user;

        // Students MUST log in with their systemId (ugr/xxxx/xx)
        if (role === 'Student') {
            user = await User.findOne({ systemId: identifier, role: 'Student' });
        } else {
            // Staff/Admin can log in with email OR systemId
            const normalizedId = identifier.toLowerCase().trim();
            user = await User.findOne({
                $or: [
                    { email: normalizedId },
                    { systemId: { $regex: new RegExp(`^${identifier}$`, 'i') } }
                ]
            });
        }

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                systemId: user.systemId,
                role: user.role,
                department: user.department,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error during login',
            error: error.message,
        });
    }
};

// @desc    Forgot password - generate OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Please provide your registered email address.' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            // Don't reveal if email exists for security
            return res.status(200).json({ message: 'If that email is registered, you will receive an OTP.' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpiry = expiry;
        await user.save();

        // In dev mode, return OTP directly. In production, send via email.
        res.json({
            message: 'OTP generated successfully.',
            otp, // Remove this line when email sending is configured
            expiresIn: '15 minutes'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating OTP', error: error.message });
    }
};

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP and new password are required.' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user || !user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
            return res.status(400).json({ message: 'Invalid or expired OTP. Please request a new one.' });
        }

        // Check OTP expiry
        if (new Date() > user.resetPasswordOTPExpiry) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpiry = undefined;
            await user.save();
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        // Validate OTP
        if (user.resetPasswordOTP !== otp) {
            return res.status(400).json({ message: 'Incorrect OTP. Please check and try again.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        // Update password and clear OTP
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpiry = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, department } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        role: role || 'Student',
        department: role === 'Staff' ? department : undefined,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            systemId: user.systemId,
            role: user.role,
            department: user.department,
            studentIdNum: user.studentIdNum,
            dormBlock: user.dormBlock,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export { authUser, registerUser, getUserProfile, forgotPassword, resetPassword };
