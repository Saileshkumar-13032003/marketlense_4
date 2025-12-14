const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// --- START OF CORRECTED ORDER ---

dotenv.config();
connectDB();

// 1. Initialize the Express application
const app = express();

// 2. Set up Body Parser Middleware (for handling JSON in requests)
app.use(express.json());

// 3. Configure and Apply CORS Middleware
// We use the specific origin for better security (as your frontend is likely on 5173)
const frontendOrigin = "http://localhost:5173";

const corsOptions = {
  origin: frontendOrigin,
  credentials: true,
};

// You must apply it here, AFTER 'app' is defined
app.use(cors(corsOptions));
// If you want to allow ANY origin for quick debugging, use: app.use(cors());

// 4. Define Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// --- END OF CORRECTED ORDER ---

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const cors = require("cors");
// app.use(cors());
// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json());

// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/admin", require("./routes/adminRoutes"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
