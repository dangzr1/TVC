import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart2,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  Lock,
  UserPlus,
  CheckCircle,
  XCircle,
  Bell,
  Briefcase,
  DollarSign,
  RefreshCw,
  Zap,
  Globe,
  Crown,
  Target,
  PieChart,
  LineChart,
} from "lucide-react";
import GlobalActivityFeed from "./GlobalActivityFeed";
import PersonalizedFeed from "./PersonalizedFeed";
import RevenueAnalytics from "./RevenueAnalytics";

const SitewideDashboard = () => {
  const { user } = useAuth();

  // Check if user is admin, if not redirect to appropriate dashboard
  React.useEffect(() => {
    if (user && user.user_metadata?.role !== "admin") {
      window.location.href = `/dashboard/${user.role || "client"}`;
    }
  }, [user]);
  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">
              Platform Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-purple/5 rounded-lg border border-purple/20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Active Users</p>
                    <h3 className="text-2xl font-bold mt-1">1,245</h3>
                  </div>
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <Users className="h-5 w-5 text-purple" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-xs">
                  <span className="text-green-500 font-medium">+34 today</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Messages</p>
                    <h3 className="text-2xl font-bold mt-1">12.5k</h3>
                  </div>
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-xs">
                  <span className="text-green-500 font-medium">
                    +15% this week
                  </span>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Active Jobs</p>
                    <h3 className="text-2xl font-bold mt-1">387</h3>
                  </div>
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-xs">
                  <span className="text-green-500 font-medium">
                    +23 new today
                  </span>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <h3 className="text-2xl font-bold mt-1">$45.8k</h3>
                  </div>
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-xs">
                  <span className="text-green-500 font-medium">
                    +12% this month
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Platform Activity</h3>
                <Button variant="outline" size="sm" className="h-8">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <Zap className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Platform Health</p>
                    <div className="flex items-center gap-1">
                      <Badge className="bg-green-100 text-green-800">
                        Excellent
                      </Badge>
                      <span className="text-xs text-gray-500">100% uptime</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <Globe className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Active Regions</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">12 countries</span>
                      <span className="text-xs text-gray-500">
                        +3 this month
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">System Alerts</p>
                    <div className="flex items-center gap-1">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        2 warnings
                      </Badge>
                      <span className="text-xs text-gray-500">
                        View details
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => {
                  // Instead of showing an alert, we'll handle the invitation properly
                  const email = prompt("Enter email address to invite:");
                  if (email) {
                    // Show a success message
                    const message = document.createElement("div");
                    message.className =
                      "fixed top-4 right-4 p-4 rounded-md bg-green-100 text-green-800 border border-green-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
                    message.innerHTML = `<div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <span>Invitation sent to ${email}</span>
                    </div>`;
                    document.body.appendChild(message);
                    setTimeout(() => {
                      message.classList.add(
                        "animate-out",
                        "fade-out",
                        "slide-out-to-top-5",
                      );
                      setTimeout(() => document.body.removeChild(message), 300);
                    }, 3000);
                  }
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite New Users
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() =>
                  (window.location.href = "/dashboard/client?tab=jobs")
                }
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Post New Job
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => (window.location.href = "/messages")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Broadcast Message
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => (window.location.href = "/admin")}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Review Pending Approvals
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => (window.location.href = "/admin?tab=reports")}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Manage Reported Content
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => alert("Exporting platform data")}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Platform Data
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => (window.location.href = "/admin?tab=settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </Button>
            </div>

            <div className="mt-6 p-4 bg-purple/5 rounded-lg border border-purple/20">
              <h3 className="font-medium text-purple mb-2">Premium Status</h3>
              <p className="text-sm text-gray-600 mb-3">
                Your premium subscription is active until June 15, 2023.
              </p>
              <Button
                className="w-full bg-purple hover:bg-purple/90"
                onClick={() =>
                  (window.location.href = "/dashboard/client?tab=premium")
                }
              >
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalizedFeed />
        <GlobalActivityFeed />
      </div>

      {/* CEO Executive Dashboard */}
      <div className="mt-8 p-4 bg-gradient-to-r from-purple/10 to-transparent border-2 border-purple rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-6 w-6 text-purple" />
          <h2 className="text-2xl font-bold text-purple">
            CEO Executive Dashboard
          </h2>
          <Badge className="ml-2 bg-purple text-white">Admin Access</Badge>
        </div>
        <RevenueAnalytics />
      </div>
    </div>
  );
};

export default SitewideDashboard;
