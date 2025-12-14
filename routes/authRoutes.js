// // // backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();

// 🛑 IMPORTANT: Import all required functions from the controller
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail, // ⬅️ NEW: The function to handle the verification token
} = require("../controllers/authController");

// AUTH ROUTES
router.post("/register", register);
router.post("/login", login);

// PASSWORD RESET ROUTES
// Step 1: Route for requesting the reset link (Forgot Password form submission)
router.post("/forgot-password", forgotPassword);

// Step 2: Route for handling the new password submission (from the email link)
router.post("/reset-password/:resetToken", resetPassword);

// 🛑 EMAIL VERIFICATION ROUTE 🛑
// This handles the GET request when a user clicks the link sent to their email
router.get("/verify-email/:verificationToken", verifyEmail);

module.exports = router;

// backend/routes/authRoutes.js
// const express = require("express");
// const router = express.Router();

// // 🛑 IMPORTANT: Import the resetPassword function here
// const {
//   register,
//   login,
//   forgotPassword,
//   resetPassword, // <--- Must be included!
// } = require("../controllers/authController");

// router.post("/register", register);
// router.post("/login", login);

// // 🛑 Step 1: Route for requesting the reset link (Forgot Password form submission)
// router.post("/forgot-password", forgotPassword);

// // 🛑 Step 2: Route for handling the new password submission (from the email link)
// router.post("/reset-password/:resetToken", resetPassword);

// module.exports = router;

// // backend/routes/authRoutes.js
// const express = require("express");
// const router = express.Router();
// // 🛑 Ensure forgotPassword is imported here:
// const {
//   register,
//   login,
//   forgotPassword,
// } = require("../controllers/authController");

// router.post("/register", register);
// router.post("/login", login);
// // 🛑 Add the new route here:
// router.post("/forgot-password", forgotPassword);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { register, login } = require("../controllers/authController");

// router.post("/register", register);
// router.post("/login", login);

// module.exports = router;
