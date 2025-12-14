// controllers/logController.js

const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");
const mongoose = require("mongoose"); // 🎯 CRITICAL: Must be imported for validation

// --- Log Helper Function (Unchanged, relies on the flexibility of the new model) ---
exports.saveLog = async (userId, message, role, targetId = null, req) => {
  try {
    const prefixedMessage = `[${role.toUpperCase()}] ${message}`;

    await ActivityLog.create({
      // userId will be saved as a string, either the ObjectId or 'ADMIN'
      actorId: userId,
      message: prefixedMessage,
      targetId,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    });
  } catch (error) {
    console.error("CRITICAL: Failed to save activity log:", error);
  }
};

// --- Controller to Fetch Logs (CRITICAL REPLACEMENT for Manual Population) ---
exports.getLogs = async (req, res) => {
  try {
    // 1. Fetch all raw logs without trying to populate
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);

    // 2. Collect all unique valid Mongoose ObjectIds for bulk fetching
    let idsToPopulate = new Set();

    logs.forEach((log) => {
      // Check actorId: exclude 'ADMIN' and ensure it's a valid ObjectId string
      if (
        log.actorId &&
        log.actorId !== "ADMIN" &&
        mongoose.Types.ObjectId.isValid(log.actorId)
      ) {
        idsToPopulate.add(log.actorId);
      }
      // Check targetId: ensure it's a valid ObjectId
      if (log.targetId && mongoose.Types.ObjectId.isValid(log.targetId)) {
        idsToPopulate.add(log.targetId.toString());
      }
    });

    // 3. Manually fetch user data for all valid IDs in one efficient query
    const populatedUsers = await User.find({
      _id: { $in: Array.from(idsToPopulate) },
    }).select("email");

    // Convert array to a fast lookup map { userId: userObject }
    const userMap = populatedUsers.reduce((map, user) => {
      map[user._id.toString()] = user;
      return map;
    }, {});

    // 4. Manually build the final logs array with the populated emails
    const finalLogs = logs.map((log) => {
      let actorEmail = "Static Admin";
      let targetEmail = null;

      // Handle actor ID (uses the map for regular users, hardcodes for 'ADMIN')
      if (log.actorId && log.actorId !== "ADMIN") {
        const actor = userMap[log.actorId];
        actorEmail = actor ? actor.email : "Unknown User (Deleted)";
      }

      // Handle target ID (uses the map)
      if (log.targetId) {
        const target = userMap[log.targetId.toString()];
        targetEmail = target ? target.email : "Unknown Target (Deleted)";
      }

      // Return the structure the frontend expects (mimicking the .populate() response)
      return {
        ...log._doc,
        // We create a mock object with the email field
        actorId: { email: actorEmail },
        targetId: targetEmail ? { email: targetEmail } : null,
      };
    });

    res.json(finalLogs);
  } catch (err) {
    console.error(
      "CRITICAL: Error retrieving and manually populating logs:",
      err
    );
    // This 500 status code is what was likely being returned silently before
    res.status(500).json({ msg: "Internal server error while fetching logs." });
  }
};

// // controllers/logController.js

// const ActivityLog = require('../models/ActivityLog');
// // Assuming User model is at '../models/User'
// const User = require('../models/User');

// // --- Log Helper Function ---
// // This function is called by other controllers (like adminController.js)
// exports.saveLog = async (adminId, message, targetId = null, req) => {
//     try {
//         await ActivityLog.create({
//             adminId,
//             message,
//             targetId,
//             // Gets client IP from standard Express headers
//             ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
//         });
//     } catch (error) {
//         console.error("CRITICAL: Failed to save activity log:", error);
//     }
// };

// // --- Controller to Fetch Logs ---
// // This is the function linked to the GET /api/admin/logs route
// exports.getLogs = async (req, res) => {
//     try {
//         const logs = await ActivityLog.find()
//             .sort({ createdAt: -1 })
//             .limit(100)
//             // Populate who did the action and who was targeted
//             .populate('adminId', 'email')
//             .populate('targetId', 'email')
//             .select('-__v');

//         res.json(logs);
//     } catch (err) {
//         console.error("Error retrieving logs:", err);
//         res.status(500).json({ msg: "Internal server error while fetching activity logs." });
//     }
// };
