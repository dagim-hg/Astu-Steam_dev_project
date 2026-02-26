/**
 * Utility to generate professional system IDs.
 */
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

/**
 * Generates a User System ID based on role
 * Admin: ADM-XXXXX
 * Staff: STF-XXXXX
 * Student: ugr/XXXX/YY  (YY is current 2 digit year)
 */
export const generateSystemId = async (role) => {
    try {
        let prefix = '';
        let queryRegex = null;

        if (role === 'Admin') {
            prefix = 'ADM-';
            queryRegex = /^ADM-/;
        } else if (role === 'Staff') {
            prefix = 'STF-';
            queryRegex = /^STF-/;
        } else if (role === 'Student') {
            prefix = 'ugr/';
            queryRegex = /^ugr\//;
        } else {
            prefix = 'USR-';
            queryRegex = /^USR-/;
        }

        const lastUser = await User.findOne({ systemId: { $regex: queryRegex } })
            .sort({ createdAt: -1 });

        let nextId = 1;
        if (lastUser && lastUser.systemId) {
            if (role === 'Student') {
                // Parse ugr/0001/26
                const parts = lastUser.systemId.split('/');
                if (parts.length === 3) {
                    const currentId = parseInt(parts[1]);
                    nextId = currentId + 1;
                }
            } else {
                // Parse ADM-00001 or STF-00001
                const parts = lastUser.systemId.split('-');
                if (parts.length === 2) {
                    const currentId = parseInt(parts[1]);
                    nextId = currentId + 1;
                }
            }
        }

        if (role === 'Student') {
            const currentYearStr = new Date().getFullYear().toString().slice(-2);
            return `ugr/${nextId.toString().padStart(4, '0')}/${currentYearStr}`;
        } else {
            return `${prefix}${nextId.toString().padStart(5, '0')}`;
        }
    } catch (error) {
        console.error('Error generating System ID:', error);
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
