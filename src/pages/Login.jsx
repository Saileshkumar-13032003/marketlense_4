import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail } from "lucide-react";

// 🔐 Login API
const LOGIN_API = "http://localhost:5000/api/auth/login";

// 🔐 Axios Auth Header Helper
const setAxiosAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      setAxiosAuthHeader(token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !pass) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(LOGIN_API, {
        email: email.trim().toLowerCase(),
        password: pass.trim(),
      });

      const { token, role, username } = res.data;

      if (!token || !role) {
        throw new Error("Invalid login response from server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username || email);

      setAxiosAuthHeader(token);

      role === "admin" ? navigate("/admin") : navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-[#0B0F17] overflow-hidden">
      {/* 📈 STOCK GRAPH LINES BACKGROUND */}
      {/* 📈 SHARP STOCK GRAPH LINES BACKGROUND */}
      {/* 📈 ANIMATED SHARP STOCK GRAPH BACKGROUND */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
      >
        <polyline
          points="
      0,420
      120,380
      240,440
      360,320
      480,360
      600,280
      720,340
      840,260
      960,300
      1080,240
      1200,280
      1320,220
      1440,260
    "
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          strokeDasharray="2000"
          strokeDashoffset="2000"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="2000"
            to="0"
            dur="3s"
            repeatCount="indefinite"
          />
        </polyline>

        <polyline
          points="
      0,480
      140,460
      280,500
      420,420
      560,450
      700,380
      840,410
      980,360
      1120,390
      1260,330
      1440,360
    "
          fill="none"
          stroke="#16a34a"
          strokeWidth="1.5"
          strokeDasharray="1800"
          strokeDashoffset="1800"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="1800"
            to="0"
            dur="4s"
            repeatCount="indefinite"
          />
        </polyline>

        <polyline
          points="
      0,520
      160,510
      320,540
      480,500
      640,520
      800,480
      960,500
      1120,470
      1280,490
      1440,460
    "
          fill="none"
          stroke="#4ade80"
          strokeWidth="1"
          strokeDasharray="1500"
          strokeDashoffset="1500"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="1500"
            to="0"
            dur="5s"
            repeatCount="indefinite"
          />
        </polyline>
      </svg>

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-[380px] p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl"
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              className="w-full p-3 mt-1 rounded-lg bg-white/10 text-white border border-white/20 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg mt-1">
              <input
                type={showPass ? "text" : "password"}
                className="w-full p-3 bg-transparent text-white outline-none"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
              <button
                type="button"
                className="px-3 text-gray-300"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="accent-green-500" />
              <p className="text-gray-300">Remember me</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-green-400 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg bg-green-500 hover:bg-green-600 text-black font-semibold flex justify-center"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
              />
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-white/20"></div>
          <p className="text-gray-300 text-sm px-3">OR</p>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        <button className="flex items-center gap-3 bg-white/20 p-3 rounded-lg hover:bg-white/30 transition text-white w-full">
          <Mail size={18} /> Login with Google
        </button>

        <p className="text-center text-gray-300 text-sm mt-4">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-green-400 cursor-pointer hover:underline"
          >
            Register now
          </span>
        </p>
      </motion.div>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { Eye, EyeOff, Mail } from "lucide-react";

// // 🔐 Login API
// const LOGIN_API = "http://localhost:5000/api/auth/login";

// // 🔐 Axios Auth Header Helper
// const setAxiosAuthHeader = (token) => {
//   if (token) {
//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete axios.defaults.headers.common["Authorization"];
//   }
// };

// export default function Login() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [pass, setPass] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ Restore token after refresh
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token && token !== "undefined") {
//       setAxiosAuthHeader(token);
//     }
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!email || !pass) {
//       setError("All fields are required");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const res = await axios.post(LOGIN_API, {
//         email: email.trim().toLowerCase(),
//         password: pass.trim(),
//       });

//       const { token, role, username } = res.data;

//       // ❗ HARD VALIDATION (prevents undefined bugs)
//       if (!token || !role) {
//         throw new Error("Invalid login response from server");
//       }

//       // ✅ Store securely
//       localStorage.setItem("token", token);
//       localStorage.setItem("role", role);
//       localStorage.setItem("username", username || email);

//       // ✅ Attach token globally
//       setAxiosAuthHeader(token);

//       // ✅ Navigate by role
//       if (role === "admin") {
//         navigate("/admin");
//       } else {
//         navigate("/");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.msg ||
//           err.message ||
//           "Login failed. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full h-screen flex items-center justify-center bg-[#0B0F17]">
//       <motion.div
//         initial={{ opacity: 0, y: 35 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="w-[380px] p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl"
//       >
//         <h2 className="text-3xl font-semibold text-white text-center mb-6">
//           Welcome Back 👋
//         </h2>

//         <form onSubmit={handleLogin} className="flex flex-col gap-4">
//           {/* Email */}
//           <div>
//             <label className="text-sm text-gray-300">Email</label>
//             <input
//               type="email"
//               className="w-full p-3 mt-1 rounded-lg bg-white/10 text-white border border-white/20 outline-none"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="text-sm text-gray-300">Password</label>
//             <div className="flex items-center bg-white/10 border border-white/20 rounded-lg mt-1">
//               <input
//                 type={showPass ? "text" : "password"}
//                 className="w-full p-3 bg-transparent text-white outline-none"
//                 value={pass}
//                 onChange={(e) => setPass(e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 className="px-3 text-gray-300"
//                 onClick={() => setShowPass(!showPass)}
//               >
//                 {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Remember & Forgot */}
//           <div className="flex justify-between items-center text-sm">
//             <div className="flex items-center gap-2">
//               <input type="checkbox" className="accent-green-500" />
//               <p className="text-gray-300">Remember me</p>
//             </div>
//             <button
//               type="button"
//               onClick={() => navigate("/forgot-password")}
//               className="text-green-400 hover:underline"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           {error && <p className="text-red-400 text-sm">{error}</p>}

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full p-3 rounded-lg bg-green-500 hover:bg-green-600 text-black font-semibold flex justify-center"
//           >
//             {loading ? (
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
//                 className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
//               />
//             ) : (
//               "Login"
//             )}
//           </button>
//         </form>

//         {/* OR */}
//         <div className="flex items-center my-4">
//           <div className="flex-1 h-px bg-white/20"></div>
//           <p className="text-gray-300 text-sm px-3">OR</p>
//           <div className="flex-1 h-px bg-white/20"></div>
//         </div>

//         {/* Social */}
//         <button className="flex items-center gap-3 bg-white/20 p-3 rounded-lg hover:bg-white/30 transition text-white w-full">
//           <Mail size={18} /> Login with Google
//         </button>

//         {/* Register */}
//         <p className="text-center text-gray-300 text-sm mt-4">
//           Don&apos;t have an account?{" "}
//           <span
//             onClick={() => navigate("/register")}
//             className="text-green-400 cursor-pointer hover:underline"
//           >
//             Register now
//           </span>
//         </p>
//       </motion.div>
//     </div>
//   );
// }

// // frontend/src/Login.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios"; // 🛑 API Communication
// import { motion } from "framer-motion";
// import { Eye, EyeOff, Mail } from "lucide-react";

// // 🛑 API Path for Login (Update port if necessary)
// const LOGIN_API = "http://localhost:5000/api/auth/login";

// // Helper function added directly to Login.js for immediate fix
// const setAxiosAuthHeader = (token) => {
//   if (token) {
//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete axios.defaults.headers.common["Authorization"];
//   }
// };

// export default function Login() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [pass, setPass] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!email || !pass) {
//       setError("All fields are required");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       // 1. AXIOS CALL to the Backend
//       const res = await axios.post(LOGIN_API, {
//         email: email.trim().toLowerCase(),
//         password: pass.trim(),
//       });

//       const token = res.data.token;
//       const role = res.data.role;

//       // 2. SUCCESS: Save Security Tokens
//       localStorage.setItem("token", token);
//       localStorage.setItem("role", role);
//       localStorage.setItem("username", res.data.username || email);

//       // 🛑 CRITICAL FIX: Immediately attach the token to ALL Axios requests
//       setAxiosAuthHeader(token);

//       // 3. Navigate
//       setTimeout(() => {
//         if (role === "admin") {
//           navigate("/admin");
//         } else {
//           navigate("/"); // Navigate regular users to the homepage
//         }
//       }, 100);
//     } catch (err) {
//       // 4. ERROR: Handle specific messages from backend
//       const errMsg =
//         err.response?.data?.msg || "Login failed. Network or server error.";
//       setError(errMsg);
//       setLoading(false);
//     }
//   };

//   return (
//     // ... (rest of the component JSX remains the same)
//     <div className="relative w-full h-screen flex items-center justify-center bg-[#0B0F17] overflow-hidden">
//       {/* ... */}
//       <motion.div
//         initial={{ opacity: 0, y: 35 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="relative z-10 w-[380px] p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl border border-white/20"
//       >
//         <h2 className="text-3xl font-semibold text-white text-center mb-6">
//           Welcome Back 👋
//         </h2>

//         <form onSubmit={handleLogin} className="flex flex-col gap-4">
//           {/* ... (input fields) ... */}
//           <div>
//             <label className="text-sm text-gray-300">Email</label>
//             <input
//               type="email"
//               className={`w-full p-3 mt-1 rounded-lg bg-white/10 text-white outline-none
//                             ${
//                               error
//                                 ? "border border-red-500"
//                                 : "border border-white/20"
//                             }`}
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="text-sm text-gray-300">Password</label>
//             <div
//               className={`flex items-center bg-white/10 border
//                             ${
//                               error ? "border-red-500" : "border-white/20"
//                             } rounded-lg mt-1`}
//             >
//               <input
//                 type={showPass ? "text" : "password"}
//                 className="w-full p-3 bg-transparent text-white outline-none"
//                 value={pass}
//                 onChange={(e) => setPass(e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 className="px-3 text-gray-300"
//                 onClick={() => setShowPass(!showPass)}
//               >
//                 {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* ... (remember, forgot, error message) ... */}
//           <div className="flex justify-between items-center text-sm mt-1">
//             <div className="flex items-center gap-2">
//               <input type="checkbox" className="accent-green-500" />
//               <p className="text-gray-300">Remember me</p>
//             </div>
//             <button
//               type="button"
//               onClick={() => navigate("/forgot-password")}
//               className="text-green-400 hover:underline"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           {error && <p className="text-red-400 text-sm">{error}</p>}

//           {/* Login Button */}
//           <button
//             type="submit"
//             className="w-full p-3 rounded-lg bg-green-500 hover:bg-green-600 text-black font-semibold mt-2 transition flex items-center justify-center"
//             disabled={loading}
//           >
//             {loading ? (
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
//                 className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
//               />
//             ) : (
//               "Login"
//             )}
//           </button>
//         </form>
//         {/* ... (OR divider, social logins, register link) ... */}
//         <div className="flex items-center my-4">
//           <div className="flex-1 h-px bg-white/20"></div>
//           <p className="text-gray-300 text-sm px-3">OR</p>
//           <div className="flex-1 h-px bg-white/20"></div>
//         </div>

//         <div className="flex flex-col gap-3">
//           <button className="flex items-center gap-3 bg-white/20 p-3 rounded-lg hover:bg-white/30 transition text-white">
//             <Mail size={18} /> Login with Google
//           </button>
//         </div>

//         <p className="text-center text-gray-300 text-sm mt-4">
//           Don't have an account?{" "}
//           <span
//             onClick={() => navigate("/register")}
//             className="text-green-400 cursor-pointer hover:underline"
//           >
//             Register now
//           </span>
//         </p>
//       </motion.div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Eye, EyeOff, Github, Mail } from "lucide-react";
// import { addAdminLog, addAdminNotification } from "./admin/helpers";
// // NEW

// export default function Login() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [pass, setPass] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ----------- ADMIN STATIC ACCOUNT -------------
//   const admin = {
//     email: "admin@site.com",
//     password: "admin123",
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();

//     if (!email || !pass) {
//       setError("All fields are required");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     const cleanEmail = email.trim().toLowerCase();
//     const cleanPass = pass.trim();

//     setTimeout(() => {
//       // ---------- ADMIN LOGIN ----------
//       if (
//         cleanEmail === admin.email.toLowerCase() &&
//         cleanPass === admin.password
//       ) {
//         localStorage.setItem("loggedIn", "true");
//         localStorage.setItem("role", "admin");
//         localStorage.setItem("username", "Admin");

//         // Add log & notification
//         addAdminLog("Admin logged in");
//         addAdminNotification("Admin logged in successfully");

//         navigate("/admin");
//         return;
//       }

//       // ---------- USER LOGIN ----------
//       const stored = JSON.parse(localStorage.getItem("users")) || [];

//       const found = stored.find(
//         (u) =>
//           u.email.trim().toLowerCase() === cleanEmail &&
//           u.password.trim() === cleanPass
//       );

//       if (!found) {
//         setError("Invalid email or password");
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem("loggedIn", "true");
//       localStorage.setItem("role", "user");
//       localStorage.setItem("username", found.email);

//       // Add log & notification for user
//       addAdminLog(`User ${found.email} logged in`);
//       addAdminNotification(`User ${found.email} logged in`);

//       navigate("/");
//     }, 1200);
//   };

//   return (
//     <div className="relative w-full h-screen flex items-center justify-center bg-[#0B0F17] overflow-hidden">
//       {/* Background SVG Animation */}
//       <motion.svg
//         className="absolute top-0 left-0 w-full h-full opacity-20"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.2 }}
//         transition={{ duration: 1.5 }}
//       >
//         <motion.polyline
//           points="0,300 200,200 400,350 600,150 800,300 1000,180"
//           fill="none"
//           stroke="#22c55e"
//           strokeWidth="3"
//           initial={{ pathLength: 0 }}
//           animate={{ pathLength: 1 }}
//           transition={{
//             repeat: Infinity,
//             duration: 6,
//             ease: "easeInOut",
//           }}
//         />
//       </motion.svg>

//       {/* LOGIN CARD */}
//       <motion.div
//         initial={{ opacity: 0, y: 35 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="relative z-10 w-[380px] p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl border border-white/20"
//       >
//         <h2 className="text-3xl font-semibold text-white text-center mb-6">
//           Welcome Back 👋
//         </h2>

//         <form onSubmit={handleLogin} className="flex flex-col gap-4">
//           {/* Email */}
//           <div>
//             <label className="text-sm text-gray-300">Email</label>
//             <input
//               type="email"
//               className={`w-full p-3 mt-1 rounded-lg bg-white/10 text-white outline-none
//                 ${error ? "border border-red-500" : "border border-white/20"}`}
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="text-sm text-gray-300">Password</label>
//             <div
//               className={`flex items-center bg-white/10 border
//               ${error ? "border-red-500" : "border-white/20"} rounded-lg mt-1`}
//             >
//               <input
//                 type={showPass ? "text" : "password"}
//                 className="w-full p-3 bg-transparent text-white outline-none"
//                 value={pass}
//                 onChange={(e) => setPass(e.target.value)}
//               />
//               <button
//                 type="button"
//                 className="px-3 text-gray-300"
//                 onClick={() => setShowPass(!showPass)}
//               >
//                 {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Remember + Forgot */}
//           <div className="flex justify-between items-center text-sm mt-1">
//             <div className="flex items-center gap-2">
//               <input type="checkbox" className="accent-green-500" />
//               <p className="text-gray-300">Remember me</p>
//             </div>

//             <button
//               type="button"
//               onClick={() => navigate("/forgot-password")}
//               className="text-green-400 hover:underline"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           {error && <p className="text-red-400 text-sm">{error}</p>}

//           {/* Login Button */}
//           <button
//             className="w-full p-3 rounded-lg bg-green-500 hover:bg-green-600 text-black font-semibold mt-2 transition flex items-center justify-center"
//             disabled={loading}
//           >
//             {loading ? (
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
//                 className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
//               />
//             ) : (
//               "Login"
//             )}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="flex items-center my-4">
//           <div className="flex-1 h-px bg-white/20"></div>
//           <p className="text-gray-300 text-sm px-3">OR</p>
//           <div className="flex-1 h-px bg-white/20"></div>
//         </div>

//         {/* Social */}
//         <div className="flex flex-col gap-3">
//           <button className="flex items-center gap-3 bg-white/20 p-3 rounded-lg hover:bg-white/30 transition text-white">
//             <Mail size={18} /> Login with Google
//           </button>

//           <button className="flex items-center gap-3 bg-white/20 p-3 rounded-lg hover:bg-white/30 transition text-white">
//             <Github size={18} /> Login with GitHub
//           </button>
//         </div>

//         {/* Register */}
//         <p className="text-center text-gray-300 text-sm mt-4">
//           Don't have an account?{" "}
//           <span
//             onClick={() => navigate("/register")}
//             className="text-green-400 cursor-pointer hover:underline"
//           >
//             Register now
//           </span>
//         </p>
//       </motion.div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Eye, EyeOff, Github, Mail } from "lucide-react";

// export default function Login() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [pass, setPass] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ----------- ADMIN STATIC ACCOUNT -------------
//   const admin = {
//     email: "admin@site.com",
//     password: "admin123",
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();

//     if (!email || !pass) {
//       setError("All fields are required");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     // Normalize input
//     const cleanEmail = email.trim().toLowerCase();
//     const cleanPass = pass.trim();

//     setTimeout(() => {
//       // ---------- ADMIN LOGIN ----------
//       if (
//         cleanEmail === admin.email.toLowerCase() &&
//         cleanPass === admin.password
//       ) {
//         localStorage.setItem("loggedIn", "true");
//         localStorage.setItem("role", "admin");
//         localStorage.setItem("username", "Admin");
//         navigate("/admin");
//         return;
//       }

//       // ---------- USER LOGIN ----------
//       const stored = JSON.parse(localStorage.getItem("users")) || [];

//       const found = stored.find(
//         (u) =>
//           u.email.trim().toLowerCase() === cleanEmail &&
//           u.password.trim() === cleanPass
//       );

//       if (!found) {
//         setError("Invalid email or password");
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem("loggedIn", "true");
//       localStorage.setItem("role", "user");
//       localStorage.setItem("username", found.email);

//       navigate("/");
//     }, 1200);
//   };

//   return (
//     <div className="relative w-full h-screen flex items-center justify-center bg-[#0B0F17] overflow-hidden">
//       {/* Background SVG Animation */}
//       <motion.svg
//         className="absolute top-0 left-0 w-full h-full opacity-20"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.2 }}
//         transition={{ duration: 1.5 }}
//       >
//         <motion.polyline
//           points="0,300 200,200 400,350 600,150 800,300 1000,180"
//           fill="none"
//           stroke="#22c55e"
//           strokeWidth="3"
//           initial={{ pathLength: 0 }}
//           animate={{ pathLength: 1 }}
//           transition={{
//             repeat: Infinity,
//             duration: 6,
//             ease: "easeInOut",
//           }}
//         />
//       </motion.svg>

//       {/* LOGIN CARD */}
//       <motion.div
//         initial={{ opacity: 0, y: 35 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="relative z-10 w-[380px] p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl border border-white/20"
//       >
//         <h2 className="text-3xl font-semibold text-white text-center mb-6">
//           Welcome Back 👋
//         </h2>

//         <form onSubmit={handleLogin} className="flex flex-col gap-4">
//           {/* Email */}
//           <div>
//             <label className="text-sm text-gray-300">Email</label>
//             <input
//               type="email"
//               className={`w-full p-3 mt-1 rounded-lg bg-white/10 text-white outline-none
//                 ${error ? "border border-red-500" : "border border-white/20"}`}
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="text-sm text-gray-300">Password</label>
//             <div
//               className={`flex items-center bg-white/10 border
//               ${error ? "border-red-500" : "border-white/20"} rounded-lg mt-1`}
//             >
//               <input
//                 type={showPass ? "text" : "password"}
//                 className="w-full p-3 bg-transparent text-white outline-none"
//                 value={pass}
//                 onChange={(e) => setPass(e.target.value)}
//               />
//               <button
//                 type="button"
//                 className="px-3 text-gray-300"
//                 onClick={() => setShowPass(!showPass)}
//               >
//                 {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Remember + Forgot */}
//           <div className="flex justify-between items-center text-sm mt-1">
//             <div className="flex items-center gap-2">
//               <input type="checkbox" className="accent-green-500" />
//               <p className="text-gray-300">Remember me</p>
//             </div>

//             <button
//               type="button"
//               onClick={() => navigate("/forgot-password")}
//               className="text-green-400 hover:underline"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           {error && <p className="text-red-400 text-sm">{error}</p>}

//           {/* Login Button */}
//           <button
//             className="w-full p-3 rounded-lg bg-green-500 hover:bg-green-600 text-black font-semibold mt-2 transition flex items-center justify-center"
//             disabled={loading}
//           >
//             {loading ? (
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
//                 className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
//               />
//             ) : (
//               "Login"
//             )}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="flex items-center my-4">
//           <div className="flex-1 h-px bg-white/20"></div>
//           <p className="text-gray-300 text-sm px-3">OR</p>
//           <div className="flex-1 h-px bg-white/20"></div>
//         </div>

//         {/* Social */}
//         <div className="flex flex-col gap-3">
//           <button className="flex items-center gap-3 bg-white/20 p-3 rounded-lg hover:bg-white/30 transition text-white">
//             <Mail size={18} /> Login with Google
//           </button>

//           <button className="flex items-center gap-3 bg-white/20 p-3 rounded-lg hover:bg-white/30 transition text-white">
//             <Github size={18} /> Login with GitHub
//           </button>
//         </div>

//         {/* Register */}
//         <p className="text-center text-gray-300 text-sm mt-4">
//           Don't have an account?{" "}
//           <span
//             onClick={() => navigate("/register")}
//             className="text-green-400 cursor-pointer hover:underline"
//           >
//             Register now
//           </span>
//         </p>
//       </motion.div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Eye, EyeOff, Github, Mail } from "lucide-react";

// export default function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [pass, setPass] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = (e) => {
//     e.preventDefault();

//     if (!email || !pass) {
//       setError("All fields are required");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     setTimeout(() => {
//       const stored = JSON.parse(localStorage.getItem("users")) || [];
//       const found = stored.find(
//         (u) => u.email === email && u.password === pass
//       );

//       if (!found) {
//         setError("Invalid email or password");
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem("loggedIn", "true");
//       navigate("/");
//     }, 1200);
//   };

//   return (
//     <div className="relative w-full h-screen flex items-center justify-center bg-[#0B0F17] overflow-hidden">
//       {/* 🔥 Background SVG Animation */}
//       <motion.svg
//         className="absolute top-0 left-0 w-full h-full opacity-20"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.2 }}
//         transition={{ duration: 2 }}
//       >
//         <motion.polyline
//           points="0,300 200,200 400,350 600,150 800,300 1000,180"
//           fill="none"
//           stroke="#22c55e"
//           strokeWidth="3"
//           initial={{ pathLength: 0 }}
//           animate={{ pathLength: 1 }}
//           transition={{
//             repeat: Infinity,
//             duration: 6,
//             ease: "easeInOut",
//             repeatType: "loop",
//           }}
//         />
//       </motion.svg>

//       {/* LOGIN CARD */}
//       <motion.div
//         initial={{ opacity: 0, y: 35 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="relative z-10 w-[380px] p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl border border-white/20"
//       >
//         <motion.h2
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="text-3xl font-semibold text-white text-center mb-6"
//         >
//           Welcome Back 👋
//         </motion.h2>

//         {/* FORM */}
//         <form onSubmit={handleLogin} className="flex flex-col gap-4">
//           {/* Email */}
//           <div>
//             <label className="text-sm text-gray-300">Email</label>
//             <input
//               type="email"
//               className={`w-full p-3 mt-1 rounded-lg bg-white/10 text-white outline-none
//                 ${error ? "border border-red-500" : "border border-white/20"}
//               `}
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="text-sm text-gray-300">Password</label>
//             <div
//               className={`flex items-center bg-white/10 border
//                 ${error ? "border-red-500" : "border-white/20"}
//                 rounded-lg mt-1`}
//             >
//               <input
//                 type={showPass ? "text" : "password"}
//                 className="w-full p-3 bg-transparent text-white outline-none"
//                 value={pass}
//                 onChange={(e) => setPass(e.target.value)}
//               />
//               <button
//                 type="button"
//                 className="px-3 text-gray-300"
//                 onClick={() => setShowPass(!showPass)}
//               >
//                 {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Remember + Forgot */}
//           <div className="flex justify-between items-center text-sm mt-1">
//             <div className="flex items-center gap-2">
//               <input type="checkbox" className="accent-green-500" />
//               <p className="text-gray-300">Remember me</p>
//             </div>

//             {/* ✔ FIXED FORGOT PASSWORD BUTTON */}
//             <button
//               type="button"
//               onClick={() => navigate("/forgot-password")}
//               className="text-green-400 hover:underline"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           {/* Error */}
//           {error && <p className="text-red-400 text-sm">{error}</p>}

//           {/* Login button */}
//           <button
//             className="w-full p-3 rounded-lg bg-green-500 hover:bg-green-600 text-black font-semibold mt-2 transition flex items-center justify-center"
//             disabled={loading}
//           >
//             {loading ? (
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
//                 className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
//               />
//             ) : (
//               "Login"
//             )}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="flex items-center my-4">
//           <div className="flex-1 h-px bg-white/20"></div>
//           <p className="text-gray-300 text-sm px-3">OR</p>
//           <div className="flex-1 h-px bg-white/20"></div>
//         </div>

//         {/* Social */}
//         <div className="flex flex-col gap-3">
//           <button className="flex items-center gap-3 bg-white/20 p-3 rounded-lg hover:bg-white/30 transition text-white">
//             <Mail size={18} /> Login with Google
//           </button>

//           <button className="flex items-center gap-3 bg-white/20 p-3 rounded-lg hover:bg-white/30 transition text-white">
//             <Github size={18} /> Login with GitHub
//           </button>
//         </div>

//         {/* Register */}
//         <p className="text-center text-gray-300 text-sm mt-4">
//           Don't have an account?{" "}
//           <span
//             onClick={() => navigate("/register")}
//             className="text-green-400 cursor-pointer hover:underline"
//           >
//             Register now
//           </span>
//         </p>
//       </motion.div>
//     </div>
//   );
// }

// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { motion } from "framer-motion";
// // import { Eye, EyeOff, Github, Mail } from "lucide-react";

// // export default function Login() {
// //   const navigate = useNavigate();
// //   const [email, setEmail] = useState("");
// //   const [pass, setPass] = useState("");
// //   const [showPass, setShowPass] = useState(false);
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const handleLogin = (e) => {
// //     e.preventDefault();
// //     if (!email || !pass) {
// //       setError("All fields are required");
// //       return;
// //     }

// //     setError("");
// //     setLoading(true);

// //     setTimeout(() => {
// //       const stored = JSON.parse(localStorage.getItem("users")) || [];
// //       const found = stored.find(
// //         (u) => u.email === email && u.password === pass
// //       );

// //       if (!found) {
// //         setError("Invalid email or password");
// //         setLoading(false);
// //         return;
// //       }

// //       localStorage.setItem("loggedIn", "true");
// //       navigate("/");
// //     }, 1200);
// //   };

// //   return (
// //     <div className="relative w-full h-screen flex items-center justify-center bg-[#0B0F17] overflow-hidden">
// //       {/* 🔥 Animated SVG Background */}
// //       <motion.svg
// //         className="absolute top-0 left-0 w-full h-full opacity-20"
// //         initial={{ opacity: 0 }}
// //         animate={{ opacity: 0.2 }}
// //         transition={{ duration: 2 }}
// //       >
// //         <motion.polyline
// //           points="0,300 200,200 400,350 600,150 800,300 1000,180"
// //           fill="none"
// //           stroke="#22c55e"
// //           strokeWidth="3"
// //           initial={{ pathLength: 0 }}
// //           animate={{ pathLength: 1 }}
// //           transition={{
// //             repeat: Infinity,
// //             duration: 6,
// //             ease: "easeInOut",
// //             repeatType: "loop",
// //           }}
// //         />
// //       </motion.svg>

// //       {/* LOGIN CARD */}
// //       <motion.div
// //         initial={{ opacity: 0, y: 35 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.6 }}
// //         className="relative z-10 w-[380px] p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl border border-white/20"
// //       >
// //         {/* Heading */}
// //         <motion.h2
// //           initial={{ opacity: 0, y: 10 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ delay: 0.1 }}
// //           className="text-3xl font-semibold text-white text-center mb-6"
// //         >
// //           Welcome Back 👋
// //         </motion.h2>

// //         {/* Form */}
// //         <form onSubmit={handleLogin} className="flex flex-col gap-4">
// //           {/* Email */}
// //           <motion.div
// //             initial={{ opacity: 0, x: -10 }}
// //             animate={{ opacity: 1, x: 0 }}
// //             transition={{ delay: 0.2 }}
// //           >
// //             <label className="text-sm text-gray-300">Email</label>
// //             <input
// //               type="email"
// //               className={`w-full p-3 mt-1 rounded-lg bg-white/10 text-white outline-none
// //                 ${error ? "border border-red-500" : "border border-white/20"}
// //               `}
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //             />
// //           </motion.div>

// //           {/* Password */}
// //           <motion.div
// //             initial={{ opacity: 0, x: -10 }}
// //             animate={{ opacity: 1, x: 0 }}
// //             transition={{ delay: 0.3 }}
// //           >
// //             <label className="text-sm text-gray-300">Password</label>
// //             <div
// //               className={`flex items-center bg-white/10 border
// //                 ${error ? "border-red-500" : "border-white/20"}
// //                 rounded-lg mt-1`}
// //             >
// //               <input
// //                 type={showPass ? "text" : "password"}
// //                 className="w-full p-3 bg-transparent text-white outline-none"
// //                 value={pass}
// //                 onChange={(e) => setPass(e.target.value)}
// //               />
// //               <button
// //                 type="button"
// //                 className="px-3 text-gray-300"
// //                 onClick={() => setShowPass(!showPass)}
// //               >
// //                 {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
// //               </button>
// //             </div>
// //           </motion.div>

// //           {/* Remember Me */}
// //           <motion.div
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             transition={{ delay: 0.35 }}
// //             className="flex items-center gap-2 mt-1"
// //           >
// //             <input type="checkbox" className="accent-green-500" />
// //             <p className="text-gray-300 text-sm">Remember me</p>
// //           </motion.div>

// //           {/* Error Message */}
// //           {error && (
// //             <motion.p
// //               initial={{ opacity: 0 }}
// //               animate={{ opacity: 1 }}
// //               className="text-red-400 text-sm"
// //             >
// //               {error}
// //             </motion.p>
// //           )}

// //           {/* Login Button */}
// //           <motion.button
// //             whileTap={{ scale: 0.95 }}
// //             className="w-full p-3 rounded-lg bg-green-500 hover:bg-green-600 text-black font-semibold mt-2 transition flex items-center justify-center"
// //             disabled={loading}
// //           >
// //             {loading ? (
// //               <motion.div
// //                 animate={{ rotate: 360 }}
// //                 transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
// //                 className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
// //               />
// //             ) : (
// //               "Login"
// //             )}
// //           </motion.button>
// //         </form>

// //         {/* Divider */}
// //         <div className="flex items-center my-4">
// //           <div className="flex-1 h-px bg-white/20"></div>
// //           <p className="text-gray-300 text-sm px-3">OR</p>
// //           <div className="flex-1 h-px bg-white/20"></div>
// //         </div>

// //         {/* Social Login */}
// //         <motion.div
// //           initial={{ opacity: 0, y: 8 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ delay: 0.5 }}
// //           className="flex flex-col gap-3"
// //         >
// //           <button className="flex items-center gap-3 bg-white/20 p-3 rounded-lg hover:bg-white/30 transition text-white">
// //             <Mail size={18} /> Login with Google
// //           </button>

// //           <button className="flex items-center gap-3 bg-white/20 p-3 rounded-lg hover:bg-white/30 transition text-white">
// //             <Github size={18} /> Login with GitHub
// //           </button>
// //         </motion.div>

// //         {/* Register Link */}
// //         <motion.p
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           transition={{ delay: 0.6 }}
// //           className="text-center text-gray-300 text-sm mt-4"
// //         >
// //           Don't have an account?{" "}
// //           <span
// //             onClick={() => navigate("/register")}
// //             className="text-green-400 cursor-pointer hover:underline"
// //           >
// //             Register now
// //           </span>
// //         </motion.p>
// //       </motion.div>
// //     </div>
// //   );
// // }
