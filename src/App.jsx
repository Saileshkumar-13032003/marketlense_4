import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// AUTH
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmailHandler from "./pages/VerifyEmailHandler";

// USER
import Dashboard from "./pages/Dashboard";
import Stocks from "./pages/Stocks";
import Crypto from "./pages/Crypto";
import Forex from "./pages/Forex";
import Futures from "./pages/Futures";
import Indices from "./pages/Indices";
import ChartTerminal from "./components/ChartTerminal";

// ADMIN
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLayout from "./components/AdminLayout";

// 🔐 Axios token helper
const setAxiosAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// USER LAYOUT (Sidebar)
function Layout({ children }) {
  const location = useLocation();

  const hideSidebarRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/register-success",
    "/admin-login",
  ];

  const shouldHideSidebar =
    hideSidebarRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/verify-email") ||
    location.pathname.startsWith("/admin");

  return (
    <div className="flex">
      {!shouldHideSidebar && localStorage.getItem("token") && <Sidebar />}
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAxiosAuthHeader(token);
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register-success" element={<RegistrationSuccess />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route
            path="/verify-email/:verificationToken"
            element={<VerifyEmailHandler />}
          />

          {/* USER PROTECTED ROUTES */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/indices"
            element={
              <ProtectedRoute>
                <Indices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stocks"
            element={
              <ProtectedRoute>
                <Stocks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crypto"
            element={
              <ProtectedRoute>
                <Crypto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forex"
            element={
              <ProtectedRoute>
                <Forex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/futures"
            element={
              <ProtectedRoute>
                <Futures />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chart/:symbol"
            element={
              <ProtectedRoute>
                <ChartTerminal />
              </ProtectedRoute>
            }
          />

          {/* ADMIN ROUTES */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="logs" element={<AdminLogs />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

// import React, { useEffect } from "react";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from "react-router-dom";
// import axios from "axios";

// import Sidebar from "./components/Sidebar";
// import ProtectedRoute from "./components/ProtectedRoute";

// // AUTH
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";
// import EmailVerification from "./pages/EmailVerification";
// import RegistrationSuccess from "./pages/RegistrationSuccess";
// import ResetPassword from "./pages/ResetPassword";

// // USER
// import Dashboard from "./pages/Dashboard";
// import Stocks from "./pages/Stocks";
// import Crypto from "./pages/Crypto";
// import Forex from "./pages/Forex";
// import Futures from "./pages/Futures";
// import Indices from "./pages/Indices";
// import ChartTerminal from "./components/ChartTerminal";

// // ADMIN
// import AdminLogin from "./pages/AdminLogin";
// import AdminDashboard from "./pages/AdminDashboard";
// import AdminUsers from "./pages/AdminUsers";
// import AdminLogs from "./pages/admin/AdminLogs";
// import AdminNotifications from "./pages/admin/AdminNotifications";
// import AdminSettings from "./pages/admin/AdminSettings";
// import AdminLayout from "./components/AdminLayout"; // Nested layout for admin

// // 🔐 Axios token helper
// const setAxiosAuthHeader = (token) => {
//   if (token) {
//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete axios.defaults.headers.common["Authorization"];
//   }
// };

// // USER LAYOUT (Sidebar)
// function Layout({ children }) {
//   const location = useLocation();

//   const hideSidebarRoutes = [
//     "/login",
//     "/register",
//     "/forgot-password",
//     "/email-verification",
//     "/register-success",
//     "/admin-login",
//   ];

//   const shouldHideSidebar =
//     hideSidebarRoutes.includes(location.pathname) ||
//     location.pathname.startsWith("/reset-password") ||
//     location.pathname.startsWith("/admin"); // hide sidebar for admin routes

//   return (
//     <div className="flex">
//       {!shouldHideSidebar && localStorage.getItem("token") && <Sidebar />}
//       <div className="flex-1">{children}</div>
//     </div>
//   );
// }

// export default function App() {
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) setAxiosAuthHeader(token);
//   }, []);

//   return (
//     <BrowserRouter>
//       <Layout>
//         <Routes>
//           {/* PUBLIC ROUTES */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/email-verification" element={<EmailVerification />} />
//           <Route path="/register-success" element={<RegistrationSuccess />} />
//           <Route
//             path="/reset-password/:resetToken"
//             element={<ResetPassword />}
//           />

//           {/* USER PROTECTED ROUTES */}
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/indices"
//             element={
//               <ProtectedRoute>
//                 <Indices />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/stocks"
//             element={
//               <ProtectedRoute>
//                 <Stocks />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/crypto"
//             element={
//               <ProtectedRoute>
//                 <Crypto />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/forex"
//             element={
//               <ProtectedRoute>
//                 <Forex />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/futures"
//             element={
//               <ProtectedRoute>
//                 <Futures />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/chart/:symbol"
//             element={
//               <ProtectedRoute>
//                 <ChartTerminal />
//               </ProtectedRoute>
//             }
//           />

//           {/* ADMIN ROUTES */}
//           <Route path="/admin-login" element={<AdminLogin />} />
//           <Route path="/admin" element={<AdminLayout />}>
//             <Route index element={<AdminDashboard />} />
//             <Route path="users" element={<AdminUsers />} />
//             <Route path="logs" element={<AdminLogs />} />
//             <Route path="notifications" element={<AdminNotifications />} />
//             <Route path="settings" element={<AdminSettings />} />
//           </Route>

//           {/* FALLBACK */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Layout>
//     </BrowserRouter>
//   );
// }

// // frontend/src/App.jsx

// import React, { useEffect } from "react";
// import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import axios from "axios";

// import Sidebar from "./components/Sidebar";
// import ProtectedRoute from "./components/ProtectedRoute";

// // AUTH PAGES
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";
// import EmailVerification from "./pages/EmailVerification";
// import RegistrationSuccess from "./pages/RegistrationSuccess";

// // USER PAGES
// import Dashboard from "./pages/Dashboard";
// import Stocks from "./pages/Stocks";
// import Crypto from "./pages/Crypto";
// import Forex from "./pages/Forex";
// import Futures from "./pages/Futures";
// import Indices from "./pages/Indices";
// import ChartTerminal from "./components/ChartTerminal";

// // ADMIN
// import AdminLogin from "./pages/AdminLogin";
// import AdminProtectedRoute from "./components/AdminProtectedRoute";
// import AdminSidebar from "./components/AdminSidebar";
// import AdminDashboard from "./pages/AdminDashboard";
// import AdminUsers from "./pages/AdminUsers";
// import AdminLogs from "./pages/admin/AdminLogs";
// import AdminNotifications from "./pages/admin/AdminNotifications";
// import AdminSettings from "./pages/admin/AdminSettings";

// // 🔐 Axios token attach helper
// const setAxiosAuthHeader = (token) => {
//   if (token) {
//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete axios.defaults.headers.common["Authorization"];
//   }
// };

// function Layout({ children }) {
//   const location = useLocation();

//   const hideSidebarRoutes = [
//     "/login",
//     "/register",
//     "/forgot-password",
//     "/email-verification",
//     "/register-success",
//     "/admin-login",
//   ];

//   const shouldHideSidebar =
//     hideSidebarRoutes.includes(location.pathname) ||
//     location.pathname.startsWith("/reset") ||
//     location.pathname.startsWith("/admin");

//   return (
//     <div className="flex">
//       {!shouldHideSidebar && localStorage.getItem("token") && <Sidebar />}
//       <div className="flex-1">{children}</div>
//     </div>
//   );
// }

// export default function App() {
//   // ✅ Restore token on app load
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) setAxiosAuthHeader(token);
//   }, []);

//   return (
//     <Layout>
//       <Routes>
//         {/* PUBLIC */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/email-verification" element={<EmailVerification />} />
//         <Route path="/register-success" element={<RegistrationSuccess />} />

//         {/* USER PROTECTED */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/indices"
//           element={
//             <ProtectedRoute>
//               <Indices />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/stocks"
//           element={
//             <ProtectedRoute>
//               <Stocks />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/crypto"
//           element={
//             <ProtectedRoute>
//               <Crypto />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/forex"
//           element={
//             <ProtectedRoute>
//               <Forex />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/futures"
//           element={
//             <ProtectedRoute>
//               <Futures />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/chart/:symbol"
//           element={
//             <ProtectedRoute>
//               <ChartTerminal />
//             </ProtectedRoute>
//           }
//         />

//         {/* ADMIN */}
//         <Route path="/admin-login" element={<AdminLogin />} />

//         <Route
//           path="/admin"
//           element={
//             <AdminProtectedRoute>
//               <div className="flex">
//                 <AdminSidebar />
//                 <AdminDashboard />
//               </div>
//             </AdminProtectedRoute>
//           }
//         />

//         <Route
//           path="/admin/users"
//           element={
//             <AdminProtectedRoute>
//               <div className="flex">
//                 <AdminSidebar />
//                 <AdminUsers />
//               </div>
//             </AdminProtectedRoute>
//           }
//         />

//         <Route
//           path="/admin/settings"
//           element={
//             <AdminProtectedRoute>
//               <div className="flex">
//                 <AdminSidebar />
//                 <AdminSettings />
//               </div>
//             </AdminProtectedRoute>
//           }
//         />

//         <Route
//           path="/admin/notifications"
//           element={
//             <AdminProtectedRoute>
//               <div className="flex">
//                 <AdminSidebar />
//                 <AdminNotifications />
//               </div>
//             </AdminProtectedRoute>
//           }
//         />

//         <Route
//           path="/admin/logs"
//           element={
//             <AdminProtectedRoute>
//               <div className="flex">
//                 <AdminSidebar />
//                 <AdminLogs />
//               </div>
//             </AdminProtectedRoute>
//           }
//         />

//         {/* FALLBACK */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Layout>
//   );
// }

// // // frontend/src/App.jsx

// // import React, { useEffect } from "react";
// // import {
// //   BrowserRouter,
// //   Routes,
// //   Route,
// //   Navigate,
// //   useLocation,
// // } from "react-router-dom";
// // import axios from "axios"; // Ensure you import axios if using setAxiosAuthHeader here

// // import Sidebar from "./components/Sidebar";
// // import ProtectedRoute from "./components/ProtectedRoute";

// // // =====================================
// // // 🎯 FIX: MISSING PAGE COMPONENT IMPORTS
// // // =====================================
// // import Login from "./pages/Login"; // 🛑 MUST IMPORT LOGIN
// // import Register from "./pages/Register";
// // import ForgotPassword from "./pages/ForgotPassword";
// // import EmailVerification from "./pages/EmailVerification";
// // import RegistrationSuccess from "./pages/RegistrationSuccess";

// // import Dashboard from "./pages/Dashboard";
// // import Stocks from "./pages/Stocks";
// // import Crypto from "./pages/Crypto";
// // import Forex from "./pages/Forex";
// // import Futures from "./pages/Futures";
// // import Indices from "./pages/Indices";
// // import ChartTerminal from "./components/ChartTerminal";

// // // ADMIN
// // import AdminLogin from "./pages/AdminLogin"; // Assuming this is separate from main Login
// // import AdminProtectedRoute from "./components/AdminProtectedRoute";
// // import AdminSidebar from "./components/AdminSidebar";
// // import AdminDashboard from "./pages/AdminDashboard";
// // import AdminUsers from "./pages/AdminUsers";
// // import AdminLogs from "./pages/admin/AdminLogs";
// // import AdminNotifications from "./pages/admin/AdminNotifications";
// // import AdminSettings from "./pages/admin/AdminSettings";

// // // 🛑 Helper function to attach token to Axios (Duplicate from Login for immediate App.js fix)
// // const setAxiosAuthHeader = (token) => {
// //   if (token) {
// //     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// //   } else {
// //     delete axios.defaults.headers.common["Authorization"];
// //   }
// // };

// // function Layout({ children }) {
// //   // ... (Layout component remains the same) ...
// //   const location = useLocation();

// //   const hideSidebarRoutes = [
// //     "/login",
// //     "/register",
// //     "/forgot-password",
// //     "/email-verification",
// //     "/register-success",
// //     "/admin-login",
// //   ];

// //   const shouldHideSidebar =
// //     hideSidebarRoutes.includes(location.pathname) ||
// //     location.pathname.startsWith("/reset") ||
// //     location.pathname.startsWith("/admin");

// //   return (
// //     <div className="flex">
// //       {!shouldHideSidebar && localStorage.getItem("loggedIn") && <Sidebar />}
// //       <div className="flex-1">{children}</div>
// //     </div>
// //   );
// // }

// // export default function App() {
// //   // 🛑 CRITICAL FIX: Check for token on load and set it for Axios
// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     if (token) {
// //       setAxiosAuthHeader(token);
// //     }
// //   }, []);

// //   return (
// //     <BrowserRouter>
// //       <Layout>
// //         <Routes>
// //           {/* ... (All your existing routes remain the same) ... */}
// //           {/* PUBLIC AUTH ROUTES */}
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/register" element={<Register />} />
// //           <Route path="/forgot-password" element={<ForgotPassword />} />
// //           <Route path="/email-verification" element={<EmailVerification />} />
// //           <Route path="/register-success" element={<RegistrationSuccess />} />

// //           {/* USER PROTECTED ROUTES */}
// //           {/* ... (all protected user routes) ... */}
// //           <Route
// //             path="/"
// //             element={
// //               <ProtectedRoute>
// //                 <Dashboard />
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route
// //             path="/indices"
// //             element={
// //               <ProtectedRoute>
// //                 <Indices />
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route
// //             path="/stocks"
// //             element={
// //               <ProtectedRoute>
// //                 <Stocks />
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route
// //             path="/crypto"
// //             element={
// //               <ProtectedRoute>
// //                 <Crypto />
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route
// //             path="/forex"
// //             element={
// //               <ProtectedRoute>
// //                 <Forex />
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route
// //             path="/futures"
// //             element={
// //               <ProtectedRoute>
// //                 <Futures />
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route
// //             path="/chart/:symbol"
// //             element={
// //               <ProtectedRoute>
// //                 <ChartTerminal />
// //               </ProtectedRoute>
// //             }
// //           />

// //           {/* ADMIN PUBLIC */}
// //           <Route path="/admin-login" element={<AdminLogin />} />

// //           {/* ADMIN PROTECTED */}
// //           <Route
// //             path="/admin"
// //             element={
// //               <AdminProtectedRoute>
// //                 <div className="flex">
// //                   <AdminSidebar />
// //                   <AdminDashboard />
// //                 </div>
// //               </AdminProtectedRoute>
// //             }
// //           />

// //           <Route
// //             path="/admin/users"
// //             element={
// //               <AdminProtectedRoute>
// //                 <div className="flex">
// //                   <AdminSidebar />
// //                   <AdminUsers />
// //                 </div>
// //               </AdminProtectedRoute>
// //             }
// //           />

// //           {/* ... (other admin routes - settings, notifications, logs) ... */}
// //           <Route
// //             path="/admin/settings"
// //             element={
// //               <AdminProtectedRoute>
// //                 <div className="flex">
// //                   <AdminSidebar />
// //                   <AdminSettings />
// //                 </div>
// //               </AdminProtectedRoute>
// //             }
// //           />

// //           <Route
// //             path="/admin/notifications"
// //             element={
// //               <AdminProtectedRoute>
// //                 <div className="flex">
// //                   <AdminSidebar />
// //                   <AdminNotifications />
// //                 </div>
// //               </AdminProtectedRoute>
// //             }
// //           />

// //           <Route
// //             path="/admin/logs"
// //             element={
// //               <AdminProtectedRoute>
// //                 <div className="flex">
// //                   <AdminSidebar />
// //                   <AdminLogs />
// //                 </div>
// //               </AdminProtectedRoute>
// //             }
// //           />

// //           {/* FALLBACK */}
// //           <Route path="*" element={<Navigate to="/" replace />} />
// //         </Routes>
// //       </Layout>
// //     </BrowserRouter>
// //   );
// // }

// // import React from "react";
// // import {
// //   BrowserRouter,
// //   Routes,
// //   Route,
// //   Navigate,
// //   useLocation,
// // } from "react-router-dom";

// // import Sidebar from "./components/Sidebar";
// // import ProtectedRoute from "./components/ProtectedRoute";

// // import Login from "./pages/Login";
// // import Register from "./pages/Register";
// // import ForgotPassword from "./pages/ForgotPassword";
// // import EmailVerification from "./pages/EmailVerification";
// // import RegistrationSuccess from "./pages/RegistrationSuccess";

// // import Dashboard from "./pages/Dashboard";
// // import Stocks from "./pages/Stocks";
// // import Crypto from "./pages/Crypto";
// // import Forex from "./pages/Forex";
// // import Futures from "./pages/Futures";
// // import Indices from "./pages/Indices";
// // import ChartTerminal from "./components/ChartTerminal";

// // // ADMIN
// // import AdminLogin from "./pages/AdminLogin";
// // import AdminProtectedRoute from "./components/AdminProtectedRoute";
// // import AdminSidebar from "./components/AdminSidebar";
// // import AdminDashboard from "./pages/AdminDashboard";
// // import AdminUsers from "./pages/AdminUsers";
// // import AdminLogs from "./pages/admin/AdminLogs";
// // import AdminNotifications from "./pages/admin/AdminNotifications";
// // import AdminSettings from "./pages/admin/AdminSettings";

// // function Layout({ children }) {
// //   const location = useLocation();

// //   const hideSidebarRoutes = [
// //     "/login",
// //     "/register",
// //     "/forgot-password",
// //     "/email-verification",
// //     "/register-success",
// //     "/admin-login",
// //   ];

// //   const shouldHideSidebar =
// //     hideSidebarRoutes.includes(location.pathname) ||
// //     location.pathname.startsWith("/reset") ||
// //     location.pathname.startsWith("/admin"); // hide user sidebar on ADMIN pages

// //   return (
// //     <div className="flex">
// //       {!shouldHideSidebar && localStorage.getItem("loggedIn") && <Sidebar />}
// //       <div className="flex-1">{children}</div>
// //     </div>
// //   );
// // }

// // export default function App() {
// //   return (
// //     <BrowserRouter>
// //       <Layout>
// //         <Routes>
// //           {/* PUBLIC AUTH ROUTES */}
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/register" element={<Register />} />
// //           <Route path="/forgot-password" element={<ForgotPassword />} />
// //           <Route path="/email-verification" element={<EmailVerification />} />
// //           <Route path="/register-success" element={<RegistrationSuccess />} />

// //           {/* USER PROTECTED ROUTES */}
// //           <Route
// //             path="/"
// //             element={
// //               <ProtectedRoute>
// //                 <Dashboard />
// //               </ProtectedRoute>
// //             }
// //           />

// //           <Route
// //             path="/indices"
// //             element={
// //               <ProtectedRoute>
// //                 <Indices />
// //               </ProtectedRoute>
// //             }
// //           />

// //           <Route
// //             path="/stocks"
// //             element={
// //               <ProtectedRoute>
// //                 <Stocks />
// //               </ProtectedRoute>
// //             }
// //           />

// //           <Route
// //             path="/crypto"
// //             element={
// //               <ProtectedRoute>
// //                 <Crypto />
// //               </ProtectedRoute>
// //             }
// //           />

// //           <Route
// //             path="/forex"
// //             element={
// //               <ProtectedRoute>
// //                 <Forex />
// //               </ProtectedRoute>
// //             }
// //           />

// //           <Route
// //             path="/futures"
// //             element={
// //               <ProtectedRoute>
// //                 <Futures />
// //               </ProtectedRoute>
// //             }
// //           />

// //           <Route
// //             path="/chart/:symbol"
// //             element={
// //               <ProtectedRoute>
// //                 <ChartTerminal />
// //               </ProtectedRoute>
// //             }
// //           />

// //           {/* ADMIN PUBLIC */}
// //           <Route path="/admin-login" element={<AdminLogin />} />

// //           {/* ADMIN PROTECTED */}
// //           <Route
// //             path="/admin"
// //             element={
// //               <AdminProtectedRoute>
// //                 <div className="flex">
// //                   <AdminSidebar />
// //                   <AdminDashboard />
// //                 </div>
// //               </AdminProtectedRoute>
// //             }
// //           />

// //           <Route
// //             path="/admin/users"
// //             element={
// //               <AdminProtectedRoute>
// //                 <div className="flex">
// //                   <AdminSidebar />
// //                   <AdminUsers />
// //                 </div>
// //               </AdminProtectedRoute>
// //             }
// //           />

// //           {/* FALLBACK */}
// //           <Route path="*" element={<Navigate to="/" replace />} />
// //           <Route
// //             path="/admin/settings"
// //             element={
// //               <AdminProtectedRoute>
// //                 <div className="flex">
// //                   <AdminSidebar />
// //                   <AdminSettings />
// //                 </div>
// //               </AdminProtectedRoute>
// //             }
// //           />

// //           <Route
// //             path="/admin/notifications"
// //             element={
// //               <AdminProtectedRoute>
// //                 <div className="flex">
// //                   <AdminSidebar />
// //                   <AdminNotifications />
// //                 </div>
// //               </AdminProtectedRoute>
// //             }
// //           />

// //           <Route
// //             path="/admin/logs"
// //             element={
// //               <AdminProtectedRoute>
// //                 <div className="flex">
// //                   <AdminSidebar />
// //                   <AdminLogs />
// //                 </div>
// //               </AdminProtectedRoute>
// //             }
// //           />
// //         </Routes>
// //       </Layout>
// //     </BrowserRouter>
// //   );
// // }
