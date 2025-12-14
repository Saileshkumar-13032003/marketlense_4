import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  UserCheck,
  UserX,
  Trash2,
  Shield,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

// Backend API Base URL
const API = "http://localhost:5000/api/admin";

// --- STATUS BADGE CONFIGURATION ---
const STATUS_STYLES = {
  // Role Styles
  ADMIN: "bg-blue-100 text-blue-800",
  USER: "bg-gray-100 text-gray-800",
  // Verification Styles
  VERIFIED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  // Block Styles
  ACTIVE: "bg-green-500 text-white font-semibold",
  BLOCKED: "bg-red-500 text-white font-semibold",
};

// Helper component for uniform badges
const Badge = ({ type, text }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[type]}`}
  >
    {text}
  </span>
);

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  const token = localStorage.getItem("token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // 1. Function to Load Users
  const loadUsers = async () => {
    setLoadingData(true);
    setError("");
    try {
      const res = await axios.get(`${API}/users`, authHeader);
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users:", err);
      setError(err.response?.data?.msg || "Failed to load users");
    } finally {
      setLoadingData(false);
    }
  };

  // 2. Function to Handle Actions (Centralized Logic)
  const handleAction = async (userId, endpoint, successMsg) => {
    if (loadingAction) return;

    setLoadingAction(userId);
    setError("");

    try {
      const method = endpoint === "delete" ? axios.delete : axios.put;
      await method(`${API}/${endpoint}/${userId}`, {}, authHeader);
      loadUsers();
    } catch (err) {
      console.error(`Error performing action: ${endpoint}`, err);
      alert(
        `Action Failed: ${
          err.response?.data?.msg ||
          `Could not complete the request to ${endpoint}.`
        }`
      );
    } finally {
      setLoadingAction(null);
    }
  };

  // --- Specific Action Handlers ---
  const toggleBlock = (u) =>
    handleAction(
      u._id,
      u.blocked ? "unblock" : "block",
      `User ${u.blocked ? "unblocked" : "blocked"} successfully!`
    );
  const verifyUser = (userId) =>
    handleAction(userId, "verify", "User verified successfully!");
  const promoteUser = (userId) =>
    handleAction(userId, "makeAdmin", "User promoted to Admin successfully!");
  const deleteUser = (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action is irreversible."
      )
    )
      return;
    handleAction(userId, "delete", "User deleted successfully!");
  };
  // --- END Action Handlers ---

  useEffect(() => {
    loadUsers();
  }, []);

  // Helper for rendering action buttons
  const ActionButton = ({
    icon,
    onClick,
    title,
    color,
    userId,
    condition = true,
  }) => {
    if (!condition) return null;

    const isProcessing = loadingAction === userId;

    return (
      <button
        onClick={onClick}
        title={title}
        // Small, minimalist button style
        className={`p-2 rounded-full transition duration-150 ease-in-out text-white disabled:opacity-50 ${color}`}
        disabled={loadingAction !== null}
      >
        {/* Show a spinner if this specific user is being processed */}
        {isProcessing ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Loader2 size={16} />
          </motion.div>
        ) : (
          icon
        )}
      </button>
    );
  };

  // --- RENDERING LOGIC ---

  if (error) {
    return (
      <div className="p-10 min-h-screen bg-gray-50 text-center flex flex-col items-center justify-center">
        <AlertTriangle size={32} className="text-red-500 mb-4" />
        <h2 className="text-xl font-medium text-red-600">Error Loading Data</h2>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  if (loadingData && users.length === 0) {
    return (
      <div className="p-10 min-h-screen bg-gray-50 text-gray-500 text-center flex items-center justify-center text-xl">
        Loading user data...
      </div>
    );
  }

  return (
    // Main Container: Light Gray background, full height
    <div className="bg-gray-50 min-h-screen p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">User Directory</h1>
          <button
            onClick={loadUsers}
            disabled={loadingAction !== null || loadingData}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loadingData ? "animate-spin text-blue-500" : "text-gray-500"
              }
            />
            Refresh
          </button>
        </header>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((u, i) => (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02, duration: 0.2 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="p-4 text-sm text-gray-900 font-medium">
                      {u.email}
                    </td>

                    <td className="p-4 text-center">
                      <Badge
                        type={u.isAdmin ? "ADMIN" : "USER"}
                        text={u.isAdmin ? "Admin" : "User"}
                      />
                    </td>

                    <td className="p-4 text-center">
                      <Badge
                        type={u.emailVerified ? "VERIFIED" : "PENDING"}
                        text={u.emailVerified ? "Verified" : "Pending"}
                      />
                    </td>

                    <td className="p-4 text-center">
                      <Badge
                        type={u.blocked ? "BLOCKED" : "ACTIVE"}
                        text={u.blocked ? "Blocked" : "Active"}
                      />
                    </td>

                    <td className="p-4 flex gap-1 justify-center">
                      {/* Block/Unblock Button - Uses primary colors for clear action */}
                      <ActionButton
                        icon={
                          u.blocked ? (
                            <UserCheck size={16} />
                          ) : (
                            <UserX size={16} />
                          )
                        }
                        onClick={() => toggleBlock(u)}
                        title={u.blocked ? "Unblock User" : "Block User"}
                        color={
                          u.blocked
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }
                        userId={u._id}
                      />

                      {/* Verify Button */}
                      <ActionButton
                        icon={<UserCheck size={16} />}
                        onClick={() => verifyUser(u._id)}
                        title="Verify User Email"
                        color="bg-blue-600 hover:bg-blue-700"
                        userId={u._id}
                        condition={!u.emailVerified}
                      />

                      {/* Promote to Admin Button */}
                      <ActionButton
                        icon={<Shield size={16} />}
                        onClick={() => promoteUser(u._id)}
                        title="Promote to Admin"
                        color="bg-purple-600 hover:bg-purple-700"
                        userId={u._id}
                        condition={!u.isAdmin}
                      />

                      {/* Delete Button - Uses a neutral color for destructive action */}
                      <ActionButton
                        icon={<Trash2 size={16} />}
                        onClick={() => deleteUser(u._id)}
                        title="Delete User"
                        color="bg-gray-600 hover:bg-gray-700"
                        userId={u._id}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && !loadingData && (
            <div className="p-10 text-center text-gray-500">
              No users found in the database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";

// const API = "http://localhost:5000/api/admin";

// export default function AdminUsers() {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState("");

//   const token = localStorage.getItem("token");

//   const authHeader = {
//     headers: { Authorization: `Bearer ${token}` },
//   };

//   const loadUsers = async () => {
//     try {
//       const res = await axios.get(`${API}/users`, authHeader);
//       setUsers(res.data);
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to load users");
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   if (error)
//     return <div className="p-10 text-red-400 text-center">{error}</div>;

//   return (
//     <div className="p-10 min-h-screen bg-gray-900 text-white">
//       <h1 className="text-3xl font-bold mb-6">Admin – User Management</h1>

//       <table className="w-full bg-[#141922] rounded-xl overflow-hidden">
//         <thead className="bg-[#1f2633]">
//           <tr>
//             <th className="p-4 text-left">Email</th>
//             <th className="p-4 text-center">Role</th>
//             <th className="p-4 text-center">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((u, i) => (
//             <motion.tr
//               key={u._id}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: i * 0.05 }}
//             >
//               <td className="p-4">{u.email}</td>
//               <td className="p-4 text-center">
//                 {u.isAdmin ? "Admin" : "User"}
//               </td>
//               <td className="p-4 text-center">
//                 {u.blocked ? "Blocked" : "Active"}
//               </td>
//             </motion.tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// // src/admin/AdminUsers.js
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   addAdminLog,
//   addAdminNotification,
//   getUsers,
//   saveUsers,
// } from "./admin/helpers";

// export default function AdminUsers() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const updateUsers = () => setUsers(getUsers());
//     updateUsers();
//     window.addEventListener("usersUpdated", updateUsers);
//     return () => window.removeEventListener("usersUpdated", updateUsers);
//   }, []);

//   const deleteUser = (email) => {
//     if (!window.confirm("Delete this user?")) return;
//     const updated = users.filter((u) => u.email !== email);
//     saveUsers(updated);
//     addAdminLog(`Deleted user ${email}`);
//     addAdminNotification(`User ${email} deleted`);
//   };

//   const blockUser = (email) => {
//     const updated = users.map((u) =>
//       u.email === email ? { ...u, blocked: true } : u
//     );
//     saveUsers(updated);
//     addAdminLog(`Blocked user ${email}`);
//     addAdminNotification(`User ${email} blocked`);
//   };

//   const makeAdmin = (email) => {
//     const updated = users.map((u) =>
//       u.email === email ? { ...u, isAdmin: true } : u
//     );
//     saveUsers(updated);
//     addAdminLog(`Made user ${email} an admin`);
//     addAdminNotification(`User ${email} is now admin`);
//   };

//   return (
//     <div className="p-10 min-h-screen bg-gray-900 text-white">
//       <h1 className="text-3xl font-bold mb-6">User Management</h1>
//       <div className="overflow-x-auto">
//         <table className="w-full bg-[#141922] rounded-lg">
//           <thead className="bg-[#1f2633]">
//             <tr>
//               <th className="p-3 text-left">User</th>
//               <th className="p-3">Verified</th>
//               <th className="p-3">Admin</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="text-center p-3 text-gray-400">
//                   No users found.
//                 </td>
//               </tr>
//             ) : (
//               users.map((u, i) => (
//                 <motion.tr
//                   key={u.email}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: i * 0.05 }}
//                   className="border-b border-gray-700"
//                 >
//                   <td className="p-3 flex gap-3 items-center">
//                     <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-black font-bold">
//                       {u.email[0].toUpperCase()}
//                     </div>
//                     {u.email}
//                   </td>
//                   <td className="p-3">{u.emailVerified ? "✔" : "❌"}</td>
//                   <td className="p-3">{u.isAdmin ? "Admin" : "-"}</td>
//                   <td className="p-3">
//                     {u.blocked ? (
//                       <span className="text-red-400">Blocked</span>
//                     ) : (
//                       <span className="text-green-400">Active</span>
//                     )}
//                   </td>
//                   <td className="p-3 flex gap-3">
//                     {!u.isAdmin && (
//                       <button
//                         className="text-blue-400 hover:underline"
//                         onClick={() => makeAdmin(u.email)}
//                       >
//                         Make Admin
//                       </button>
//                     )}
//                     {!u.blocked && (
//                       <button
//                         className="text-yellow-400 hover:underline"
//                         onClick={() => blockUser(u.email)}
//                       >
//                         Block
//                       </button>
//                     )}
//                     <button
//                       className="text-red-400 hover:underline"
//                       onClick={() => deleteUser(u.email)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </motion.tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
