import React from "react";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-gray-900 h-screen text-white p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <nav className="flex-1 space-y-2">
        <Link
          to="/admin"
          className="block p-2 hover:bg-gray-700 rounded transition"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/users"
          className="block p-2 hover:bg-gray-700 rounded transition"
        >
          Users
        </Link>
        <Link
          to="/admin/notifications"
          className="block p-2 hover:bg-gray-700 rounded transition"
        >
          Notifications
        </Link>
        <Link
          to="/admin/logs"
          className="block p-2 hover:bg-gray-700 rounded transition"
        >
          Activity Logs
        </Link>
        <Link
          to="/admin/settings"
          className="block p-2 hover:bg-gray-700 rounded transition"
        >
          Settings
        </Link>
      </nav>

      <button
        className="mt-auto w-full bg-red-600 py-2 rounded hover:bg-red-500 transition"
        onClick={() => {
          localStorage.removeItem("adminLoggedIn");
          window.location.href = "/admin-login";
        }}
      >
        Logout
      </button>
    </div>
  );
}

// import React from "react";
// import { Link } from "react-router-dom";

// export default function AdminSidebar() {
//   return (
//     <div className="w-60 min-h-screen bg-[#111827] text-white p-5">
//       <h2 className="text-xl font-bold mb-4">Admin Panel</h2>

//       <ul className="flex flex-col gap-4">
//         <li>
//           <Link to="/admin">Dashboard</Link>
//         </li>
//         <li>
//           <Link to="/admin/users">User Management</Link>
//         </li>
//         <li>
//           <button
//             onClick={() => {
//               localStorage.removeItem("adminLoggedIn");
//               window.location.href = "/admin-login";
//             }}
//             className="text-red-400"
//           >
//             Logout
//           </button>
//         </li>
//       </ul>
//     </div>
//   );
// }
