// frontend/src/components/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminProtectedRoute from "./AdminProtectedRoute";

export default function AdminLayout() {
  return (
    <AdminProtectedRoute>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1">
          <Outlet /> {/* Nested admin routes will render here */}
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
