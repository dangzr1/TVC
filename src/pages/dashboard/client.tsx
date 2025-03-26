import React, { useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import JobPostingTools from "../../components/dashboard/client/JobPostingTools";
import ClientDashboardStats from "../../components/dashboard/client/ClientDashboardStats";
import RecentApplications from "../../components/dashboard/client/RecentApplications";
import ApplicationsTable from "../../components/dashboard/client/ApplicationsTable";
import JobPostingForm from "../../components/dashboard/client/JobPostingForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Users, FileText, Settings, User } from "lucide-react";
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

    // Dispatch event to notify JobPostingTools component
    window.dispatchEvent(
      new CustomEvent("newJobPosted", {
        detail: {
          id: Date.now().toString(),
          title: data.title,
          company: "Your Company",
          location: data.location,
          salary: data.salary,
          type: data.status === "active" ? "Full-time" : "Draft",
          postedAt: "Just now",
        },
      }),
    );
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
          <Button
            onClick={() => setIsCreateJobModalOpen(true)}
            className="bg-purple hover:bg-purple/90 text-black font-medium"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Post a New Job
          </Button>
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

            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-purple data-[state=active]:text-white"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-purple data-[state=active]:text-white"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ClientDashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RecentApplications />
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3">
                  <div className="bg-purple/5 rounded-lg p-6 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple mb-4">
                      <img
                        src={userAvatar}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-xl font-bold mb-1">{displayName}</h2>
                    <p className="text-gray-500 capitalize mb-4">{userRole}</p>
                    <Button variant="outline" className="w-full mb-2">
                      <User className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Settings className="mr-2 h-4 w-4" /> Account Settings
                    </Button>
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-xl font-bold mb-4">
                    Profile Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Full Name
                      </h4>
                      <p className="text-gray-900">{displayName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Email
                      </h4>
                      <p className="text-gray-900">
                        {user?.email || "example@email.com"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Account Type
                      </h4>
                      <p className="text-gray-900 capitalize">{userRole}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Member Since
                      </h4>
                      <p className="text-gray-900">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Account Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-purple mr-3" />
                          <div>
                            <p className="font-medium">Job Postings</p>
                            <p className="text-sm text-gray-500">
                              Active job listings
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-bold">{0}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-purple mr-3" />
                          <div>
                            <p className="font-medium">Applications</p>
                            <p className="text-sm text-gray-500">
                              Received applications
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-bold">{0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
              <h2 className="text-xl font-bold mb-6">Account Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Notification Preferences
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Email Notifications
                      </label>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        defaultChecked
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Application Updates
                      </label>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        defaultChecked
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Marketing Communications
                      </label>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Security</h3>
                  <Button variant="outline" className="mb-3">
                    Change Password
                  </Button>
                  <p className="text-sm text-gray-500">
                    Last password change: Never
                  </p>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
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
