import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Can be null for unauthenticated actions like failed login
    },
    action: {
        type: String,
        required: true,
        enum: [
            'LOGIN_SUCCESS',
            'LOGIN_FAILURE',
            'LOGOUT',
            'REGISTER_USER',
            'SUBMIT_COMPLAINT',
            'UPDATE_COMPLAINT_STATUS',
            'DELETE_USER',
            'UPDATE_USER_ROLE',
            'CREATE_DEPARTMENT',
            'DELETE_DEPARTMENT',
            'CREATE_CATEGORY',
            'DELETE_CATEGORY',
            'SYSTEM_ACCESS'
        ]
    },
    message: {
        type: String,
        required: true
    },
    resourceId: {
        type: String,
        required: false
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: false
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    }
}, {
    timestamps: true
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
