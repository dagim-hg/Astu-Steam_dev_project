import Complaint from '../models/Complaint.js';

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res) => {
    const { title, description, category } = req.body;

    if (req.user.role !== 'Student') {
        return res.status(403).json({ message: 'Only students can submit complaints' });
    }

    const attachments = req.files ? req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        filename: file.originalname
    })) : [];

    const complaint = new Complaint({
        title,
        description,
        category,
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

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private (Staff/Admin)
const updateComplaintStatus = async (req, res) => {
    const { status, remark } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
        complaint.status = status || complaint.status;

        if (remark) {
            complaint.remarks.push({
                staffId: req.user._id,
                staffName: req.user.name,
                comment: remark
            });
        }

        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } else {
        res.status(404).json({ message: 'Complaint not found' });
    }
};

export { createComplaint, getComplaints, getComplaintById, updateComplaintStatus };
