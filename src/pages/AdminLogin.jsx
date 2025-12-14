// // src/admin/AdminLogin.js

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios"; // 🛑 Use axios for API calls
// import { motion } from "framer-motion";
// import { Eye, EyeOff, Loader2 } from "lucide-react"; // 🎯 Added Loader2

// // 🛑 IMPORTANT: This API path must match your backend's port and route
// const API = "http://localhost:5000/api/auth/login";

// export default function AdminLogin() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [pass, setPass] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false); // 🎯 State for loading

//   // Removed useEffect(initAdmin) because backend handles credentials

//   const handleLogin = async (e) => {
//     // 🛑 Must be async
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       // 🛑 The API Call to your backend
//       const res = await axios.post(API, {
//         email,
//         password: pass,
//       });

//       // ✅ SAVE JWT and Role returned from the API
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("role", res.data.role);

//       navigate("/admin");
//     } catch (err) {
//       // 🛑 Display the error message from your backend (e.g., "Invalid credentials")
//       const errMsg =
//         err.response?.data?.msg || "Login failed. Network or server error.";
//       setError(errMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full h-screen flex items-center justify-center bg-[#080c12]">
//       <motion.div
//         className="w-[380px] p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl"
//         // Added motion props for transition
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h2 className="text-center text-3xl font-bold text-white mb-6">
//           Admin Portal 🔐
//         </h2>

//         <form onSubmit={handleLogin} className="flex flex-col gap-4">
//           <input
//             type="email"
//             placeholder="Admin Email"
//             className="p-3 rounded-lg bg-white/10 text-white border border-transparent focus:border-blue-500 focus:outline-none transition"
//             onChange={(e) => setEmail(e.target.value)}
//             value={email} // Added value binding
//             required
//           />

//           <div className="flex items-center bg-white/10 rounded-lg border border-transparent focus-within:border-blue-500 transition">
//             <input
//               type={showPass ? "text" : "password"}
//               placeholder="Password"
//               className="p-3 flex-1 bg-transparent text-white focus:outline-none"
//               onChange={(e) => setPass(e.target.value)}
//               value={pass} // Added value binding
//               required
//             />
//             <button
//               type="button" // Correct button type
//               className="px-3 text-gray-300 hover:text-white"
//               onClick={() => setShowPass(!showPass)}
//             >
//               {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <p className="text-red-400 text-sm p-2 bg-red-900/30 rounded">
//               {error}
//             </p>
//           )}

//           <button
//             // 🛑 CRITICAL FIX: Ensure button explicitly submits the form
//             type="submit"
//             disabled={loading} // 🎯 Disable while loading
//             className={`p-3 rounded-lg mt-3 font-semibold transition flex items-center justify-center gap-2
//               ${
//                 loading
//                   ? "bg-green-700/50 cursor-not-allowed"
//                   : "bg-green-600 hover:bg-green-700"
//               }`}
//           >
//             {loading ? (
//               <>
//                 <Loader2 size={20} className="animate-spin" />
//                 Authenticating...
//               </>
//             ) : (
//               "Login"
//             )}
//           </button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { Eye, EyeOff, Loader2 } from "lucide-react"; // 🎯 Added Loader2 for better loading feedback

// const API = "http://localhost:5000/api/auth/login";

// export default function AdminLogin() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [pass, setPass] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   // Improved error handling state (used for clarity)
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     // 🛑 CRITICAL: e.preventDefault() is here, so the issue must be button/form structure.
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await axios.post(API, {
//         email,
//         password: pass,
//       });

//       // ✅ SAVE JWT
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("role", res.data.role);

//       navigate("/admin");
//     } catch (err) {
//       // 🛑 Display a better error message if one is available from the server
//       const errMsg =
//         err.response?.data?.msg ||
//         "Login failed. Check server status or credentials.";
//       setError(errMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full h-screen flex items-center justify-center bg-[#080c12]">
//       <motion.div
//         className="w-[380px] p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/50"
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h2 className="text-center text-3xl font-bold text-white mb-6">
//           Admin Portal 🔐
//         </h2>

//         <form onSubmit={handleLogin} className="flex flex-col gap-4">
//           <input
//             type="email"
//             placeholder="Admin Email"
//             className="p-3 rounded-lg bg-white/10 text-white border border-transparent focus:border-blue-500 focus:outline-none transition"
//             onChange={(e) => setEmail(e.target.value)}
//             // 🎯 Added value and required attributes for better form semantics
//             value={email}
//             required
//           />

//           <div className="flex items-center bg-white/10 rounded-lg border border-transparent focus-within:border-blue-500 transition">
//             <input
//               type={showPass ? "text" : "password"}
//               placeholder="Password"
//               className="p-3 flex-1 bg-transparent text-white focus:outline-none"
//               onChange={(e) => setPass(e.target.value)}
//               // 🎯 Added value and required attributes
//               value={pass}
//               required
//             />
//             <button
//               // Ensure this remains type="button" so it doesn't trigger form submission
//               type="button"
//               className="px-3 text-gray-300 hover:text-white"
//               onClick={() => setShowPass(!showPass)}
//             >
//               {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <p className="text-red-400 text-sm p-2 bg-red-900/30 rounded">
//               {error}
//             </p>
//           )}

//           <button
//             // 🛑 CRITICAL FIX: Explicitly setting type="submit" ensures this button
//             // correctly triggers the form's onSubmit={handleLogin}.
//             type="submit"
//             disabled={loading}
//             // Improved loading and disabled styles
//             className={`p-3 rounded-lg mt-3 font-semibold transition flex items-center justify-center gap-2
//               ${
//                 loading
//                   ? "bg-green-700/50 cursor-not-allowed"
//                   : "bg-green-600 hover:bg-green-700"
//               }`}
//           >
//             {loading ? (
//               <>
//                 <Loader2 size={20} className="animate-spin" />
//                 Authenticating...
//               </>
//             ) : (
//               "Login"
//             )}
//           </button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }

// // src/admin/AdminLogin.js
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Eye, EyeOff } from "lucide-react";
// import {
//   addAdminLog,
//   addAdminNotification,
//   STORAGE_KEYS,
//   initAdmin,
// } from "./admin/helpers";

// export default function AdminLogin() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [pass, setPass] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     initAdmin();
//   }, []);

//   const handleLogin = (e) => {
//     e.preventDefault();
//     const adminData = JSON.parse(
//       localStorage.getItem(STORAGE_KEYS.ADMIN_CREDENTIALS)
//     );
//     if (!adminData) return setError("Admin account missing.");
//     if (adminData.email !== email || adminData.password !== pass)
//       return setError("Invalid credentials.");

//     localStorage.setItem("adminLoggedIn", "true");
//     addAdminLog(`Admin ${email} logged in`);
//     addAdminNotification(`Admin ${email} logged in`);
//     navigate("/admin");
//   };

//   return (
//     <div className="relative w-full h-screen flex items-center justify-center bg-[#080c12]">
//       <motion.div className="w-[380px] p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl">
//         <h2 className="text-center text-3xl font-bold text-white mb-6">
//           Admin Portal 🔐
//         </h2>
//         <form onSubmit={handleLogin} className="flex flex-col gap-4">
//           <input
//             type="email"
//             placeholder="Admin Email"
//             className="p-3 rounded-lg bg-white/10 text-white"
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <div className="flex items-center bg-white/10 rounded-lg border">
//             <input
//               type={showPass ? "text" : "password"}
//               placeholder="Password"
//               className="p-3 flex-1 bg-transparent text-white"
//               onChange={(e) => setPass(e.target.value)}
//             />
//             <button
//               type="button"
//               className="px-3 text-gray-300"
//               onClick={() => setShowPass(!showPass)}
//             >
//               {showPass ? <EyeOff /> : <Eye />}
//             </button>
//           </div>
//           {error && <p className="text-red-400">{error}</p>}
//           <button className="p-3 bg-green-500 rounded-lg mt-3 hover:bg-green-600">
//             Login
//           </button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

// 🛑 IMPORTANT: API path must match your backend's port and route
const API = "http://localhost:5000/api/auth/login";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. API Call to Backend
      const res = await axios.post(API, {
        email,
        password: pass,
      });

      // 2. Save Token and Role (Backend Confirmed Success)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // 3. 🛑 CRITICAL FIX: Add a small delay for localStorage/Router Sync
      // This ensures the protective router sees the token before redirecting.
      setTimeout(() => {
        navigate("/admin");
      }, 100);

      // We set loading false after the navigation is initiated
      setLoading(false);
    } catch (err) {
      // Handle login failure (e.g., Invalid credentials, blocked user)
      const errMsg =
        err.response?.data?.msg ||
        "Login failed. Check server status or credentials.";
      setError(errMsg);
      setLoading(false);
    }
    // Removed the external finally block as loading is handled inside try/catch
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-[#080c12]">
      <motion.div
        className="w-[380px] p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-center text-3xl font-bold text-white mb-6">
          Admin Portal 🔐
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="p-3 rounded-lg bg-white/10 text-white border border-transparent focus:border-blue-500 focus:outline-none transition"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />

          <div className="flex items-center bg-white/10 rounded-lg border border-transparent focus-within:border-blue-500 transition">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="p-3 flex-1 bg-transparent text-white focus:outline-none"
              onChange={(e) => setPass(e.target.value)}
              value={pass}
              required
            />
            <button
              type="button"
              className="px-3 text-gray-300 hover:text-white"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-400 text-sm p-2 bg-red-900/30 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`p-3 rounded-lg mt-3 font-semibold transition flex items-center justify-center gap-2
              ${
                loading
                  ? "bg-green-700/50 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Authenticating...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
