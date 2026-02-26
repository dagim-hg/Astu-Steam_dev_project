import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- Database User Audit ---');
        const users = await User.find({}, 'name email role systemId');
        if (users.length === 0) {
            console.log('No users found in database.');
        } else {
            users.forEach(u => {
                console.log(`[${u.role}] ${u.name} <${u.email}> ID: ${u.systemId}`);
            });
        }
        process.exit(0);
    } catch (error) {
        console.error('Audit Error:', error);
        process.exit(1);
    }
};

listUsers();
