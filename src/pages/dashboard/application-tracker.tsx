import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ApplicationTracker from "@/components/dashboard/ApplicationTracker";
import { useAuth } from "@/contexts/AuthContext";

const ApplicationTrackerPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <DashboardHeader
        userName={
          user?.user_metadata?.first_name
            ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
            : "User"
        }
        userRole={user?.user_metadata?.role || "vendor"}
      />
      <div className="container mx-auto py-8 px-4">
        <ApplicationTracker />
      </div>
    </div>
  );
};

export default ApplicationTrackerPage;
