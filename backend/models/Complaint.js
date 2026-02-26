import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        complaintId: {
            type: String,
            unique: true,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Urgent'],
            default: 'Medium',
        },
        category: {
            type: String,
            enum: ['Academic', 'Facilities', 'IT', 'Administrative', 'Other'],
            required: true,
        },
        status: {
            type: String,
            enum: ['Open', 'In Progress', 'Resolved'],
            default: 'Open',
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        assignedDepartment: {
            type: String,
            default: 'General',
        },
        attachments: [
            {
                url: { type: String },
                filename: { type: String },
            }
        ],
        remarks: [
            {
                staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                staffName: { type: String },
                comment: { type: String },
                date: { type: Date, default: Date.now }
            }
        ],
        resolutionImage: {
            url: { type: String },
            filename: { type: String },
        }
    },
    {
        timestamps: true,
    }
);

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
