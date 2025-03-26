import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/NewAuthContext";

interface ProtectedRouteProps {
  requiredRole?: "vendor" | "client";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check if the user has that role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to the appropriate dashboard based on user role
    if (user?.role === "vendor") {
      return <Navigate to="/vendor-dashboard" replace />;
    } else {
      return <Navigate to="/client-dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
