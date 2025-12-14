const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const adminConfig = require("../config/admin");
const sendEmail = require("../utils/sendEmail");

// Logs & Notifications
const { saveLog } = require("./logController");
const { createNotification } = require("./notificationController");

// =========================
// Helper: Get Client IP
// =========================
const getClientIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;

// =========================
// REGISTER
// =========================
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const user = await User.create({
      email,
      password: hashedPassword,
      emailVerified: false,
      verificationToken: hashedToken,
      verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000,
    });

    const verifyURL = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      text: `
        <h2>Email Verification</h2>
        <p>Please click the link below to verify your email:</p>
        <a href="${verifyURL}">${verifyURL}</a>
      `,
    });

    await saveLog(
      user._id,
      `User registered. Verification email sent.`,
      "user",
      user._id,
      req
    );

    await createNotification(
      "NEW_USER_REGISTERED",
      `New user registered: ${user.email}`,
      user._id
    );

    res.status(201).json({
      msg: "Registration successful. Please verify your email.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Registration failed" });
  }
};

// =========================
// LOGIN (with Failed Login Logging)
// =========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientIp = getClientIp(req);

    if (!email || !password)
      return res.status(400).json({ msg: "All fields required" }); // 🔐 STATIC ADMIN LOGIN

    if (email === adminConfig.email && password === adminConfig.password) {
      const token = jwt.sign(
        { id: "ADMIN", role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      await saveLog(
        "ADMIN",
        `Static admin login from IP ${clientIp}`,
        "admin",
        null,
        req
      );

      return res.json({ token, role: "admin" });
    } // 👤 USER LOGIN

    const user = await User.findOne({ email }).select("+password"); // 🛑 FAILURE POINT 1: User not found

    if (!user) {
      await saveLog(
        null,
        `Failed login attempt (email not found): ${email} from IP ${clientIp}`,
        "security",
        null,
        req
      ); // Return generic error message to prevent enumeration attack
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!user.emailVerified)
      return res.status(403).json({
        msg: "Please verify your email before logging in",
      });

    const match = await bcrypt.compare(password, user.password); // 🛑 FAILURE POINT 2: Incorrect password

    if (!match) {
      await saveLog(
        user._id,
        `Failed login attempt (wrong password) for user: ${email} from IP ${clientIp}`,
        "security",
        user._id,
        req
      ); // Return generic error message
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 🟢 SUCCESS
    const role = user.isAdmin ? "admin" : "user";

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    await saveLog(user._id, `Login successful as ${role}`, role, user._id, req);

    res.json({
      token,
      role,
      username: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Login failed" });
  }
};

// =========================
// FORGOT PASSWORD
// =========================
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.json({
        msg: "If the email exists, a reset link was sent",
      });

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      text: `
        <h2>Password Reset</h2>
        <a href="${resetURL}">${resetURL}</a>
      `,
    });

    await saveLog(user._id, "Password reset requested", "user", user._id, req);

    res.json({ msg: "Password reset link sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Password reset failed" });
  }
};

// =========================
// RESET PASSWORD
// =========================
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    user.password = await bcrypt.hash(req.body.newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    await saveLog(user._id, "Password reset successful", "user", user._id, req);

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Reset failed" });
  }
};

// =========================
// VERIFY EMAIL
// =========================
exports.verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.verificationToken)
      .digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired link" });

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;

    await user.save({ validateBeforeSave: false });

    await saveLog(
      user._id,
      "Email verified successfully",
      "user",
      user._id,
      req
    );

    res.json({ msg: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Verification failed" });
  }
};

// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const crypto = require("crypto");
// const adminConfig = require("../config/admin");
// const sendEmail = require("../utils/sendEmail");

// // Logs & Notifications
// const { saveLog } = require("./logController");
// const { createNotification } = require("./notificationController");

// // =========================
// // Helper: Get Client IP
// // =========================
// const getClientIp = (req) =>
//   req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;

// // =========================
// // REGISTER
// // =========================
// exports.register = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ msg: "All fields are required" });

//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ msg: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const verificationToken = crypto.randomBytes(20).toString("hex");
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(verificationToken)
//       .digest("hex");

//     const user = await User.create({
//       email,
//       password: hashedPassword,
//       emailVerified: false,
//       verificationToken: hashedToken,
//       verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000,
//     });

//     const verifyURL = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

//     await sendEmail({
//       to: user.email,
//       subject: "Verify your email",
//       text: `
//         <h2>Email Verification</h2>
//         <p>Please click the link below to verify your email:</p>
//         <a href="${verifyURL}">${verifyURL}</a>
//       `,
//     });

//     await saveLog(
//       user._id,
//       `User registered. Verification email sent.`,
//       "user",
//       user._id,
//       req
//     );

//     await createNotification(
//       "NEW_USER_REGISTERED",
//       `New user registered: ${user.email}`,
//       user._id
//     );

//     res.status(201).json({
//       msg: "Registration successful. Please verify your email.",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Registration failed" });
//   }
// };

// // =========================
// // LOGIN
// // =========================
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const clientIp = getClientIp(req);

//     if (!email || !password)
//       return res.status(400).json({ msg: "All fields required" });

//     // 🔐 STATIC ADMIN LOGIN
//     if (email === adminConfig.email && password === adminConfig.password) {
//       const token = jwt.sign(
//         { id: "ADMIN", role: "admin" },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//       );

//       await saveLog(
//         "ADMIN",
//         `Static admin login from IP ${clientIp}`,
//         "admin",
//         null,
//         req
//       );

//       return res.json({ token, role: "admin" });
//     }

//     // 👤 USER LOGIN
//     const user = await User.findOne({ email }).select("+password");
//     if (!user) return res.status(400).json({ msg: "Invalid credentials" });

//     if (!user.emailVerified)
//       return res.status(403).json({
//         msg: "Please verify your email before logging in",
//       });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ msg: "Invalid credentials" });

//     const role = user.isAdmin ? "admin" : "user";

//     const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     await saveLog(user._id, `Login successful as ${role}`, role, user._id, req);

//     res.json({
//       token,
//       role,
//       username: user.email,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Login failed" });
//   }
// };

// // =========================
// // FORGOT PASSWORD
// // =========================
// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.json({
//         msg: "If the email exists, a reset link was sent",
//       });

//     const resetToken = crypto.randomBytes(20).toString("hex");

//     user.resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");
//     user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

//     await user.save({ validateBeforeSave: false });

//     const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     await sendEmail({
//       to: user.email,
//       subject: "Password Reset",
//       text: `
//         <h2>Password Reset</h2>
//         <a href="${resetURL}">${resetURL}</a>
//       `,
//     });

//     await saveLog(user._id, "Password reset requested", "user", user._id, req);

//     res.json({ msg: "Password reset link sent" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Password reset failed" });
//   }
// };

// // =========================
// // RESET PASSWORD
// // =========================
// exports.resetPassword = async (req, res) => {
//   try {
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(req.params.resetToken)
//       .digest("hex");

//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpire: { $gt: Date.now() },
//     }).select("+password");

//     if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

//     user.password = await bcrypt.hash(req.body.newPassword, 10);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save();

//     await saveLog(user._id, "Password reset successful", "user", user._id, req);

//     res.json({ msg: "Password reset successful" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Reset failed" });
//   }
// };

// // =========================
// // VERIFY EMAIL
// // =========================
// exports.verifyEmail = async (req, res) => {
//   try {
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(req.params.verificationToken)
//       .digest("hex");

//     const user = await User.findOne({
//       verificationToken: hashedToken,
//       verificationTokenExpire: { $gt: Date.now() },
//     });

//     if (!user) return res.status(400).json({ msg: "Invalid or expired link" });

//     user.emailVerified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenExpire = undefined;

//     await user.save({ validateBeforeSave: false });

//     await saveLog(
//       user._id,
//       "Email verified successfully",
//       "user",
//       user._id,
//       req
//     );

//     res.json({ msg: "Email verified successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Verification failed" });
//   }
// };

// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const crypto = require("crypto");
// const adminConfig = require("../config/admin");
// const sendEmail = require("../utils/sendEmail");

// const { saveLog } = require("./logController");
// const { createNotification } = require("./notificationController");

// // =========================
// // Helper: Client IP
// // =========================
// const getClientIp = (req) =>
//   req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;

// // =========================
// // REGISTER
// // =========================
// exports.register = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ msg: "All fields required" });

//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ msg: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const verificationToken = crypto.randomBytes(20).toString("hex");
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(verificationToken)
//       .digest("hex");

//     const user = await User.create({
//       email,
//       password: hashedPassword,
//       emailVerified: false,
//       verificationToken: hashedToken,
//       verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000,
//     });

//     const verifyURL = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

//     await sendEmail({
//       to: user.email,
//       subject: "Verify your email",
//       text: `
//         <h2>Email Verification</h2>
//         <a href="${verifyURL}">${verifyURL}</a>
//       `,
//     });

//     await saveLog(
//       user._id,
//       "User registered. Verification email sent.",
//       "user",
//       user._id,
//       req
//     );

//     res.status(201).json({
//       msg: "Registration successful. Please verify your email.",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Registration failed" });
//   }
// };

// // =========================
// // LOGIN
// // =========================
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const clientIp = getClientIp(req);

//     if (!email || !password)
//       return res.status(400).json({ msg: "All fields required" });

//     // 🔐 STATIC ADMIN
//     if (email === adminConfig.email && password === adminConfig.password) {
//       const token = jwt.sign(
//         { id: "ADMIN", role: "admin" },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//       );

//       await saveLog(
//         "ADMIN",
//         `Admin logged in from IP ${clientIp}`,
//         "admin",
//         null,
//         req
//       );

//       return res.json({ token, role: "admin" });
//     }

//     // 👤 USER
//     const user = await User.findOne({ email }).select("+password");
//     if (!user) return res.status(400).json({ msg: "Invalid credentials" });

//     if (!user.emailVerified)
//       return res.status(403).json({
//         msg: "Please verify your email before logging in",
//       });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ msg: "Invalid credentials" });

//     const role = user.isAdmin ? "admin" : "user";

//     const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     await saveLog(user._id, `Login successful as ${role}`, role, user._id, req);

//     res.json({
//       token,
//       role,
//       username: user.email,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Login failed" });
//   }
// };

// // =========================
// // LOGOUT  ✅ NEW
// // =========================
// exports.logout = async (req, res) => {
//   try {
//     const userId = req.user?.id || "UNKNOWN";
//     const role = req.user?.role || "user";

//     await saveLog(
//       userId,
//       "User logged out",
//       role,
//       userId !== "UNKNOWN" ? userId : null,
//       req
//     );

//     res.json({ msg: "Logged out successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Logout failed" });
//   }
// };

// // =========================
// // FORGOT PASSWORD
// // =========================
// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.json({
//         msg: "If the email exists, a reset link was sent",
//       });

//     const resetToken = crypto.randomBytes(20).toString("hex");

//     user.resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

//     await user.save({ validateBeforeSave: false });

//     const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     await sendEmail({
//       to: user.email,
//       subject: "Password Reset",
//       text: `<a href="${resetURL}">${resetURL}</a>`,
//     });

//     await saveLog(user._id, "Password reset requested", "user", user._id, req);

//     res.json({ msg: "Password reset link sent" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Password reset failed" });
//   }
// };

// // =========================
// // RESET PASSWORD
// // =========================
// exports.resetPassword = async (req, res) => {
//   try {
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(req.params.resetToken)
//       .digest("hex");

//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpire: { $gt: Date.now() },
//     }).select("+password");

//     if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

//     user.password = await bcrypt.hash(req.body.newPassword, 10);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save();

//     await saveLog(user._id, "Password reset successful", "user", user._id, req);

//     res.json({ msg: "Password reset successful" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Reset failed" });
//   }
// };

// // =========================
// // VERIFY EMAIL
// // =========================
// exports.verifyEmail = async (req, res) => {
//   try {
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(req.params.verificationToken)
//       .digest("hex");

//     const user = await User.findOne({
//       verificationToken: hashedToken,
//       verificationTokenExpire: { $gt: Date.now() },
//     });

//     if (!user) return res.status(400).json({ msg: "Invalid or expired link" });

//     user.emailVerified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenExpire = undefined;

//     await user.save({ validateBeforeSave: false });

//     await saveLog(
//       user._id,
//       "Email verified successfully",
//       "user",
//       user._id,
//       req
//     );

//     res.json({ msg: "Email verified successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Verification failed" });
//   }
// };

// // backend/controllers/authController.js

// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const adminConfig = require("../config/admin");

// // 🎯 CRITICAL IMPORTS
// const { saveLog } = require("./logController");
// const { createNotification } = require("./notificationController");
// const crypto = require("crypto"); // For generating reset tokens/verification tokens
// const sendEmail = require("../utils/sendEmail"); // Email utility (ACTIVE)

// // 🎯 Helper function to safely get client IP
// const getClientIp = (req) => {
//   return req.header("x-forwarded-for") || req.ip;
// };

// /* =========================
//     REGISTER 🛑 FIXED LINK GENERATION 🛑
// ========================= */
// exports.register = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ msg: "All fields required" });

//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ msg: "User already exists" });

//     const hashed = await bcrypt.hash(password, 10);
//     const verificationToken = crypto.randomBytes(20).toString("hex");

//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(verificationToken)
//       .digest("hex");

//     const newUser = await User.create({
//       email,
//       password: hashed,
//       isAdmin: false,
//       blocked: false,
//       emailVerified: false, // Starts as false
//       verificationToken: hashedToken, // 🛑 Save the hashed token
//       verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000, // 🛑 24-hour expiry
//     });

//     // 🛑 FIX APPLIED: Use FRONTEND_URL environment variable
//     const verifyURL = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

//     const message = `
//             <h1>Welcome to Your Trading App!</h1>
//             <p>Thanks for registering. Please click the link below to verify your email address. This link is valid for 24 hours.</p>
//             <a href="${verifyURL}" clicktracking=off>${verifyURL}</a>
//             <p>If you did not sign up for this account, please ignore this email.</p>
//         `;

//     try {
//       // 5. Send the email
//       await sendEmail({
//         to: newUser.email,
//         subject: "Verify Your Email Address",
//         text: message,
//       }); // 6. LOGGING and NOTIFICATION

//       await saveLog(
//         newUser._id,
//         `Successful registration (Email verification sent): ${newUser.email}`,
//         "user",
//         newUser._id,
//         req
//       );

//       await createNotification(
//         "NEW_USER_REGISTERED",
//         `New user registered: ${newUser.email} (Verification sent)`,
//         newUser._id
//       );
//     } catch (error) {
//       console.error("Verification email failed to send:", error);
//       await createNotification(
//         "EMAIL_FAILURE",
//         `Failed to send verification email to ${newUser.email}.`,
//         null
//       );
//     }
//     res.status(201).json({
//       msg: "User registered successfully. Please check your email to verify your account.",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error during registration" });
//   }
// };

// /* =========================
//     LOGIN
// ========================= */
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ msg: "All fields required" });

//     const clientIp = getClientIp(req); // STATIC ADMIN LOGIN

//     if (email === adminConfig.email && password === adminConfig.password) {
//       // ... (Static Admin login logic remains the same)
//       await saveLog(
//         "ADMIN",
//         `Successful static admin login from IP: ${clientIp}`,
//         "admin",
//         null,
//         req
//       );
//       await createNotification(
//         "STATIC_ADMIN_LOGIN",
//         `Security Alert: Static Admin logged in from IP: ${clientIp}`,
//         null
//       );

//       const token = jwt.sign(
//         {
//           id: "STATIC_ADMIN",
//           role: "admin",
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//       );

//       return res.json({
//         token,
//         role: "admin",
//       });
//     } // DATABASE USER/ADMIN LOGIN // 🛑 FIX APPLIED: Use .select('+password') to retrieve the password field for bcrypt.compare

//     const user = await User.findOne({ email }).select("+password");
//     if (!user) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     if (user.blocked) {
//       // ... (Blocked logic remains the same)
//       await saveLog(
//         user._id,
//         `Attempted login on blocked account: ${user.email} from IP: ${clientIp}`,
//         "user",
//         user._id,
//         req
//       );
//       return res.status(403).json({ msg: "Account blocked" });
//     } // 🛑 SECURITY CHECK: EMAIL VERIFICATION

//     if (!user.emailVerified) {
//       // Log the failed attempt due to unverified email
//       await saveLog(
//         user._id,
//         `Failed login attempt (Email Not Verified) for user: ${user.email} from IP: ${clientIp}`,
//         "user",
//         user._id,
//         req
//       );
//       return res.status(403).json({
//         msg: "Please verify your email address before logging in.",
//       });
//     } // This line will now work correctly since user.password is available:

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       // ... (Password mismatch logic remains the same)
//       await saveLog(
//         user._id,
//         `Failed login attempt (Incorrect Password) for user: ${user.email} from IP: ${clientIp}`,
//         "user",
//         user._id,
//         req
//       );
//       return res.status(400).json({ msg: "Invalid credentials" });
//     } // If login is successful:

//     const role = user.isAdmin ? "admin" : "user";

//     await saveLog(
//       user._id,
//       `Successful login as ${role}: ${user.email} from IP: ${clientIp}`,
//       role,
//       user._id,
//       req
//     );

//     if (user.isAdmin) {
//       await createNotification(
//         "DB_ADMIN_LOGIN",
//         `Admin user ${user.email} logged in from IP: ${clientIp}`,
//         user._id
//       );
//     }

//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token,
//       role: role,
//       username: user.email,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error during login" });
//   }
// };

// /* =========================
//     FORGOT PASSWORD 🛑 FIXED LINK GENERATION 🛑
// ========================= */
// exports.forgotPassword = async (req, res, next) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ success: false, msg: "Email is required" });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(200).json({
//         success: true,
//         msg: "If the email exists, a password reset link has been sent.",
//       });
//     }

//     const resetToken = crypto.randomBytes(20).toString("hex");

//     user.resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

//     await user.save({ validateBeforeSave: false });

//     // 🛑 FIX APPLIED: Use FRONTEND_URL environment variable
//     const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     const message = `
//             <h1>You have requested a password reset</h1>
//             <p>Please go to this link to reset your password. This link is only valid for 1 hour.</p>
//             <a href="${resetURL}" clicktracking=off>${resetURL}</a>
//             <p>If you did not request this, please ignore this email.</p>
//         `;

//     try {
//       // 5. Send the email (Now Active)
//       await sendEmail({
//         to: user.email,
//         subject: "Password Reset Request",
//         text: message,
//       });

//       await saveLog(
//         user._id,
//         `Password reset requested for user: ${
//           user.email
//         } from IP: ${getClientIp(req)}`,
//         user.isAdmin ? "admin" : "user",
//         user._id,
//         req
//       );

//       res.status(200).json({
//         success: true,
//         msg: "Password reset link sent successfully.",
//       });
//     } catch (error) {
//       // Email failed, clear the token
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpire = undefined;
//       await user.save({ validateBeforeSave: false });

//       console.error("Email sending failed:", error);
//       await createNotification(
//         "EMAIL_FAILURE",
//         `Failed to send password reset email to ${user.email}.`,
//         null
//       );

//       return res.status(500).json({
//         success: false,
//         msg: "Email could not be sent. Server error.",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error during password reset request" });
//   }
// };

// /* =========================
//     RESET PASSWORD
// ========================= */
// exports.resetPassword = async (req, res, next) => {
//   const { newPassword } = req.body;
//   const { resetToken } = req.params;

//   if (!newPassword) {
//     return res.status(400).json({ msg: "New password is required." });
//   }

//   try {
//     // 1. Hash the incoming reset token to find the user in the database
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex"); // 2. Find the user by the hashed token AND ensure the token has not expired

//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpire: { $gt: Date.now() }, // $gt: greater than current time
//     }).select("+password"); // We need to select the password field to update it

//     if (!user) {
//       // Token is invalid or expired
//       return res.status(400).json({ msg: "Invalid or expired reset token." });
//     } // 3. Hash the new password

//     const salt = await bcrypt.genSalt(10);
//     const hashedNewPassword = await bcrypt.hash(newPassword, salt); // 4. Update the user's password and clear the reset fields

//     user.password = hashedNewPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     user.emailVerified = true; // Optionally verify email upon password reset

//     await user.save(); // 5. LOGGING

//     await saveLog(
//       user._id,
//       `Password successfully reset via token for user: ${
//         user.email
//       } from IP: ${getClientIp(req)}`,
//       user.isAdmin ? "admin" : "user",
//       user._id,
//       req
//     );

//     res.status(200).json({
//       success: true,
//       msg: "Password reset successful. You can now log in.",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error during password reset." });
//   }
// };

// /* =========================
//     VERIFY EMAIL
// ========================= */
// exports.verifyEmail = async (req, res, next) => {
//   const { verificationToken } = req.params;

//   try {
//     // 1. Hash the incoming token to find the user in the database
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(verificationToken)
//       .digest("hex"); // 2. Find the user by the hashed token AND ensure the token has not expired

//     const user = await User.findOne({
//       verificationToken: hashedToken,
//       verificationTokenExpire: { $gt: Date.now() }, // $gt: greater than current time
//     });

//     if (!user) {
//       // Token is invalid or expired
//       return res
//         .status(400)
//         .json({ msg: "Invalid or expired verification link." });
//     } // 3. Update the user status and clear the token fields

//     user.emailVerified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenExpire = undefined;

//     await user.save({ validateBeforeSave: false }); // 4. LOGGING: Log email verification success

//     await saveLog(
//       user._id,
//       `Email successfully verified for user: ${
//         user.email
//       } from IP: ${getClientIp(req)}`,
//       user.isAdmin ? "admin" : "user",
//       user._id,
//       req
//     ); // 5. Success response (Frontend will redirect user to login/dashboard)

//     res.status(200).json({
//       success: true,
//       msg: "Email successfully verified. You can now log in.",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error during email verification." });
//   }
// };

// /* =========================
//     EXPORTS
// ========================= */
// exports.register = exports.register;
// exports.login = exports.login;
// exports.forgotPassword = exports.forgotPassword;
// exports.resetPassword = exports.resetPassword;
// exports.verifyEmail = exports.verifyEmail;

// // backend/controllers/authController.js

// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const adminConfig = require("../config/admin");

// // 🎯 CRITICAL IMPORTS
// const { saveLog } = require("./logController");
// const { createNotification } = require("./notificationController");
// const crypto = require("crypto"); // For generating reset tokens/verification tokens
// const sendEmail = require("../utils/sendEmail"); // Email utility (ACTIVE)

// // 🎯 Helper function to safely get client IP
// const getClientIp = (req) => {
//   return req.header("x-forwarded-for") || req.ip;
// };

// /* =========================
//     REGISTER
// ========================= */
// exports.register = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ msg: "All fields required" });

//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ msg: "User already exists" });

//     const hashed = await bcrypt.hash(password, 10);
//     const verificationToken = crypto.randomBytes(20).toString("hex");

//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(verificationToken)
//       .digest("hex");

//     const newUser = await User.create({
//       email,
//       password: hashed,
//       isAdmin: false,
//       blocked: false,
//       emailVerified: false, // Starts as false
//       verificationToken: hashedToken, // 🛑 Save the hashed token
//       verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000, // 🛑 24-hour expiry
//     });

//     const verifyURL = `${req.protocol}://${req.get(
//       "host"
//     )}/verify-email/${verificationToken}`;

//     const message = `
//             <h1>Welcome to Your Trading App!</h1>
//             <p>Thanks for registering. Please click the link below to verify your email address. This link is valid for 24 hours.</p>
//             <a href="${verifyURL}" clicktracking=off>${verifyURL}</a>
//             <p>If you did not sign up for this account, please ignore this email.</p>
//         `;

//     try {
//       // 5. Send the email
//       await sendEmail({
//         to: newUser.email,
//         subject: "Verify Your Email Address",
//         text: message,
//       }); // 6. LOGGING and NOTIFICATION

//       await saveLog(
//         newUser._id,
//         `Successful registration (Email verification sent): ${newUser.email}`,
//         "user",
//         newUser._id,
//         req
//       );

//       await createNotification(
//         "NEW_USER_REGISTERED",
//         `New user registered: ${newUser.email} (Verification sent)`,
//         newUser._id
//       );
//     } catch (error) {
//       console.error("Verification email failed to send:", error);
//       await createNotification(
//         "EMAIL_FAILURE",
//         `Failed to send verification email to ${newUser.email}.`,
//         null
//       );
//     }
//     res.status(201).json({
//       msg: "User registered successfully. Please check your email to verify your account.",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error during registration" });
//   }
// };

// /* =========================
//     LOGIN 🛑 FIX APPLIED HERE 🛑
// ========================= */
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ msg: "All fields required" });

//     const clientIp = getClientIp(req); // STATIC ADMIN LOGIN

//     if (email === adminConfig.email && password === adminConfig.password) {
//       // ... (Static Admin login logic remains the same)
//       await saveLog(
//         "ADMIN",
//         `Successful static admin login from IP: ${clientIp}`,
//         "admin",
//         null,
//         req
//       );
//       await createNotification(
//         "STATIC_ADMIN_LOGIN",
//         `Security Alert: Static Admin logged in from IP: ${clientIp}`,
//         null
//       );

//       const token = jwt.sign(
//         {
//           id: "STATIC_ADMIN",
//           role: "admin",
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//       );

//       return res.json({
//         token,
//         role: "admin",
//       });
//     } // DATABASE USER/ADMIN LOGIN

//     // 🛑 FIX APPLIED: Use .select('+password') to retrieve the password field for bcrypt.compare
//     const user = await User.findOne({ email }).select("+password");
//     if (!user) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     if (user.blocked) {
//       // ... (Blocked logic remains the same)
//       await saveLog(
//         user._id,
//         `Attempted login on blocked account: ${user.email} from IP: ${clientIp}`,
//         "user",
//         user._id,
//         req
//       );
//       return res.status(403).json({ msg: "Account blocked" });
//     } // 🛑 SECURITY CHECK: EMAIL VERIFICATION

//     if (!user.emailVerified) {
//       // Log the failed attempt due to unverified email
//       await saveLog(
//         user._id,
//         `Failed login attempt (Email Not Verified) for user: ${user.email} from IP: ${clientIp}`,
//         "user",
//         user._id,
//         req
//       );
//       return res.status(403).json({
//         msg: "Please verify your email address before logging in.",
//       });
//     }

//     // This line will now work correctly since user.password is available:
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       // ... (Password mismatch logic remains the same)
//       await saveLog(
//         user._id,
//         `Failed login attempt (Incorrect Password) for user: ${user.email} from IP: ${clientIp}`,
//         "user",
//         user._id,
//         req
//       );
//       return res.status(400).json({ msg: "Invalid credentials" });
//     } // If login is successful:

//     const role = user.isAdmin ? "admin" : "user";

//     await saveLog(
//       user._id,
//       `Successful login as ${role}: ${user.email} from IP: ${clientIp}`,
//       role,
//       user._id,
//       req
//     );

//     if (user.isAdmin) {
//       await createNotification(
//         "DB_ADMIN_LOGIN",
//         `Admin user ${user.email} logged in from IP: ${clientIp}`,
//         user._id
//       );
//     }

//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token,
//       role: role,
//       username: user.email,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error during login" });
//   }
// };

// /* =========================
//     FORGOT PASSWORD
// ========================= */
// exports.forgotPassword = async (req, res, next) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ success: false, msg: "Email is required" });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(200).json({
//         success: true,
//         msg: "If the email exists, a password reset link has been sent.",
//       });
//     }

//     const resetToken = crypto.randomBytes(20).toString("hex");

//     user.resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

//     await user.save({ validateBeforeSave: false });

//     const resetURL = `${req.protocol}://${req.get(
//       "host"
//     )}/reset-password/${resetToken}`;

//     const message = `
//             <h1>You have requested a password reset</h1>
//             <p>Please go to this link to reset your password. This link is only valid for 1 hour.</p>
//             <a href="${resetURL}" clicktracking=off>${resetURL}</a>
//             <p>If you did not request this, please ignore this email.</p>
//         `;

//     try {
//       // 5. Send the email (Now Active)
//       await sendEmail({
//         to: user.email,
//         subject: "Password Reset Request",
//         text: message,
//       });

//       await saveLog(
//         user._id,
//         `Password reset requested for user: ${
//           user.email
//         } from IP: ${getClientIp(req)}`,
//         user.isAdmin ? "admin" : "user",
//         user._id,
//         req
//       );

//       res.status(200).json({
//         success: true,
//         msg: "Password reset link sent successfully.",
//       });
//     } catch (error) {
//       // Email failed, clear the token
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpire = undefined;
//       await user.save({ validateBeforeSave: false });

//       console.error("Email sending failed:", error);
//       await createNotification(
//         "EMAIL_FAILURE",
//         `Failed to send password reset email to ${user.email}.`,
//         null
//       );

//       return res.status(500).json({
//         success: false,
//         msg: "Email could not be sent. Server error.",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error during password reset request" });
//   }
// };

// /* =========================
//     RESET PASSWORD
// ========================= */
// exports.resetPassword = async (req, res, next) => {
//   const { newPassword } = req.body;
//   const { resetToken } = req.params;

//   if (!newPassword) {
//     return res.status(400).json({ msg: "New password is required." });
//   }

//   try {
//     // 1. Hash the incoming reset token to find the user in the database
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex"); // 2. Find the user by the hashed token AND ensure the token has not expired

//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpire: { $gt: Date.now() }, // $gt: greater than current time
//     }).select("+password"); // We need to select the password field to update it

//     if (!user) {
//       // Token is invalid or expired
//       return res.status(400).json({ msg: "Invalid or expired reset token." });
//     } // 3. Hash the new password

//     const salt = await bcrypt.genSalt(10);
//     const hashedNewPassword = await bcrypt.hash(newPassword, salt); // 4. Update the user's password and clear the reset fields

//     user.password = hashedNewPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     user.emailVerified = true; // Optionally verify email upon password reset

//     await user.save(); // 5. LOGGING

//     await saveLog(
//       user._id,
//       `Password successfully reset via token for user: ${
//         user.email
//       } from IP: ${getClientIp(req)}`,
//       user.isAdmin ? "admin" : "user",
//       user._id,
//       req
//     );

//     res.status(200).json({
//       success: true,
//       msg: "Password reset successful. You can now log in.",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error during password reset." });
//   }
// };

// /* =========================
//     VERIFY EMAIL
// ========================= */
// exports.verifyEmail = async (req, res, next) => {
//   const { verificationToken } = req.params;

//   try {
//     // 1. Hash the incoming token to find the user in the database
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(verificationToken)
//       .digest("hex"); // 2. Find the user by the hashed token AND ensure the token has not expired

//     const user = await User.findOne({
//       verificationToken: hashedToken,
//       verificationTokenExpire: { $gt: Date.now() }, // $gt: greater than current time
//     });

//     if (!user) {
//       // Token is invalid or expired
//       return res
//         .status(400)
//         .json({ msg: "Invalid or expired verification link." });
//     } // 3. Update the user status and clear the token fields

//     user.emailVerified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenExpire = undefined;

//     await user.save({ validateBeforeSave: false }); // 4. LOGGING: Log email verification success

//     await saveLog(
//       user._id,
//       `Email successfully verified for user: ${
//         user.email
//       } from IP: ${getClientIp(req)}`,
//       user.isAdmin ? "admin" : "user",
//       user._id,
//       req
//     ); // 5. Success response (Frontend will redirect user to login/dashboard)

//     res.status(200).json({
//       success: true,
//       msg: "Email successfully verified. You can now log in.",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error during email verification." });
//   }
// };

// /* =========================
//     EXPORTS
// ========================= */
// exports.register = exports.register;
// exports.login = exports.login;
// exports.forgotPassword = exports.forgotPassword;
// exports.resetPassword = exports.resetPassword;
// exports.verifyEmail = exports.verifyEmail;
// // backend/controllers/authController.js

// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const adminConfig = require("../config/admin");

// // 🎯 CRITICAL IMPORTS
// const { saveLog } = require("./logController");
// const { createNotification } = require("./notificationController");
// const crypto = require("crypto"); // For generating reset tokens
// const sendEmail = require("../utils/sendEmail"); // Email utility (ACTIVE)

// // 🎯 Helper function to safely get client IP
// const getClientIp = (req) => {
//   return req.header("x-forwarded-for") || req.ip;
// };

// /* =========================
//     REGISTER
// ========================= */
// exports.register = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ msg: "All fields required" });

//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ msg: "User already exists" });

//     const hashed = await bcrypt.hash(password, 10);

//     const newUser = await User.create({
//       email,
//       password: hashed,
//       isAdmin: false,
//       blocked: false,
//       emailVerified: false,
//     });

//     await saveLog(
//       newUser._id,
//       `Successful registration: ${newUser.email}`,
//       "user",
//       newUser._id,
//       req
//     );

//     await createNotification(
//       "NEW_USER_REGISTERED",
//       `New user registered: ${newUser.email}`,
//       newUser._id
//     );

//     res.status(201).json({ msg: "User registered successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error during registration" });
//   }
// };

// /* =========================
//     LOGIN
// ========================= */
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ msg: "All fields required" });

//     const clientIp = getClientIp(req);

//     // STATIC ADMIN LOGIN
//     if (email === adminConfig.email && password === adminConfig.password) {
//       await saveLog(
//         "ADMIN",
//         `Successful static admin login from IP: ${clientIp}`,
//         "admin",
//         null,
//         req
//       );
//       await createNotification(
//         "STATIC_ADMIN_LOGIN",
//         `Security Alert: Static Admin logged in from IP: ${clientIp}`,
//         null
//       );

//       const token = jwt.sign(
//         {
//           id: "STATIC_ADMIN",
//           role: "admin",
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//       );

//       return res.json({
//         token,
//         role: "admin",
//       });
//     }

//     // DATABASE USER/ADMIN LOGIN
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     if (user.blocked) {
//       await saveLog(
//         user._id,
//         `Attempted login on blocked account: ${user.email} from IP: ${clientIp}`,
//         "user",
//         user._id,
//         req
//       );
//       return res.status(403).json({ msg: "Account blocked" });
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       await saveLog(
//         user._id,
//         `Failed login attempt (Incorrect Password) for user: ${user.email} from IP: ${clientIp}`,
//         "user",
//         user._id,
//         req
//       );
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     const role = user.isAdmin ? "admin" : "user";

//     await saveLog(
//       user._id,
//       `Successful login as ${role}: ${user.email} from IP: ${clientIp}`,
//       role,
//       user._id,
//       req
//     );

//     if (user.isAdmin) {
//       await createNotification(
//         "DB_ADMIN_LOGIN",
//         `Admin user ${user.email} logged in from IP: ${clientIp}`,
//         user._id
//       );
//     }

//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token,
//       role: role,
//       username: user.email,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error during login" });
//   }
// };

// /* =========================
//     FORGOT PASSWORD
// ========================= */
// exports.forgotPassword = async (req, res, next) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ success: false, msg: "Email is required" });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(200).json({
//         success: true,
//         msg: "If the email exists, a password reset link has been sent.",
//       });
//     } // 1. Generate a unique reset token

//     const resetToken = crypto.randomBytes(20).toString("hex"); // 2. Hash and save the token

//     user.resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex"); // Token expiry: 1 hour

//     user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

//     await user.save({ validateBeforeSave: false }); // 3. Create the reset link

//     const resetURL = `${req.protocol}://${req.get(
//       "host"
//     )}/reset-password/${resetToken}`; // 4. Email content

//     const message = `
//             <h1>You have requested a password reset</h1>
//             <p>Please go to this link to reset your password. This link is only valid for 1 hour.</p>
//             <a href="${resetURL}" clicktracking=off>${resetURL}</a>
//             <p>If you did not request this, please ignore this email.</p>
//         `;

//     try {
//       // 5. Send the email (Now Active)
//       await sendEmail({
//         to: user.email,
//         subject: "Password Reset Request",
//         text: message,
//       }); // 6. LOGGING

//       await saveLog(
//         user._id,
//         `Password reset requested for user: ${
//           user.email
//         } from IP: ${getClientIp(req)}`,
//         user.isAdmin ? "admin" : "user",
//         user._id,
//         req
//       );

//       res.status(200).json({
//         success: true,
//         msg: "Password reset link sent successfully.",
//       });
//     } catch (error) {
//       // Email failed, clear the token
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpire = undefined;
//       await user.save({ validateBeforeSave: false });

//       console.error("Email sending failed:", error);
//       await createNotification(
//         "EMAIL_FAILURE",
//         `Failed to send password reset email to ${user.email}.`,
//         null
//       );

//       return res.status(500).json({
//         success: false,
//         msg: "Email could not be sent. Server error.",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error during password reset request" });
//   }
// };

// /* =========================
//     RESET PASSWORD 🛑 THE MISSING FUNCTION 🛑
// ========================= */
// exports.resetPassword = async (req, res, next) => {
//   const { newPassword } = req.body;
//   const { resetToken } = req.params;

//   if (!newPassword) {
//     return res.status(400).json({ msg: "New password is required." });
//   }

//   try {
//     // 1. Hash the incoming reset token to find the user in the database
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     // 2. Find the user by the hashed token AND ensure the token has not expired
//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpire: { $gt: Date.now() }, // $gt: greater than current time
//     }).select("+password"); // We need to select the password field to update it

//     if (!user) {
//       // Token is invalid or expired
//       return res.status(400).json({ msg: "Invalid or expired reset token." });
//     }

//     // 3. Hash the new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedNewPassword = await bcrypt.hash(newPassword, salt);

//     // 4. Update the user's password and clear the reset fields
//     user.password = hashedNewPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     user.emailVerified = true; // Optionally verify email upon password reset

//     await user.save();

//     // 5. LOGGING
//     await saveLog(
//       user._id,
//       `Password successfully reset via token for user: ${
//         user.email
//       } from IP: ${getClientIp(req)}`,
//       user.isAdmin ? "admin" : "user",
//       user._id,
//       req
//     );

//     res.status(200).json({
//       success: true,
//       msg: "Password reset successful. You can now log in.",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error during password reset." });
//   }
// };

// /* =========================
//     EXPORTS
// ========================= */
// // 🛑 Corrected exports: The function definitions are above, so the exports are correct here.
// exports.register = exports.register;
// exports.login = exports.login;
// exports.forgotPassword = exports.forgotPassword;
// exports.resetPassword = exports.resetPassword;

// // backend/controllers/authController.js

// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const adminConfig = require("../config/admin");

// // 🎯 CRITICAL IMPORTS
// const { saveLog } = require("./logController");
// const { createNotification } = require("./notificationController");

// // 🎯 Helper function to safely get client IP
// const getClientIp = (req) => {
//   // Check for common proxy headers (like those used by Heroku, AWS, or Nginx)
//   return req.header("x-forwarded-for") || req.ip;
// };

// /* =========================
//     REGISTER
// ========================= */
// exports.register = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ msg: "All fields required" });

//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ msg: "User already exists" });

//     const hashed = await bcrypt.hash(password, 10);

//     const newUser = await User.create({
//       email,
//       password: hashed,
//       isAdmin: false,
//       blocked: false,
//       emailVerified: false,
//     });

//     // 1. LOGGING: Log successful user registration (Audit Trail)
//     await saveLog(
//       newUser._id,
//       `Successful registration: ${newUser.email}`,
//       "user",
//       newUser._id,
//       req
//     );

//     // 2. 🚨 NOTIFICATION: Alert admin about the new user (Immediate Alert)
//     await createNotification(
//       "NEW_USER_REGISTERED",
//       `New user registered: ${newUser.email}`,
//       newUser._id
//     );

//     res.status(201).json({ msg: "User registered successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error during registration" }); // Added specificity
//   }
// };

// /* =========================
//     LOGIN
// ========================= */
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ msg: "All fields required" });

//     const clientIp = getClientIp(req); // Get the client's IP address

//     /* ---------- STATIC ADMIN LOGIN ---------- */
//     if (email === adminConfig.email && password === adminConfig.password) {
//       // 1. LOGGING: Log successful static admin login
//       await saveLog(
//         "ADMIN",
//         `Successful static admin login from IP: ${clientIp}`,
//         "admin",
//         null,
//         req
//       );

//       // 2. 🚨 NOTIFICATION: Alert about critical static admin login
//       await createNotification(
//         "STATIC_ADMIN_LOGIN",
//         `Security Alert: Static Admin logged in from IP: ${clientIp}`,
//         null
//       );

//       const token = jwt.sign(
//         {
//           id: "STATIC_ADMIN", // Changed to STATIC_ADMIN for clarity
//           role: "admin",
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//       );

//       return res.json({
//         token,
//         role: "admin",
//       });
//     }

//     /* ---------- DATABASE USER/ADMIN LOGIN ---------- */
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     if (user.blocked) {
//       // LOGGING: Log attempt on a blocked account
//       await saveLog(
//         user._id,
//         `Attempted login on blocked account: ${user.email} from IP: ${clientIp}`,
//         "user",
//         user._id,
//         req
//       );
//       return res.status(403).json({ msg: "Account blocked" });
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       // LOGGING: Log failed login attempts
//       await saveLog(
//         user._id,
//         `Failed login attempt (Incorrect Password) for user: ${user.email} from IP: ${clientIp}`,
//         "user",
//         user._id,
//         req
//       );
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     // If login is successful:
//     const role = user.isAdmin ? "admin" : "user";

//     // 1. LOGGING: Log successful database user login
//     await saveLog(
//       user._id,
//       `Successful login as ${role}: ${user.email} from IP: ${clientIp}`,
//       role,
//       user._id,
//       req
//     );

//     // 2. 🚨 NOTIFICATION: Alert admin only if a DB user logs in as admin
//     if (user.isAdmin) {
//       await createNotification(
//         "DB_ADMIN_LOGIN",
//         `Admin user ${user.email} logged in from IP: ${clientIp}`,
//         user._id
//       );
//     }

//     // 🛑 CRITICAL FIX: Include the 'role' in the JWT payload for proper frontend security checks.
//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: role, // Ensure role is here!
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token,
//       role: role,
//       // Optionally, return the email/username if needed for the frontend header display
//       username: user.email,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error during login" }); // Added specificity
//   }
// };
