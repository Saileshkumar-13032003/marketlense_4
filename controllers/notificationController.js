const Notification = require('../models/Notification');

// Helper to create a new notification (used by other controllers, like authController)
exports.createNotification = async (type, message, userId = null, data = {}) => {
    try {
        await Notification.create({
            type,
            message,
            userId,
            data,
        });
    } catch (error) {
        console.error("Failed to create notification:", error);
    }
};

// GET /api/admin/notifications - Fetch all unread/recent notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find()
            .sort({ createdAt: -1 }) // Newest first
            .limit(50) // Limit to a reasonable number
            .select('-data -__v'); // Exclude unnecessary fields

        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error retrieving notifications." });
    }
};

// PUT /api/admin/notifications/mark-read/:id - Mark a single notification as read
exports.markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ msg: "Notification marked as read." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Failed to mark notification as read." });
    }
};