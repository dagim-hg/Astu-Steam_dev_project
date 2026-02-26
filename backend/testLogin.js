import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const email = 'admin@astu.edu.et';
        const password = 'admin123';

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log('User not found');
            process.exit(0);
        }

        console.log('User found:', user.email);
        console.log('Stored Hash:', user.password);

        const isMatch = await user.matchPassword(password);
        console.log('Password Match:', isMatch);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

test();
