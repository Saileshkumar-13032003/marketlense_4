// controllers/adminProfileController.js

const User = require("../models/User");
const adminConfig = require("../config/admin"); // Assuming this holds static admin data
const { saveLog } = require("./logController");
const { createNotification } = require("./notificationController");

// --- Helper to get name/email based on ID ---
const getAdminData = async (userId) => {
  // 🎯 FIX HERE: Check for the exact ID from the token payload
  if (userId === "STATIC_ADMIN" || userId === "ADMIN") {
    const staticAdminId = userId; // Use the one that came from the token

    // Handle Static Admin case
    return {
      name: "Static Administrator", // You might pull this from an ENV or config file
      email: adminConfig.email,
      id: staticAdminId, // Return the exact string ID
    };
  } else {
    // Handle Database Admin case
    // Mongoose will correctly attempt to cast the ObjectId here.
    const user = await User.findById(userId).select("email name");
    if (user) {
      return {
        name: user.name || user.email, // Use name if available, otherwise email
        email: user.email,
        id: user._id,
      };
    }
  }
  return null;
};

// GET /api/admin/profile
exports.getAdminProfile = async (req, res) => {
  try {
    // This line now safely handles both "STATIC_ADMIN" and ObjectIds
    const profile = await getAdminData(req.user.id);

    if (!profile) {
      return res.status(404).json({ msg: "Admin profile not found." });
    }

    res.json(profile);
  } catch (err) {
    console.error("Error fetching admin profile:", err);
    // Add specific handling for CastError if it somehow reaches here
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "Invalid user ID provided." });
    }
    res.status(500).json({ msg: "Server error fetching profile." });
  }
};

// PUT /api/admin/profile
exports.updateAdminProfile = async (req, res) => {
  const { name, email } = req.body;
  const adminId = req.user.id;

  if (!name) {
    return res.status(400).json({ msg: "Name field is required." });
  }

  try {
    // 🎯 FIX HERE: Check for the exact ID from the token payload
    if (adminId === "STATIC_ADMIN" || adminId === "ADMIN") {
      // For static admin, we only log the attempt
      const logMessage = `Static Admin attempted to update profile name to: ${name}`;
      await saveLog(adminId, logMessage, "admin", null, req);
      await createNotification("STATIC_PROFILE_UPDATE", logMessage, null);

      return res.json({
        msg: "Profile updated successfully. Static Admin changes are not persistent in the DB.",
      });
    } else {
      // For Database-based admin
      const user = await User.findByIdAndUpdate(
        adminId,
        { name }, // Only update the name
        { new: true, runValidators: true }
      ).select("email name");

      if (!user) {
        return res
          .status(404)
          .json({ msg: "Admin user not found in database." });
      }

      // Log the action and send notification
      const logMessage = `Database Admin updated their profile name to: ${name}`;
      await saveLog(adminId, logMessage, "admin", adminId, req);
      await createNotification("ADMIN_PROFILE_UPDATE", logMessage, adminId);

      res.json({ msg: "Profile updated successfully." });
    }
  } catch (err) {
    console.error("Error updating admin profile:", err);
    // Add specific handling for CastError if it somehow reaches here
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "Invalid user ID for update." });
    }
    res.status(500).json({ msg: "Failed to update profile." });
  }
};

// // controllers/adminProfileController.js

// const User = require("../models/User");
// const adminConfig = require("../config/admin"); // Assuming this holds static admin data
// const { saveLog } = require("./logController");
// const { createNotification } = require("./notificationController");

// // --- Helper to get name/email based on ID ---
// const getAdminData = async (userId) => {
//     if (userId === 'ADMIN') {
//         // Handle Static Admin case
//         return {
//             name: "Static Administrator", // You might pull this from an ENV or config file
//             email: adminConfig.email,
//             id: 'ADMIN'
//         };
//     } else {
//         // Handle Database Admin case
//         const user = await User.findById(userId).select('email name');
//         if (user) {
//             return {
//                 name: user.name || user.email, // Use name if available, otherwise email
//                 email: user.email,
//                 id: user._id
//             };
//         }
//     }
//     return null;
// }

// // GET /api/admin/profile
// exports.getAdminProfile = async (req, res) => {
//     try {
//         const profile = await getAdminData(req.user.id);

//         if (!profile) {
//             return res.status(404).json({ msg: "Admin profile not found." });
//         }

//         res.json(profile);
//     } catch (err) {
//         console.error("Error fetching admin profile:", err);
//         res.status(500).json({ msg: "Server error fetching profile." });
//     }
// };

// // PUT /api/admin/profile
// exports.updateAdminProfile = async (req, res) => {
//     const { name, email } = req.body;
//     const adminId = req.user.id;

//     // We assume only the Name is managed via this form for simplicity, as Email change requires security steps.
//     if (!name) {
//         return res.status(400).json({ msg: "Name field is required." });
//     }

//     try {
//         if (adminId === 'ADMIN') {
//             // For static admin, we only log the attempt, as we cannot update the config easily
//             const logMessage = `Static Admin attempted to update profile name to: ${name}`;
//             await saveLog(adminId, logMessage, 'admin', null, req);
//             await createNotification('STATIC_PROFILE_UPDATE', logMessage, null);

//             // Return success even though nothing permanent changed (prevents user confusion)
//             return res.json({ msg: "Profile updated successfully. Static Admin changes are not persistent in the DB." });
//         } else {
//             // For Database-based admin
//             const user = await User.findByIdAndUpdate(
//                 adminId,
//                 { name }, // Only update the name
//                 { new: true, runValidators: true }
//             ).select('email name');

//             if (!user) {
//                 return res.status(404).json({ msg: "Admin user not found in database." });
//             }

//             // Log the action
//             const logMessage = `Database Admin updated their profile name to: ${name}`;
//             await saveLog(adminId, logMessage, 'admin', adminId, req);

//             // Send a notification
//             await createNotification('ADMIN_PROFILE_UPDATE', logMessage, adminId);

//             res.json({ msg: "Profile updated successfully." });
//         }

//     } catch (err) {
//         console.error("Error updating admin profile:", err);
//         res.status(500).json({ msg: "Failed to update profile." });
//     }
// };
