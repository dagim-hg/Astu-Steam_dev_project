import AuditLog from '../models/AuditLog.js';

// Helper to log actions
export const logAction = async ({
    user,
    action,
    message,
    resourceId,
    req,
    metadata
}) => {
    try {
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'];

        await AuditLog.create({
            user: user?._id || user,
            action,
            message,
            resourceId,
            ipAddress,
            userAgent,
            metadata
        });
    } catch (error) {
        console.error('Audit Logging Error:', error);
        // We don't want to crash the request if auditing fails, 
        // but in a production system we might want stricter guarantees.
    }
};

// Middleware to log system access (optional, can be noisy)
export const auditMiddleware = (action, message) => {
    return async (req, res, next) => {
        // We can log specific route access if needed
        next();
    };
};
