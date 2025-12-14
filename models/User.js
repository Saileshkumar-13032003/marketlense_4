const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Recommended: Prevents password from being returned by default queries
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false, // Starts as false until user clicks link
    }, // 🛑 PASSWORD RESET FIELDS
    resetPasswordToken: {
      type: String,
      required: false,
      select: false, // Added select: false for security
    },
    resetPasswordExpire: {
      type: Date,
      required: false,
      select: false, // Added select: false for security
    },

    // 🛑 EMAIL VERIFICATION FIELDS (NEWLY ADDED)
    verificationToken: {
      type: String,
      select: false, // Hashed token for security
    },
    verificationTokenExpire: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       select: false, // Recommended: Prevents password from being returned by default queries
//     },
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//     blocked: {
//       type: Boolean,
//       default: false,
//     },
//     emailVerified: {
//       type: Boolean,
//       default: false,
//     },
//     // 🛑 NEW FIELD 1: Hashed token for password reset
//     resetPasswordToken: {
//       type: String,
//       required: false,
//     },
//     // 🛑 NEW FIELD 2: Token expiration time
//     resetPasswordExpire: {
//       type: Date,
//       required: false,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//     blocked: {
//       type: Boolean,
//       default: false,
//     },
//     emailVerified: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);
