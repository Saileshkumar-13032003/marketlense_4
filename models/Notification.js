const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    // Type of notification (e.g., 'NEW_USER', 'FAILED_LOGIN', 'REPORT')
    type: {
        type: String,
        required: true,
    },
    // The main message shown to the admin
    message: {
        type: String,
        required: true,
    },
    // Reference to the user the notification is about (optional)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    // Whether the admin has seen the notification
    isRead: {
        type: Boolean,
        default: false,
    },
    // Custom data field for future flexibility
    data: {
        type: mongoose.Schema.Types.Mixed, 
        default: {}
    }
}, {
    timestamps: true // Gives us createdAt and updatedAt
});

module.exports = mongoose.model('Notification', NotificationSchema);