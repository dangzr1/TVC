import React, { useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import JobPostingTools from "../../components/dashboard/client/JobPostingTools";
import ClientDashboardStats from "../../components/dashboard/client/ClientDashboardStats";
import RecentApplications from "../../components/dashboard/client/RecentApplications";
import ApplicationsTable from "../../components/dashboard/client/ApplicationsTable";
import JobPostingForm from "../../components/dashboard/client/JobPostingForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Users, FileText, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  avatarUrl = "https://api.dicebear.com/7.x/shapes/svg?seed=John",
}: ClientDashboardProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);

  // Use user data from auth context if available
  const displayName = user
    ? `${user.user_metadata?.first_name || ""} ${user.user_metadata?.last_name || ""}`
    : userName;
  const userAvatar = `https://api.dicebear.com/7.x/shapes/svg?seed=${displayName.replace(" ", "")}`;

  const handleCreateJob = (data: any) => {
    console.log("Creating job:", data);
    // In a real app, this would save to the database
    // For demo purposes, we'll just close the modal
    setIsCreateJobModalOpen(false);
    // Switch to the jobs tab to show the new job
    setActiveTab("jobs");
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <header>
        <title>Client Dashboard - TheVendorsConnect</title>
        <meta
          name="description"
          content="Manage your wedding planning, find vendors, and track applications from your client dashboard."
        />
      </header>
      <DashboardHeader
        userName={displayName}
        userRole={userRole}
        notificationCount={notificationCount}
        avatarUrl={userAvatar}
      />

      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Client Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage your job postings and review applications from vendors
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-white">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-purple data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="jobs"
              className="data-[state=active]:bg-purple data-[state=active]:text-white"
            >
              <FileText className="mr-2 h-4 w-4" />
              Job Postings
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="data-[state=active]:bg-purple data-[state=active]:text-white"
            >
              <Users className="mr-2 h-4 w-4" />
              Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ClientDashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RecentApplications />
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <JobPostingTools />
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
              <ApplicationsTable />
            </div>
          </TabsContent>
        </Tabs>

        {/* Job Posting Form Modal */}
        <JobPostingForm
          isOpen={isCreateJobModalOpen}
          onClose={() => setIsCreateJobModalOpen(false)}
          onSubmit={handleCreateJob}
        />
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} TheVendorsConnect. All rights
              reserved.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="/privacy"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Terms of Service
              </a>
              <a
                href="/faq"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                FAQ
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientDashboard;
