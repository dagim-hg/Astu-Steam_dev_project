import User from '../models/User.js';
import { generateSystemId } from './idGenerator.js';

/**
 * Seeds a default admin user if none exists in the system.
 */
const seedAdmin = async () => {
    try {
        let admin = await User.findOne({ role: 'Admin' });

        const adminName = process.env.ADMIN_NAME || 'System Admin';
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@astu.edu.et').toLowerCase().trim();
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        if (admin) {
            console.log('✅ Admin already exists. Synchronizing details...');
            admin.name = adminName;
            admin.email = adminEmail;
            admin.password = adminPassword; // Pre-save hook will re-hash if modified
            if (!admin.systemId) {
                admin.systemId = await generateSystemId('Admin');
            }
            await admin.save();
            console.log('🚀 Admin synchronized successfully!');
            return;
        }

        if (!adminEmail || !adminPassword) {
            console.warn('⚠️ Missing admin credentials in environment variables. Admin seeding skipped.');
            return;
        }

        console.log(`📡 Seeding default admin with email: ${adminEmail}`);

        const systemId = await generateSystemId('Admin');

        await User.create({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: 'Admin',
            systemId
        });

        console.log('🚀 Default admin created successfully!');
    } catch (error) {
        console.error(`❌ Error seeding admin: ${error.message}`);
    }
};

export default seedAdmin;