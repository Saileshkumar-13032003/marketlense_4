// backend/middleware/adminMiddleware.js

const User = require("../models/User");
const mongoose = require("mongoose");
// You can use mongoose.Types.ObjectId.isValid for robust checks

module.exports = async (req, res, next) => {
  // We confirmed here that req.user is the decoded token payload,
  // which contains the ID in the 'id' field.
  if (!req.user || !req.user.id) {
    return res.status(401).json({ msg: "Not authenticated/ID missing." });
  }

  const userId = req.user.id; // 1. 🎯 CRITICAL BYPASS: Check for the non-Mongoose ID string first. // 🔑 FIX APPLIED: Checking for both "ADMIN" (signed in token) and "STATIC_ADMIN" (used in comments)

  if (userId === "STATIC_ADMIN" || userId === "ADMIN") {
    return next(); // Access granted for Static Admin, bypasses DB check
  } // Optional but recommended: Check for valid ObjectId before query

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(403) // 403 because it failed the required role check (admin privilege check)
      .json({ msg: "Invalid user ID format for DB lookup." });
  } // 2. DB-based admin check

  try {
    // This is safe now because we've checked for static IDs and malformed strings
    const user = await User.findById(userId); // Check if user exists and has admin privileges (assuming user.isAdmin)

    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: "Admin only" }); // <--- Returns the 403 Forbidden error
    } // Update req.user with the full user object from the database (standard practice)

    req.user = user;

    next();
  } catch (err) {
    console.error("Error in admin middleware during DB lookup:", err);
    res.status(500).json({ msg: "Server error during admin check." });
  }
};

// // backend/middleware/adminMiddleware.js

// const User = require("../models/User");
// const mongoose = require("mongoose");
// // You can use mongoose.Types.ObjectId.isValid for robust checks

// module.exports = async (req, res, next) => {
//   // We confirmed here that req.user is the decoded token payload,
//   // which contains the ID in the 'id' field.
//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ msg: "Not authenticated/ID missing." });
//   }

//   const userId = req.user.id; // This will be "STATIC_ADMIN" for the super-admin

//   // 1. 🎯 CRITICAL BYPASS: Check for the non-Mongoose ID string first.
//   if (userId === "STATIC_ADMIN") {
//     return next();
//   }

//   // Optional but recommended: Check for valid ObjectId before query
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res
//       .status(403)
//       .json({ msg: "Invalid user ID format for DB lookup." });
//   }

//   // 2. DB-based admin check
//   try {
//     // This is safe now because we've checked for "STATIC_ADMIN" and malformed strings
//     const user = await User.findById(userId);

//     // Check if user exists and has admin privileges (assuming user.isAdmin)
//     if (!user || !user.isAdmin) {
//       return res.status(403).json({ msg: "Admin only" });
//     }

//     // Update req.user with the full user object from the database (standard practice)
//     req.user = user;

//     next();
//   } catch (err) {
//     console.error("Error in admin middleware during DB lookup:", err);
//     res.status(500).json({ msg: "Server error during admin check." });
//   }
// };

// const User = require("../models/User");

// module.exports = async (req, res, next) => {
//   try {
//     // STATIC ADMIN ACCESS
//     if (req.user.id === "ADMIN") return next();

//     const user = await User.findById(req.user.id);

//     if (!user || !user.isAdmin) {
//       return res.status(403).json({ msg: "Admin only" });
//     }

//     next();
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// const User = require("../models/User");

// module.exports = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id);

//     if (!user || !user.isAdmin) {
//       return res.status(403).json({ msg: "Admin only" });
//     }

//     next();
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// module.exports = (req, res, next) => {
//   if (req.user.role !== "admin")
//     return res.status(403).json({ msg: "Admin only" });
//   next();
// };
