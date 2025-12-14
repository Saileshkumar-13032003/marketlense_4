import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  // 🛑 CRITICAL FIX: Check for the presence of the required tokens
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // The user is considered logged in if they have a token AND the role is 'admin'
  const isAuthenticated = token && role === "admin";

  // Use the path that your login screen is actually on: "/admin-login"
  return isAuthenticated ? children : <Navigate to="/admin-login" replace />;
}

// import React from "react";
// import { Navigate } from "react-router-dom";

// export default function AdminProtectedRoute({ children }) {
//   const adminLoggedIn = localStorage.getItem("adminLoggedIn");

//   return adminLoggedIn ? children : <Navigate to="/admin-login" replace />;
// }
