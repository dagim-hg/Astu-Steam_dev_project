import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus,
    getAssignedComplaints,
    getComplaintByTrackingId
} from '../controllers/complaintController.js';
import { protect, staff } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images and Documents only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.route('/')
    .post(protect, upload.array('attachments', 3), createComplaint)
    .get(protect, getComplaints);

// Staff specific routes
router.get('/staff/assigned', protect, staff, getAssignedComplaints);
router.get('/tracking/:id', protect, staff, getComplaintByTrackingId);

router.route('/:id')
    .get(protect, getComplaintById)
    .put(protect, staff, upload.single('resolutionImage'), updateComplaintStatus);

export default router;
