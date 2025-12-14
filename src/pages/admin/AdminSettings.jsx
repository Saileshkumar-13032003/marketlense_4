import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Save } from "lucide-react";

// --- Configuration ---
// Assuming your API path is consistent
const API = "http://localhost:5000/api/admin";
// The theme remains local as it's a preference for the current browser
const LOCAL_THEME_KEY = "adminTheme";

export default function AdminSettings() {
  // State for local theme preference
  const [theme, setTheme] = useState(
    localStorage.getItem(LOCAL_THEME_KEY) || "light"
  );

  // State for Name/Email, which will be synced with the backend
  const [name, setName] = useState("Admin");
  const [email, setEmail] = useState("admin@site.com");

  // UI state
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null); // success or error message

  const token = localStorage.getItem("token");
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // 1. Fetch Admin Profile on Load
  const fetchAdminProfile = async () => {
    setLoading(true);
    try {
      // 🚨 You will need to create a new backend route for this, e.g., GET /api/admin/profile
      const res = await axios.get(`${API}/profile`, authHeader);

      // Assume the backend returns an object with { name, email }
      setName(res.data.name || "Admin");
      setEmail(res.data.email || "admin@site.com");
      setMessage({ type: "success", text: "Settings loaded." });
    } catch (err) {
      console.error("Error loading profile:", err);
      setMessage({
        type: "error",
        text: "Failed to load profile from server.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. Apply theme to body (local operation remains)
  useEffect(() => {
    document.body.className =
      theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900";
    localStorage.setItem(LOCAL_THEME_KEY, theme);
  }, [theme]);

  // Run fetch on mount
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  // 3. Save settings (now sends data to backend)
  const saveSettings = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setMessage(null);

    try {
      const updateData = { name, email };

      // 🚨 You will need to create a new backend route for this, e.g., PUT /api/admin/profile
      const res = await axios.put(`${API}/profile`, updateData, authHeader);

      // Success response should include the log/notification creation on the backend
      // For now, we only show a success message:
      setMessage({
        type: "success",
        text: res.data.msg || "Settings updated successfully and logged.",
      });
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.msg || "Failed to save settings. Server error.",
      });
    } finally {
      setIsSaving(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div
        className={`w-full max-w-md p-6 rounded-lg space-y-5 shadow-xl ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h1
          className={`text-2xl font-bold text-center border-b pb-4 ${
            theme === "dark"
              ? "text-white border-gray-700"
              : "text-gray-900 border-gray-200"
          }`}
        >
          Admin Profile Settings
        </h1>

        {/* Status Message */}
        {message && (
          <div
            className={`p-3 rounded text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Admin Name */}
        <div>
          <label
            className={`block text-sm font-semibold mb-1 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Admin Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 rounded border focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
                : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Admin Email (Read-only or requires re-auth for change) */}
        <div>
          <label
            className={`block text-sm font-semibold mb-1 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Admin Email
          </label>
          <input
            value={email}
            readOnly // Email often requires security checks to change
            className={`w-full p-2 rounded border focus:outline-none ${
              theme === "dark"
                ? "bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-600 border-gray-300 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Theme Selector */}
        <div>
          <label
            className={`block text-sm font-semibold mb-1 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Theme Preference (Local)
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={`w-full p-2 rounded border focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
                : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-400"
            }`}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 text-white rounded font-semibold transition disabled:bg-blue-400"
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Profile Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { addAdminLog, addAdminNotification } from "./helpers";

// export default function AdminSettings() {
//   // State
//   const [theme, setTheme] = useState(
//     localStorage.getItem("adminTheme") || "light"
//   );
//   const [name, setName] = useState(
//     localStorage.getItem("adminName") || "Admin"
//   );
//   const [email, setEmail] = useState(
//     localStorage.getItem("adminEmail") || "admin@site.com"
//   );

//   // Apply theme to body
//   useEffect(() => {
//     document.body.className =
//       theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900";
//   }, [theme]);

//   // Save settings
//   const saveSettings = () => {
//     localStorage.setItem("adminTheme", theme);
//     localStorage.setItem("adminName", name);
//     localStorage.setItem("adminEmail", email);

//     addAdminNotification("Settings updated successfully");
//     addAdminLog("Updated admin settings");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6">
//       <div
//         className={`w-full max-w-md p-6 rounded-lg space-y-5 ${
//           theme === "dark" ? "bg-gray-800" : "bg-white"
//         }`}
//       >
//         <h1
//           className={`text-2xl font-bold text-center ${
//             theme === "dark" ? "text-white" : "text-gray-900"
//           }`}
//         >
//           Admin Settings
//         </h1>

//         {/* Admin Name */}
//         <div>
//           <label
//             className={`block text-sm font-semibold mb-1 ${
//               theme === "dark" ? "text-gray-300" : "text-gray-700"
//             }`}
//           >
//             Admin Name
//           </label>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className={`w-full p-2 rounded border focus:outline-none focus:ring-2 ${
//               theme === "dark"
//                 ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
//                 : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-400"
//             }`}
//           />
//         </div>

//         {/* Admin Email */}
//         <div>
//           <label
//             className={`block text-sm font-semibold mb-1 ${
//               theme === "dark" ? "text-gray-300" : "text-gray-700"
//             }`}
//           >
//             Admin Email
//           </label>
//           <input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className={`w-full p-2 rounded border focus:outline-none focus:ring-2 ${
//               theme === "dark"
//                 ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
//                 : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-400"
//             }`}
//           />
//         </div>

//         {/* Theme Selector */}
//         <div>
//           <label
//             className={`block text-sm font-semibold mb-1 ${
//               theme === "dark" ? "text-gray-300" : "text-gray-700"
//             }`}
//           >
//             Theme
//           </label>
//           <select
//             value={theme}
//             onChange={(e) => setTheme(e.target.value)}
//             className={`w-full p-2 rounded border focus:outline-none focus:ring-2 ${
//               theme === "dark"
//                 ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
//                 : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-400"
//             }`}
//           >
//             <option value="light">Light</option>
//             <option value="dark">Dark</option>
//           </select>
//         </div>

//         {/* Save Button */}
//         <button
//           onClick={saveSettings}
//           className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold"
//         >
//           Save Settings
//         </button>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";

// export default function AdminSettings() {
//   const [theme, setTheme] = useState(
//     localStorage.getItem("adminTheme") || "light"
//   );
//   const [name, setName] = useState(
//     localStorage.getItem("adminName") || "Admin"
//   );
//   const [email, setEmail] = useState(
//     localStorage.getItem("adminEmail") || "admin@site.com"
//   );

//   useEffect(() => {
//     document.body.className = theme === "dark" ? "dark" : "";
//   }, [theme]);

//   const saveSettings = () => {
//     localStorage.setItem("adminTheme", theme);
//     localStorage.setItem("adminName", name);
//     localStorage.setItem("adminEmail", email);

//     addAdminNotification("Settings updated successfully");
//     addAdminLog("Updated admin settings");
//     alert("Settings saved!");
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>

//       <div className="space-y-4 max-w-lg">
//         <div>
//           <label className="block text-sm font-semibold">Admin Name</label>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold">Admin Email</label>
//           <input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold">Theme</label>
//           <select
//             value={theme}
//             onChange={(e) => setTheme(e.target.value)}
//             className="border p-2 w-full rounded"
//           >
//             <option value="light">Light</option>
//             <option value="dark">Dark</option>
//           </select>
//         </div>

//         <button
//           onClick={saveSettings}
//           className="px-4 py-2 bg-blue-600 text-white rounded"
//         >
//           Save Settings
//         </button>
//       </div>
//     </div>
//   );
// }

// // ------------------ HELPERS ------------------

// export const addAdminNotification = (msg) => {
//   const old = JSON.parse(localStorage.getItem("adminNotifications") || "[]");
//   old.push({ msg, time: new Date().toLocaleString() });
//   localStorage.setItem("adminNotifications", JSON.stringify(old));
// };

// export const addAdminLog = (action) => {
//   const old = JSON.parse(localStorage.getItem("adminLogs") || "[]");

//   // Simulated IP for tracking (in real world backend gives this)
//   const fakeIP = "192.168.1." + Math.floor(Math.random() * 255);

//   old.push({
//     action,
//     time: new Date().toLocaleString(),
//     ip: fakeIP,
//   });

//   localStorage.setItem("adminLogs", JSON.stringify(old));
// };
