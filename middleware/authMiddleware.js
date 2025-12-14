const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* =========================
       STATIC ADMIN (NO DB HIT)
    ========================= */
    if (decoded.id === "ADMIN" || decoded.id === "STATIC_ADMIN") {
      req.user = {
        id: "ADMIN",
        role: "admin",
        isAdmin: true,
      };
      return next();
    }

    /* =========================
       VALIDATE OBJECT ID
    ========================= */
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res
        .status(400)
        .json({ msg: "Invalid user ID format for DB lookup" });
    }

    /* =========================
       FETCH USER FROM DB
    ========================= */
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // MUST contain id
//     next();
//   } catch {
//     res.status(401).json({ msg: "Invalid token" });
//   }
// };

// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(401).json({ msg: "Invalid token" });
//   }
// };
