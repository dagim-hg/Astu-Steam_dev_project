import express from 'express';
import {
    authUser,
    registerUser,
    getUserProfile,
    forgotPassword,
    resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getUserProfile);

export default router;
