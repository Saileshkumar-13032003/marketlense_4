import React, { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, Bell, Loader2 } from "lucide-react";

// Assuming your API path is consistent
const API = "http://localhost:5000/api/admin";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/notifications`, authHeader);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError(
        err.response?.data?.msg || "Failed to load notifications from server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      // Optimistic UI update: remove it from the list immediately
      setNotifications((prev) => prev.filter((n) => n._id !== id));

      // Call API to mark as read
      await axios.put(`${API}/notifications/mark-read/${id}`, {}, authHeader);

      // Optionally, you could refetch: loadNotifications();
    } catch (err) {
      console.error("Failed to mark as read:", err);
      // Revert the UI update if the API call fails
      loadNotifications();
    }
  };

  useEffect(() => {
    if (token) {
      loadNotifications();
    } else {
      setError("Authentication token missing. Cannot load notifications.");
      setLoading(false);
    }

    // Remove the window event listener as the backend approach doesn't use it
  }, [token]);

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gray-500" />
        <p className="ml-3 text-gray-600">Fetching notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 text-center">
        <AlertCircle size={24} className="text-red-500 mx-auto mb-2" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <header className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
        <Bell size={32} className="text-gray-700" />
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Notifications
        </h1>
      </header>

      <div className="space-y-3 max-w-lg">
        {notifications.length === 0 ? (
          <p className="text-gray-500 italic p-4 bg-white rounded-lg shadow-sm">
            No recent alerts or notifications found.
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-lg shadow-md cursor-pointer transition 
                                ${
                                  n.isRead
                                    ? "bg-gray-100 text-gray-500"
                                    : "bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-400"
                                }`}
              onClick={() => handleMarkAsRead(n._id)}
            >
              <strong className="block text-gray-800 font-semibold">
                {n.message}
              </strong>
              <span className="text-xs text-gray-600 mt-1 block">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
      {/* Optional button to manually refresh/mark all as read */}
      {notifications.length > 0 && (
        <button
          onClick={loadNotifications}
          className="mt-6 text-sm text-blue-600 hover:text-blue-800 transition"
        >
          Refresh Notifications
        </button>
      )}
    </div>
  );
}

// // src/admin/AdminNotifications.js
// import React, { useState, useEffect } from "react";

// export default function AdminNotifications() {
//   const [notifications, setNotifications] = useState([]);

//   const loadNotifications = () =>
//     setNotifications(
//       JSON.parse(localStorage.getItem("adminNotifications") || "[]").reverse()
//     );

//   useEffect(() => {
//     loadNotifications();
//     window.addEventListener("notificationsUpdated", loadNotifications);
//     return () =>
//       window.removeEventListener("notificationsUpdated", loadNotifications);
//   }, []);

//   return (
//     <div className="p-6 min-h-screen bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6">Notifications</h1>
//       <div className="space-y-3 max-w-md">
//         {notifications.length === 0 ? (
//           <p className="text-gray-500">No notifications yet.</p>
//         ) : (
//           notifications.map((n, i) => (
//             <div
//               key={n.id || i}
//               className="p-4 bg-yellow-100 border-l-4 border-yellow-400 rounded shadow-sm hover:bg-yellow-200 transition"
//             >
//               <strong className="block text-gray-800">{n.msg}</strong>
//               <span className="text-xs text-gray-600">{n.time}</span>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";

// export default function AdminNotifications() {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("adminNotifications") || "[]");
//     setNotifications([...data].reverse());
//   }, []);

//   return (
//     <div className="p-6 min-h-screen bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Notifications</h1>

//       <div className="space-y-3 max-w-md">
//         {notifications.length === 0 && (
//           <p className="text-gray-500">No notifications yet.</p>
//         )}

//         {notifications.map((n, i) => (
//           <div
//             key={n.id || i}
//             className="p-4 bg-yellow-100 border-l-4 border-yellow-400 rounded shadow-sm hover:bg-yellow-200 transition"
//           >
//             <strong className="block text-gray-800">{n.msg}</strong>
//             <span className="text-xs text-gray-600">{n.time}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
