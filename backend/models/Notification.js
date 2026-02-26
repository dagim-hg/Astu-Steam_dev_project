import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            enum: ['info', 'success', 'warning'],
            default: 'info',
        },
        link: {
            type: String, // e.g., /staff/update?ticket=CMP-123
        },
        relatedId: {
            type: String, // Stores the complaint tracking ID or object ID
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
