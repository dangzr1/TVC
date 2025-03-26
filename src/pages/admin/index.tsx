import React, { useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Extra security check to ensure only dangzr1@gmail.com can access admin panel
  useEffect(() => {
    if (!isAdmin || user?.email !== "dangzr1@gmail.com") {
      console.log("Unauthorized access attempt to admin panel");
      navigate(`/dashboard/${user?.role || "client"}`);
    }
  }, [user, isAdmin, navigate]);

  // Only render if user is admin and has the correct email
  if (!isAdmin || user?.email !== "dangzr1@gmail.com") {
    return null; // Don't render anything while redirecting
  }

  return (
    <>
      <header>
        <title>Admin Dashboard - TheVendorsConnect</title>
        <meta
          name="description"
          content="Admin dashboard for TheVendorsConnect platform management."
        />
        <meta name="robots" content="noindex, nofollow" />
      </header>
      <AdminDashboard />
    </>
  );
};

export default AdminPage;
