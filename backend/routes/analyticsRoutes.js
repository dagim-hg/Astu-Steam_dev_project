import express from 'express';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private (Admin)
router.get('/', protect, admin, async (req, res) => {
    try {
        const totalComplaints = await Complaint.countDocuments();
        const openComplaints = await Complaint.countDocuments({ status: 'Open' });
        const inProgressComplaints = await Complaint.countDocuments({ status: 'In Progress' });
        const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });

        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'Student' });
        const totalStaff = await User.countDocuments({ role: 'Staff' });

        // Aggregate by category
        const complaintsByCategory = await Complaint.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.json({
            metrics: {
                totalComplaints,
                openComplaints,
                inProgressComplaints,
                resolvedComplaints,
                totalUsers,
                totalStudents,
                totalStaff
            },
            complaintsByCategory
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
