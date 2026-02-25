import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { generateUserId } from '../utils/idGenerator.js';

// @desc    Admin create a new user
// @route   POST /api/admin/create-user
// @access  Private/Admin
const createUser = async (req, res) => {
    const { name, email, password, role, department, studentIdNum, dormBlock } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const systemId = await generateUserId();

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'Student',
        systemId,
        department: (role === 'Staff' || role === 'Student') ? department : undefined,
        studentIdNum: role === 'Student' ? studentIdNum : undefined,
        dormBlock: role === 'Student' ? dormBlock : undefined,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent self-deletion
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete your own admin account' });
        }

        // Prevent deleting the master admin (admin@astu.edu.et)
        if (user.email === 'admin@astu.edu.et') {
            return res.status(403).json({ message: 'Cannot delete the master System Admin' });
        }

        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

export { createUser, getUsers, deleteUser };
