/**
 * Utility to generate professional system IDs.
 */
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

/**
 * Generates a User ID in format USR-XXXXX (e.g., USR-00001)
 */
export const generateUserId = async () => {
    try {
        const lastUser = await User.findOne({ systemId: { $regex: /^USR-/ } })
            .sort({ createdAt: -1 });

        let nextId = 1;
        if (lastUser && lastUser.systemId) {
            const currentId = parseInt(lastUser.systemId.split('-')[1]);
            nextId = currentId + 1;
        }

        return `USR-${nextId.toString().padStart(5, '0')}`;
    } catch (error) {
        console.error('Error generating User ID:', error);
        throw error;
    }
};

/**
 * Generates a Complaint ID in format CMP-YYYY-XXXXX (e.g., CMP-2026-00001)
 */
export const generateComplaintId = async () => {
    try {
        const year = new Date().getFullYear().toString();
        const lastComplaint = await Complaint.findOne({ complaintId: { $regex: new RegExp(`^CMP-${year}-`) } })
            .sort({ createdAt: -1 });

        let nextId = 1;
        if (lastComplaint && lastComplaint.complaintId) {
            const currentId = parseInt(lastComplaint.complaintId.split('-')[2]);
            nextId = currentId + 1;
        }

        return `CMP-${year}-${nextId.toString().padStart(5, '0')}`;
    } catch (error) {
        console.error('Error generating Complaint ID:', error);
        throw error;
    }
};
