// src/admin/AdminDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Shield,
  Lock,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

// Assuming your admin routes for fetching data are correct
const API = "http://localhost:5000/api/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    admins: 0,
    blocked: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all users using the existing endpoint
      const res = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const users = res.data;

      // Calculate statistics based on the fetched data
      setStats({
        total: users.length,
        verified: users.filter((u) => u.emailVerified).length,
        admins: users.filter((u) => u.isAdmin).length,
        blocked: users.filter((u) => u.blocked).length,
      });
    } catch (err) {
      console.error("Error fetching analytics:", err);
      // Handle specific status codes if needed (e.g., 401 Unauthorized)
      setError(err.response?.data?.msg || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAnalytics();
    } else {
      setError("Authentication token missing. Please log in.");
      setLoading(false);
    }
  }, [token]);

  // --- UI CONFIGURATION ---

  const statCards = [
    {
      label: "Total Users",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Verified Users",
      value: stats.verified,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Admins",
      value: stats.admins,
      icon: Shield,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Blocked Users",
      value: stats.blocked,
      icon: Lock,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  // --- RENDERING STATES ---

  if (error) {
    return (
      <div className="p-10 min-h-screen bg-gray-50 text-center flex flex-col items-center justify-center">
        <AlertTriangle size={32} className="text-red-500 mb-4" />
        <h2 className="text-xl font-medium text-red-600">Error Loading Data</h2>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-10 min-h-screen bg-gray-50 text-center flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-500" />
        <p className="ml-3 text-lg text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  // --- MAIN DASHBOARD VIEW ---

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="w-full">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Analytics Dashboard
          </h1>
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
          >
            <RefreshCw size={16} className="text-gray-500" />
            Refresh Data
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className={`p-6 rounded-xl shadow-lg border border-gray-200 transition duration-300 transform hover:scale-[1.02] ${card.bg}`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  {card.label}
                </h2>
                <card.icon size={24} className={card.color} />
              </div>
              <p className={`mt-2 text-4xl font-extrabold ${card.color}`}>
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* The Recent Activity section has been completely removed */}
      </div>
    </div>
  );
}
// // src/admin/AdminDashboard.js
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { getUsers } from "./admin/helpers";

// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const updateUsers = () => setUsers(getUsers());
//     updateUsers();
//     window.addEventListener("usersUpdated", updateUsers);
//     return () => window.removeEventListener("usersUpdated", updateUsers);
//   }, []);

//   const stats = {
//     total: users.length,
//     verified: users.filter((u) => u.emailVerified).length,
//     admins: users.filter((u) => u.isAdmin).length,
//     blocked: users.filter((u) => u.blocked).length,
//   };

//   return (
//     <div className="p-10 min-h-screen bg-gray-900 text-white">
//       <h1 className="text-3xl font-bold mb-6">Admin Analytics</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//         {[
//           { label: "Total Users", value: stats.total },
//           { label: "Verified Users", value: stats.verified },
//           { label: "Admins", value: stats.admins },
//           { label: "Blocked", value: stats.blocked },
//         ].map((card, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.1 }}
//             className="p-6 rounded-xl bg-[#1f2633] shadow-lg border border-white/10 hover:bg-[#252d3b]"
//           >
//             <h2 className="text-xl font-semibold">{card.label}</h2>
//             <p className="mt-2 text-3xl font-bold text-green-400">
//               {card.value}
//             </p>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const updateUsers = () => {
//       const data = JSON.parse(localStorage.getItem("users") || "[]");
//       setUsers(data);
//     };
//     updateUsers();
//     const interval = setInterval(updateUsers, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const stats = {
//     total: users.length,
//     verified: users.filter((u) => u.emailVerified).length,
//     admins: users.filter((u) => u.isAdmin).length,
//     blocked: users.filter((u) => u.blocked).length,
//   };

//   return (
//     <div className="p-10 min-h-screen bg-gray-900 text-white">
//       <h1 className="text-3xl font-bold mb-6">Admin Analytics</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//         {[
//           { label: "Total Users", value: stats.total },
//           { label: "Verified Users", value: stats.verified },
//           { label: "Admins", value: stats.admins },
//           { label: "Blocked", value: stats.blocked },
//         ].map((card, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.1 }}
//             className="p-6 rounded-xl bg-[#1f2633] shadow-lg border border-white/10 hover:bg-[#252d3b] transition"
//           >
//             <h2 className="text-xl font-semibold">{card.label}</h2>
//             <p className="mt-2 text-3xl font-bold text-green-400">
//               {card.value}
//             </p>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }
