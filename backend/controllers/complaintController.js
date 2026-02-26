import mongoose from 'mongoose';
import Complaint from '../models/Complaint.js';
import { generateComplaintId } from '../utils/idGenerator.js';

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res) => {
    const { title, description, category, location, priority, assignedDepartment } = req.body;

    if (req.user.role !== 'Student') {
        return res.status(403).json({ message: 'Only students can submit complaints' });
    }

    const attachments = req.files ? req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        filename: file.originalname
    })) : [];

    const complaintId = await generateComplaintId();

    const complaint = new Complaint({
        title,
        description,
        category,
        complaintId,
        location,
        priority: priority || 'Medium',
        assignedDepartment: assignedDepartment || 'General',
        studentId: req.user._id,
        attachments
    });

    const createdComplaint = await complaint.save();
    res.status(201).json(createdComplaint);
};

// @desc    Get all complaints (filtered by role)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
    let query = {};

    if (req.user.role === 'Student') {
        query.studentId = req.user._id;
    } else if (req.user.role === 'Staff') {
        // Optionally filter by department if Staff
        // query.category = req.user.department; // Simplified matching for now
    }
    // Admin sees all

    const complaints = await Complaint.find(query).populate('studentId', 'name email').sort({ createdAt: -1 });
    res.json(complaints);
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
    const complaint = await Complaint.findById(req.params.id).populate('studentId', 'name email');

    if (complaint) {
        // Authorization check
        if (req.user.role === 'Student' && complaint.studentId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this complaint' });
        }
        res.json(complaint);
    } else {
        res.status(404).json({ message: 'Complaint not found' });
    }
};

// @desc    Get assigned complaints for staff
// @route   GET /api/complaints/staff/assigned
// @access  Private (Staff/Admin)
const getAssignedComplaints = async (req, res) => {
    try {
        if (req.user.role !== 'Staff' && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        let query = {};

        // If Staff, filter by department (case-insensitive)
        if (req.user.role === 'Staff') {
            query.assignedDepartment = { $regex: new RegExp(`^${req.user.department}$`, 'i') };
        }
        // If Admin, query remains {} to fetch all

        const complaints = await Complaint.find(query)
            .populate('studentId', 'name email studentIdNum dormBlock')
            .sort({ createdAt: -1 });

        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assigned complaints', error: error.message });
    }
};

// @desc    Get complaint by Tracking ID or MongoDB ID
// @route   GET /api/complaints/tracking/:id
// @access  Private (Staff/Admin)
const getComplaintByTrackingId = async (req, res) => {
    try {
        const { id } = req.params;

        // Find by MongoDB _id OR complaintId (tracking ID)
        const complaint = await Complaint.findOne({
            $or: [
                { _id: mongoose.isValidObjectId(id) ? id : null },
                { complaintId: id }
            ].filter(cond => cond._id !== null || cond.complaintId !== undefined)
        }).populate('studentId', 'name email studentIdNum dormBlock');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Authorization check for Staff
        if (req.user.role === 'Staff' &&
            complaint.assignedDepartment.toLowerCase() !== req.user.department.toLowerCase()) {
            return res.status(403).json({ message: 'Not authorized to view complaints outside your department' });
        }

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Error searching for complaint', error: error.message });
    }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private (Staff/Admin)
const updateComplaintStatus = async (req, res) => {
    const { status, remark } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
        // Authorization check for Staff
        if (req.user.role === 'Staff' && 
            complaint.assignedDepartment.toLowerCase() !== req.user.department.toLowerCase()) {
            return res.status(403).json({ message: 'Not authorized to update complaints outside your department' });
        }

        complaint.status = status || complaint.status;

        if (remark) {
            complaint.remarks.push({
                staffId: req.user._id,
                staffName: req.user.name,
                comment: remark
            });
        }

        if (req.file) {
            complaint.resolutionImage = {
                url: `/uploads/${req.file.filename}`,
                filename: req.file.originalname
            };
        }

        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } else {
        res.status(404).json({ message: 'Complaint not found' });
    }
};

export { createComplaint, getComplaints, getComplaintById, updateComplaintStatus, getAssignedComplaints, getComplaintByTrackingId };
