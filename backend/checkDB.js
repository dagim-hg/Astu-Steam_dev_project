import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const admin = await User.findOne({ role: 'Admin' });
        if (admin) {
            console.log('Admin found:');
            console.log(`Email: ${admin.email}`);
            console.log(`SystemID: ${admin.systemId}`);
            // Do NOT log the password hash
        } else {
            console.log('No Admin found in DB');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAdmin();
