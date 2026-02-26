import Notification from '../models/Notification.js';

// @desc   Get all notifications for the logged-in user
// @route  GET /api/notifications
// @access Private
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(30);
        const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });
        res.json({ notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

// @desc   Mark a single notification as read
// @route  PUT /api/notifications/:id/read
// @access Private
const markAsRead = async (req, res) => {
    try {
        const notif = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { isRead: true },
            { new: true }
        );
        if (!notif) return res.status(404).json({ message: 'Notification not found' });
        res.json(notif);
    } catch (error) {
        res.status(500).json({ message: 'Error marking notification', error: error.message });
    }
};

// @desc   Mark all notifications as read
// @route  PUT /api/notifications/read-all
// @access Private
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notifications', error: error.message });
    }
};

export { getNotifications, markAsRead, markAllAsRead };
