// src/admin/AdminLogs.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  Server,
  User,
  Loader2,
  RefreshCw,
  Key,
  Shield,
  AlertCircle,
} from "lucide-react";

const API = "http://localhost:5000/api/admin";

// --- LOG STYLING HELPER ---
const getLogStyles = (message) => {
  // Standardize the message case for checks
  const msg = message.toLowerCase(); // Define colors based on action type (assuming message contains keywords)

  if (
    msg.includes("delete") ||
    msg.includes("block") ||
    msg.includes("failed")
  ) {
    return {
      icon: <AlertCircle size={16} className="text-red-600" />,
      color: "text-red-600",
      badge: "bg-red-100",
    };
  }
  if (
    msg.includes("promote") ||
    msg.includes("admin") ||
    msg.includes("verified")
  ) {
    return {
      icon: <Shield size={16} className="text-purple-600" />,
      color: "text-purple-600",
      badge: "bg-purple-100",
    };
  }
  if (
    msg.includes("login") ||
    msg.includes("unblock") ||
    msg.includes("registration")
  ) {
    // 🎯 Added 'registration' for user activity
    return {
      icon: <Key size={16} className="text-blue-600" />,
      color: "text-blue-600",
      badge: "bg-blue-100",
    };
  } // Default style
  return {
    icon: <User size={16} className="text-gray-600" />,
    color: "text-gray-600",
    badge: "bg-gray-100",
  };
};
// --- END LOG STYLING HELPER ---

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming the backend has a GET /api/admin/logs endpoint
      const res = await axios.get(`${API}/logs`, authHeader);
      setLogs(res.data);
    } catch (err) {
      console.error("Error loading logs:", err);
      setError(
        err.response?.data?.msg || "Failed to load activity logs from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadLogs();
    } else {
      setError("Authentication token missing. Cannot load logs.");
      setLoading(false);
    }
  }, [token]); // Helper to format the time property from the backend

  const formatTime = (isoTime) => {
    if (!isoTime) return "N/A";
    return new Date(isoTime).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }; // --- RENDERING STATES --- // ... (omitted for brevity, assume error/loading states are unchanged)

  if (error) {
    return (
      <div className="p-10 min-h-screen bg-gray-50 text-center flex flex-col items-center justify-center">
        <AlertTriangle size={32} className="text-red-500 mb-4" />
        <h2 className="text-xl font-medium text-red-600">Error Loading Logs</h2>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-10 min-h-screen bg-gray-50 text-center flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-500" />
        <p className="ml-3 text-lg text-gray-600">
          Fetching activity records...
        </p>
      </div>
    );
  } // --- MAIN LOGS VIEW ---

  return (
    <div className="bg-gray-50 min-h-screen p-8">
           {" "}
      <div className="w-full">
               {" "}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                   {" "}
          <h1 className="text-3xl font-bold text-gray-900">
                        System Activity Logs          {" "}
          </h1>
                   {" "}
          <button
            onClick={loadLogs}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
          >
                        <RefreshCw size={16} className="text-gray-500" />       
                Refresh          {" "}
          </button>
                 {" "}
        </header>
               {" "}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                   {" "}
          <div className="overflow-x-auto">
                       {" "}
            <table className="min-w-full divide-y divide-gray-200">
                           {" "}
              <thead className="bg-gray-50">
                               {" "}
                <tr>
                                    {/* 🎯 NEW COLUMN: Actor/Performer */}     
                             {" "}
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/5">
                                       {" "}
                    <div className="flex items-center gap-2">
                                            <User size={14} /> Performer        
                                 {" "}
                    </div>
                                     {" "}
                  </th>
                                   {" "}
                  {/* Action Type/Summary Column - Adjusted width */}           
                       {" "}
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-2/5">
                                       {" "}
                    <div className="flex items-center gap-2">
                                            Action Summary                    {" "}
                    </div>
                                     {" "}
                  </th>
                                   {" "}
                  {/* Time/Timestamp Column - Adjusted width */}               
                   {" "}
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/5">
                                       {" "}
                    <div className="flex items-center gap-2">
                                            <Clock size={14} /> Timestamp      
                                   {" "}
                    </div>
                                     {" "}
                  </th>
                                    {/* IP Address Column - Adjusted width */} 
                                 {" "}
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/5">
                                       {" "}
                    <div className="flex items-center gap-2">
                                            <Server size={14} /> Source IP      
                                   {" "}
                    </div>
                                     {" "}
                  </th>
                                 {" "}
                </tr>
                             {" "}
              </thead>
                           {" "}
              <tbody className="divide-y divide-gray-200 bg-white">
                               {" "}
                {logs.length === 0 ? (
                  <tr>
                                       {" "}
                    <td
                      colSpan={4} // 🎯 Updated colspan to 4
                      className="text-center p-6 text-gray-500 italic"
                    >
                                            No recent activity logs found in the
                      database.                    {" "}
                    </td>
                                     {" "}
                  </tr>
                ) : (
                  logs.map((log, i) => {
                    const styles = getLogStyles(
                      log.message || log.action || ""
                    );

                    // Safely access the email from the populated actorId field
                    const actorEmail = log.actorId?.email || "Static Admin";

                    return (
                      <motion.tr
                        key={log._id || i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className="hover:bg-gray-50"
                      >
                        {/* 🎯 NEW CELL: Performer/Actor */}
                        <td className="p-4 text-sm text-gray-900 font-medium">
                          <span
                            className={`font-semibold ${
                              log.message.includes("[ADMIN]")
                                ? "text-purple-600"
                                : "text-blue-600"
                            }`}
                          >
                            {actorEmail}
                          </span>
                        </td>
                                               {" "}
                        {/* Action Summary with Icon & Badge */}               
                               {" "}
                        <td className="p-4 text-sm text-gray-900 font-medium whitespace-normal">
                                                   {" "}
                          <div className="flex items-center gap-3">
                                                       {" "}
                            <div className={`p-2 rounded-full ${styles.badge}`}>
                                                            {styles.icon}       
                                                 {" "}
                            </div>
                                                       {" "}
                            <span className="font-semibold">
                                                           {" "}
                              {log.message || log.action || "System Event"}     
                                                   {" "}
                            </span>
                                                     {" "}
                          </div>
                                                 {" "}
                        </td>
                                                {/* Timestamp */}               
                               {" "}
                        <td className="p-4 text-sm text-gray-700 whitespace-nowrap">
                                                   {" "}
                          {formatTime(log.createdAt || log.time)}               
                                 {" "}
                        </td>
                                                {/* IP Address */}             
                                 {" "}
                        <td className="p-4 text-sm text-gray-700 whitespace-nowrap">
                                                    {log.ip || "N/A"}           
                                     {" "}
                        </td>
                                             {" "}
                      </motion.tr>
                    );
                  })
                )}
                             {" "}
              </tbody>
                         {" "}
            </table>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
}

// // src/admin/AdminLogs.js
// import React, { useState, useEffect } from "react";

// export default function AdminLogs() {
//   const [logs, setLogs] = useState([]);

//   const loadLogs = () =>
//     setLogs(JSON.parse(localStorage.getItem("adminLogs") || "[]").reverse());

//   useEffect(() => {
//     loadLogs();
//     window.addEventListener("logsUpdated", loadLogs);
//     return () => window.removeEventListener("logsUpdated", loadLogs);
//   }, []);

//   return (
//     <div className="p-6 min-h-screen bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6">Activity Logs</h1>
//       <div className="overflow-x-auto">
//         <table className="w-full border border-gray-200 rounded-lg shadow-sm">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-2 border">Action</th>
//               <th className="p-2 border">Time</th>
//               <th className="p-2 border">IP</th>
//             </tr>
//           </thead>
//           <tbody>
//             {logs.length === 0 ? (
//               <tr>
//                 <td colSpan={3} className="text-center p-3 text-gray-500">
//                   No Logs Yet.
//                 </td>
//               </tr>
//             ) : (
//               logs.map((log, i) => (
//                 <tr key={log.id || i} className="hover:bg-gray-100">
//                   <td className="border p-2">{log.action}</td>
//                   <td className="border p-2">{log.time}</td>
//                   <td className="border p-2">{log.ip || "N/A"}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";

// export default function AdminLogs() {
//   const [logs, setLogs] = useState([]);

//   // Function to load logs from localStorage
//   const loadLogs = () => {
//     const data = JSON.parse(localStorage.getItem("adminLogs") || "[]");
//     setLogs([...data].reverse()); // reverse without mutating original array
//   };

//   useEffect(() => {
//     loadLogs(); // initial load

//     // Optional: live update every 2 seconds
//     const interval = setInterval(loadLogs, 2000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="p-6 min-h-screen bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Activity Logs</h1>

//       <div className="overflow-x-auto">
//         <table className="w-full border border-gray-200 rounded-lg shadow-sm">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-2 border">Action</th>
//               <th className="p-2 border">Time</th>
//               <th className="p-2 border">IP</th>
//             </tr>
//           </thead>
//           <tbody>
//             {logs.length === 0 ? (
//               <tr>
//                 <td colSpan={3} className="text-center p-3 text-gray-500">
//                   No Logs Yet.
//                 </td>
//               </tr>
//             ) : (
//               logs.map((log, index) => (
//                 <tr
//                   key={log.id || index} // unique key if available
//                   className="hover:bg-gray-100 transition"
//                 >
//                   <td className="border p-2">{log.action}</td>
//                   <td className="border p-2">
//                     {new Date(log.time).toLocaleString()}
//                   </td>
//                   <td className="border p-2">{log.ip || "N/A"}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
