// models/ActivityLog.js

const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
    // 🎯 CRITICAL CHANGE: Type is now String to allow both ObjectId strings and 'ADMIN'
    actorId: {
        type: String, 
        required: true,
        // We remove 'ref: "User"' here because manual population is now required
    },
    // Brief, readable summary of the action
    message: {
        type: String,
        required: true,
    },
    // Target is still an ObjectId since it always points to a database User
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        default: null,
    },
    // IP address of the requester (for auditing)
    ip: {
        type: String,
    },
}, {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true 
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);


// // models/ActivityLog.js

// const mongoose = require('mongoose');

// const ActivityLogSchema = new mongoose.Schema({
//     // The admin who performed the action (linking to the User model)
//     adminId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     // Brief, readable summary of the action (e.g., "User blocked: john@test.com")
//     message: {
//         type: String,
//         required: true,
//     },
//     // The user or resource affected by the action (optional)
//     targetId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User', 
//         default: null,
//     },
//     // IP address of the requester (for auditing)
//     ip: {
//         type: String,
//     },
// }, {
//     timestamps: true 
// });

// module.exports = mongoose.model('ActivityLog', ActivityLogSchema);