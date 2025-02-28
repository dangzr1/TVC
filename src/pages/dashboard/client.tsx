import React from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import JobPostingTools from "../../components/dashboard/client/JobPostingTools";

interface ClientDashboardProps {
  userName?: string;
  userRole?: "client";
  notificationCount?: number;
  avatarUrl?: string;
}

const ClientDashboard = ({
  userName = "John Doe",
  userRole = "client",
  notificationCount = 3,
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
}: ClientDashboardProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader
        userName={userName}
        userRole={userRole}
        notificationCount={notificationCount}
        avatarUrl={avatarUrl}
      />

      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Client Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your job postings and review applications from vendors
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <JobPostingTools />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} JobMatch. All rights reserved.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientDashboard;
