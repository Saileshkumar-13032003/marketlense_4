const User = require("../models/User");
const { saveLog } = require("./logController");
const { createNotification } = require("./notificationController"); // 🎯 CRITICAL: Import the notification creator

// GET ALL USERS (No log needed)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error retrieving users" });
    }
};

// BLOCK USER
exports.blockUser = async (req, res) => {
    const userIdToBlock = req.params.id;
    try {
        const user = await User.findByIdAndUpdate(userIdToBlock, { blocked: true }, { new: true });
        
        // 1. LOGGING (Activity Log)
        const logMessage = `User account blocked: ${user.email}`;
        await saveLog(
            req.user.id, 
            logMessage, 
            'admin', 
            userIdToBlock, 
            req
        );
        
        // 2. 🎯 NOTIFICATION
        await createNotification(
            'USER_BLOCKED', 
            `ADMIN ACTION: ${logMessage}`, 
            userIdToBlock 
        );
        
        res.json({ msg: "User blocked" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Failed to block user." });
    }
};

// UNBLOCK USER
exports.unblockUser = async (req, res) => {
    const userIdToUnblock = req.params.id;
    try {
        const user = await User.findByIdAndUpdate(userIdToUnblock, { blocked: false }, { new: true });

        // 1. LOGGING (Activity Log)
        const logMessage = `User account unblocked: ${user.email}`;
        await saveLog(
            req.user.id, 
            logMessage, 
            'admin', 
            userIdToUnblock, 
            req
        );

        // 2. 🎯 NOTIFICATION
        await createNotification(
            'USER_UNBLOCKED', 
            `ADMIN ACTION: ${logMessage}`, 
            userIdToUnblock 
        );
        
        res.json({ msg: "User unblocked" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Failed to unblock user." });
    }
};

// VERIFY USER
exports.verifyUser = async (req, res) => {
    const userIdToVerify = req.params.id;
    try {
        const user = await User.findByIdAndUpdate(userIdToVerify, { emailVerified: true }, { new: true });

        // 1. LOGGING (Activity Log)
        const logMessage = `User email verified manually: ${user.email}`;
        await saveLog(
            req.user.id, 
            logMessage, 
            'admin', 
            userIdToVerify, 
            req
        );

        // 2. 🎯 NOTIFICATION
        await createNotification(
            'USER_VERIFIED', 
            `ADMIN ACTION: ${logMessage}`, 
            userIdToVerify 
        );
        
        res.json({ msg: "User verified" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Failed to verify user." });
    }
};

// MAKE ADMIN
exports.makeAdmin = async (req, res) => {
    const userIdToPromote = req.params.id;
    try {
        const user = await User.findByIdAndUpdate(userIdToPromote, { isAdmin: true }, { new: true });

        // 1. LOGGING (Activity Log)
        const logMessage = `User promoted to ADMIN role: ${user.email}`;
        await saveLog(
            req.user.id, 
            logMessage, 
            'admin', 
            userIdToPromote, 
            req
        );
        
        // 2. 🎯 NOTIFICATION
        await createNotification(
            'USER_PROMOTED', 
            `ADMIN ACTION: ${logMessage}`, 
            userIdToPromote 
        );

        res.json({ msg: "User promoted to admin" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Failed to make admin." });
    }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
    const userIdToDelete = req.params.id;
    try {
        const user = await User.findById(userIdToDelete);
        
        await User.findByIdAndDelete(userIdToDelete);

        // 1. LOGGING (Activity Log)
        const logMessage = `User account permanently deleted: ${user ? user.email : userIdToDelete}`;
        await saveLog(
            req.user.id, 
            logMessage, 
            'admin', 
            userIdToDelete, 
            req
        );

        // 2. 🎯 NOTIFICATION
        await createNotification(
            'USER_DELETED', 
            `ADMIN ACTION: ${logMessage}`, 
            userIdToDelete 
        );

        res.json({ msg: "User deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Failed to delete user." });
    }
};


// // controllers/adminController.js

// const User = require("../models/User");
// const { saveLog } = require("./logController"); // 🎯 Import the logging function

// // GET ALL USERS (No log needed)
// exports.getUsers = async (req, res) => {
//     try {
//         const users = await User.find().select("-password");
//         res.json(users);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Server error retrieving users" });
//     }
// };

// // BLOCK USER
// exports.blockUser = async (req, res) => {
//     const userIdToBlock = req.params.id;
//     try {
//         const user = await User.findByIdAndUpdate(userIdToBlock, { blocked: true }, { new: true });
        
//         // 🎯 LOGGING: Admin action
//         await saveLog(
//             req.user.id, 
//             `User account blocked: ${user.email}`, 
//             'admin', 
//             userIdToBlock, 
//             req
//         );
        
//         res.json({ msg: "User blocked" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Failed to block user." });
//     }
// };

// // UNBLOCK USER
// exports.unblockUser = async (req, res) => {
//     const userIdToUnblock = req.params.id;
//     try {
//         const user = await User.findByIdAndUpdate(userIdToUnblock, { blocked: false }, { new: true });

//         // 🎯 LOGGING: Admin action
//         await saveLog(
//             req.user.id, 
//             `User account unblocked: ${user.email}`, 
//             'admin', 
//             userIdToUnblock, 
//             req
//         );

//         res.json({ msg: "User unblocked" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Failed to unblock user." });
//     }
// };

// // VERIFY USER
// exports.verifyUser = async (req, res) => {
//     const userIdToVerify = req.params.id;
//     try {
//         const user = await User.findByIdAndUpdate(userIdToVerify, { emailVerified: true }, { new: true });

//         // 🎯 LOGGING: Admin action
//         await saveLog(
//             req.user.id, 
//             `User email verified manually: ${user.email}`, 
//             'admin', 
//             userIdToVerify, 
//             req
//         );

//         res.json({ msg: "User verified" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Failed to verify user." });
//     }
// };

// // MAKE ADMIN
// exports.makeAdmin = async (req, res) => {
//     const userIdToPromote = req.params.id;
//     try {
//         const user = await User.findByIdAndUpdate(userIdToPromote, { isAdmin: true }, { new: true });

//         // 🎯 LOGGING: Admin action
//         await saveLog(
//             req.user.id, 
//             `User promoted to ADMIN role: ${user.email}`, 
//             'admin', 
//             userIdToPromote, 
//             req
//         );
        
//         res.json({ msg: "User promoted to admin" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Failed to make admin." });
//     }
// };

// // DELETE USER
// exports.deleteUser = async (req, res) => {
//     const userIdToDelete = req.params.id;
//     try {
//         const user = await User.findById(userIdToDelete);
        
//         await User.findByIdAndDelete(userIdToDelete);

//         // 🎯 LOGGING: Admin action (Use user data before deletion)
//         await saveLog(
//             req.user.id, 
//             `User account permanently deleted: ${user ? user.email : userIdToDelete}`, 
//             'admin', 
//             userIdToDelete, 
//             req
//         );

//         res.json({ msg: "User deleted" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Failed to delete user." });
//     }
// };


// const User = require("../models/User");
// // 🎯 IMPORT the saveLog function from your new logController
// const { saveLog } = require("./logController"); 


// // GET ALL USERS (No log needed for simple GET)
// exports.getUsers = async (req, res) => {
//     try {
//         const users = await User.find().select("-password");
//         res.json(users);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Server error retrieving users" });
//     }
// };

// // BLOCK USER
// exports.blockUser = async (req, res) => {
//     const userIdToBlock = req.params.id;
//     try {
//         const user = await User.findByIdAndUpdate(userIdToBlock, { blocked: true });
        
//         // 🎯 LOGGING: Log the action
//         await saveLog(
//             req.user.id, // The ID of the admin performing the action (from the token/middleware)
//             `User account blocked: ${user.email}`, // Descriptive message
//             userIdToBlock, // The ID of the user being targeted
//             req
//         );
        
//         res.json({ msg: "User blocked" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Failed to block user." });
//     }
// };

// // UNBLOCK USER
// exports.unblockUser = async (req, res) => {
//     const userIdToUnblock = req.params.id;
//     try {
//         const user = await User.findByIdAndUpdate(userIdToUnblock, { blocked: false });

//         // 🎯 LOGGING: Log the action
//         await saveLog(
//             req.user.id, 
//             `User account unblocked: ${user.email}`, 
//             userIdToUnblock, 
//             req
//         );

//         res.json({ msg: "User unblocked" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Failed to unblock user." });
//     }
// };

// // VERIFY USER
// exports.verifyUser = async (req, res) => {
//     const userIdToVerify = req.params.id;
//     try {
//         const user = await User.findByIdAndUpdate(userIdToVerify, { emailVerified: true });

//         // 🎯 LOGGING: Log the action
//         await saveLog(
//             req.user.id, 
//             `User email verified manually: ${user.email}`, 
//             userIdToVerify, 
//             req
//         );

//         res.json({ msg: "User verified" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Failed to verify user." });
//     }
// };

// // MAKE ADMIN
// exports.makeAdmin = async (req, res) => {
//     const userIdToPromote = req.params.id;
//     try {
//         const user = await User.findByIdAndUpdate(userIdToPromote, { isAdmin: true });

//         // 🎯 LOGGING: Log the action
//         await saveLog(
//             req.user.id, 
//             `User promoted to ADMIN role: ${user.email}`, 
//             userIdToPromote, 
//             req
//         );
        
//         res.json({ msg: "User promoted to admin" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Failed to make admin." });
//     }
// };

// // DELETE USER
// exports.deleteUser = async (req, res) => {
//     const userIdToDelete = req.params.id;
//     try {
//         // Find the user first to get their email for the log message
//         const user = await User.findById(userIdToDelete);
        
//         // Delete the user
//         await User.findByIdAndDelete(userIdToDelete);

//         // 🎯 LOGGING: Log the action (use the user details before deletion)
//         await saveLog(
//             req.user.id, 
//             `User account permanently deleted: ${user ? user.email : userIdToDelete}`, 
//             userIdToDelete, 
//             req
//         );

//         res.json({ msg: "User deleted" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Failed to delete user." });
//     }
// };



// const User = require("../models/User");

// // GET ALL USERS
// exports.getUsers = async (req, res) => {
//   const users = await User.find().select("-password");
//   res.json(users);
// };

// // BLOCK USER
// exports.blockUser = async (req, res) => {
//   await User.findByIdAndUpdate(req.params.id, { blocked: true });
//   res.json({ msg: "User blocked" });
// };

// // UNBLOCK USER
// exports.unblockUser = async (req, res) => {
//   await User.findByIdAndUpdate(req.params.id, { blocked: false });
//   res.json({ msg: "User unblocked" });
// };

// // VERIFY USER
// exports.verifyUser = async (req, res) => {
//   await User.findByIdAndUpdate(req.params.id, {
//     emailVerified: true,
//   });
//   res.json({ msg: "User verified" });
// };

// // MAKE ADMIN
// exports.makeAdmin = async (req, res) => {
//   await User.findByIdAndUpdate(req.params.id, { isAdmin: true });
//   res.json({ msg: "User promoted to admin" });
// };

// // DELETE USER
// exports.deleteUser = async (req, res) => {
//   await User.findByIdAndDelete(req.params.id);
//   res.json({ msg: "User deleted" });
// };
