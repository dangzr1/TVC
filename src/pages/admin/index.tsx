import React from "react";
import AdminDashboard from "./AdminDashboard";

const AdminPage = () => {
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
