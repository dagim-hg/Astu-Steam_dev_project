import express from 'express';
import {
    authUser,
    registerUser,
    getUserProfile,
    forgotPassword,
    resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();

router.post('/login', authLimiter, authUser);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.get('/profile', protect, getUserProfile);

export default router;
