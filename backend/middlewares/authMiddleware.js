import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            console.log('Decoded JWT:', decoded);

            req.user = await User.findById(decoded.id).select('-password');
            console.log('Found User:', req.user ? req.user._id : 'null');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            return next();
        } catch (error) {
            console.error('JWT Verify Error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const staff = (req, res, next) => {
    if (req.user && (req.user.role === 'Staff' || req.user.role === 'Admin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as staff' });
    }
};

export { protect, admin, staff };
