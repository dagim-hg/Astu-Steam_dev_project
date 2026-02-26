import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        systemId: {
            type: String,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['Student', 'Staff', 'Admin'],
            default: 'Student',
        },
        department: {
            type: String, // Department for Staff or Student
        },
        studentIdNum: {
            type: String, // Specific for Students (e.g., ATR/1234/12)
        },
        dormBlock: {
            type: String, // Specific for Students
        },
        resetPasswordOTP: {
            type: String,
        },
        resetPasswordOTPExpiry: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
