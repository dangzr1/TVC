import React, { useState, useEffect, useRef } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import UserDeleteConfirmation from "@/components/admin/UserDeleteConfirmation";
import UserNotes from "@/components/admin/UserNotes";

const AdminDashboard = () => {
  const { user } = useAuth();

  // Check if user is admin, if not redirect to appropriate dashboard
  React.useEffect(() => {
    if (user && user?.role !== "admin") {
      window.location.href = `/dashboard/${user.role || "client"}`;
    }
  }, [user]);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const userNotesRef = useRef(null);

  // Mock data for admin dashboard
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalVendors: 0,
    totalClients: 0,
    pendingApprovals: 0,
    reportedContent: 0,
    totalRevenue: 0,
    activeListings: 0,
    messagesExchanged: 0,
    newUsersToday: 0,
  });

  const [users, setUsers] = useState([
    {
      id: "1",
      name: "Emily Johnson",
      email: "emily@example.com",
      role: "client",
      status: "active",
      joinDate: "2023-05-15",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    {
      id: "2",
      name: "Michael Smith",
      email: "michael@example.com",
      role: "vendor",
      status: "active",
      joinDate: "2023-04-22",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
      id: "3",
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "vendor",
      status: "pending",
      joinDate: "2023-06-01",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      id: "4",
      name: "David Lee",
      email: "david@example.com",
      role: "client",
      status: "active",
      joinDate: "2023-03-10",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    {
      id: "5",
      name: "Jessica Thompson",
      email: "jessica@example.com",
      role: "client",
      status: "inactive",
      joinDate: "2023-02-18",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    },
    {
      id: "admin1",
      name: "Admin User",
      email: "admin@thevendorsconnect.com",
      role: "admin",
      status: "active",
      joinDate: "2023-01-01",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    },
  ]);

  const [reports, setReports] = useState([
    {
      id: "r1",
      type: "user",
      reportedId: "5",
      reportedName: "Jessica Thompson",
      reportedBy: "Michael Smith",
      reason: "Inappropriate behavior",
      date: "2023-06-02",
      status: "pending",
    },
    {
      id: "r2",
      type: "content",
      reportedId: "post123",
      reportedName: "Misleading listing",
      reportedBy: "Emily Johnson",
      reason: "False information",
      date: "2023-06-01",
      status: "pending",
    },
    {
      id: "r3",
      type: "message",
      reportedId: "msg456",
      reportedName: "Inappropriate message",
      reportedBy: "David Lee",
      reason: "Harassment",
      date: "2023-05-30",
      status: "resolved",
    },
  ]);

  const [approvals, setApprovals] = useState([
    {
      id: "a1",
      type: "vendor",
      name: "Sarah Williams",
      email: "sarah@example.com",
      businessName: "Sarah's Photography",
      date: "2023-06-01",
      status: "pending",
    },
    {
      id: "a2",
      type: "vendor",
      name: "Robert Chen",
      email: "robert@example.com",
      businessName: "Chen Wedding Venues",
      date: "2023-05-30",
      status: "pending",
    },
    {
      id: "a3",
      type: "premium",
      name: "Michael Smith",
      email: "michael@example.com",
      businessName: "Smith Photography",
      date: "2023-05-29",
      status: "pending",
    },
  ]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleApprove = (id) => {
    setApprovals((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "approved" } : item,
      ),
    );
    // Update stats
    setStats((prev) => ({
      ...prev,
      pendingApprovals: prev.pendingApprovals - 1,
    }));
  };

  const handleReject = (id) => {
    setApprovals((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "rejected" } : item,
      ),
    );
    // Update stats
    setStats((prev) => ({
      ...prev,
      pendingApprovals: prev.pendingApprovals - 1,
    }));
  };

  const handleResolveReport = (id) => {
    setReports((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "resolved" } : item,
      ),
    );
    // Update stats
    setStats((prev) => ({
      ...prev,
      reportedContent: prev.reportedContent - 1,
    }));
  };

  const handleAddAdmin = () => {
    const newAdmin = {
      id: `admin${users.length + 1}`,
      name: "New Admin",
      email: "newadmin@thevendorsconnect.com",
      role: "admin",
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NewAdmin",
    };
    setUsers([...users, newAdmin]);

    // Show success notification
    const message = document.createElement("div");
    message.className =
      "fixed top-4 right-4 p-4 rounded-md bg-green-100 text-green-800 border border-green-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
    message.innerHTML = `<div class="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <span>New admin user added successfully</span>
    </div>`;
    document.body.appendChild(message);
    setTimeout(() => {
      message.classList.add("animate-out", "fade-out", "slide-out-to-top-5");
      setTimeout(() => document.body.removeChild(message), 300);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <DashboardHeader
        userName={
          user?.firstName ? `${user.firstName} ${user.lastName}` : "Admin"
        }
        userRole="admin"
      />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleAddAdmin}
            >
              <UserPlus className="h-4 w-4" />
              Add Admin
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2"
              onClick={() => setActiveTab("overview")}
            >
              <BarChart2 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center gap-2"
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="approvals"
              className="flex items-center gap-2"
              onClick={() => setActiveTab("approvals")}
            >
              <CheckCircle className="h-4 w-4" />
              Approvals
              {stats.pendingApprovals > 0 && (
                <Badge className="ml-1 bg-red-500">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex items-center gap-2"
              onClick={() => setActiveTab("reports")}
            >
              <AlertTriangle className="h-4 w-4" />
              Reports
              {stats.reportedContent > 0 && (
                <Badge className="ml-1 bg-red-500">
                  {stats.reportedContent}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2"
              onClick={() => setActiveTab("analytics")}
            >
              <BarChart2 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Total Users</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {stats.totalUsers}
                      </h3>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <span className="text-green-500 font-medium">
                      +{stats.newUsersToday} today
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Active Vendors</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {stats.totalVendors}
                      </h3>
                    </div>
                    <div className="p-3 bg-purple/10 rounded-full">
                      <Briefcase className="h-6 w-6 text-purple" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <span className="text-purple font-medium">
                      {Math.round(
                        (stats.totalVendors / stats.totalUsers) * 100,
                      )}
                      % of users
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">
                        Messages Exchanged
                      </p>
                      <h3 className="text-3xl font-bold mt-1">
                        {stats.messagesExchanged.toLocaleString()}
                      </h3>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <span className="text-green-500 font-medium">
                      Active platform
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Total Revenue</p>
                      <h3 className="text-3xl font-bold mt-1">
                        ${stats.totalRevenue.toLocaleString()}
                      </h3>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <span className="text-green-500 font-medium">
                      +12% from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "New user registered",
                        user: "Emily Johnson",
                        time: "10 minutes ago",
                      },
                      {
                        action: "Vendor application submitted",
                        user: "Robert Chen",
                        time: "1 hour ago",
                      },
                      {
                        action: "Premium subscription purchased",
                        user: "Michael Smith",
                        time: "3 hours ago",
                      },
                      {
                        action: "Content reported",
                        user: "David Lee",
                        time: "5 hours ago",
                      },
                      {
                        action: "New job posting created",
                        user: "Jessica Thompson",
                        time: "1 day ago",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-md"
                      >
                        <div className="p-2 bg-purple/10 rounded-full">
                          <Bell className="h-4 w-4 text-purple" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{activity.user}</span>
                            <span className="mx-2">•</span>
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={handleAddAdmin}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add New Admin
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => setActiveTab("approvals")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Review Pending Approvals
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => setActiveTab("reports")}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Manage Reported Content
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => {
                        alert("Exporting user data...");
                        // Show export notification after a short delay
                        setTimeout(() => {
                          const message = document.createElement("div");
                          message.className =
                            "fixed top-4 right-4 p-4 rounded-md bg-green-100 text-green-800 border border-green-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
                          message.innerHTML = `<div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            <span>User data exported successfully</span>
                          </div>`;
                          document.body.appendChild(message);
                          setTimeout(() => {
                            message.classList.add(
                              "animate-out",
                              "fade-out",
                              "slide-out-to-top-5",
                            );
                            setTimeout(
                              () => document.body.removeChild(message),
                              300,
                            );
                          }, 3000);
                        }, 1000);
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export User Data
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => {
                        alert("Opening system settings...");
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      System Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search users..."
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      alert("Filtering users...");
                    }}
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      alert("Exporting user list...");
                      // Show export notification after a short delay
                      setTimeout(() => {
                        const message = document.createElement("div");
                        message.className =
                          "fixed top-4 right-4 p-4 rounded-md bg-green-100 text-green-800 border border-green-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
                        message.innerHTML = `<div class="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                          <span>User list exported successfully</span>
                        </div>`;
                        document.body.appendChild(message);
                        setTimeout(() => {
                          message.classList.add(
                            "animate-out",
                            "fade-out",
                            "slide-out-to-top-5",
                          );
                          setTimeout(
                            () => document.body.removeChild(message),
                            300,
                          );
                        }, 3000);
                      }, 1000);
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 bg-gray-50 p-3 font-medium text-sm">
                    <div className="col-span-2">User</div>
                    <div>Role</div>
                    <div>Status</div>
                    <div>Join Date</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="grid grid-cols-7 p-3 items-center"
                      >
                        <div className="col-span-2 flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div>
                          <Badge
                            variant="outline"
                            className={`${user.role === "admin" ? "bg-purple/10 text-purple" : user.role === "vendor" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
                          >
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </Badge>
                        </div>
                        <div>
                          <Badge
                            variant="outline"
                            className={`${user.status === "active" ? "bg-green-100 text-green-800" : user.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {user.status.charAt(0).toUpperCase() +
                              user.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-sm">{user.joinDate}</div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setSelectedUser(user);
                              // Scroll to user notes section
                              setTimeout(() => {
                                userNotesRef.current?.scrollIntoView({
                                  behavior: "smooth",
                                });
                              }, 100);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              alert(`Editing profile for ${user.name}`);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              const newStatus =
                                user.status === "active"
                                  ? "inactive"
                                  : "active";
                              setUsers(
                                users.map((u) =>
                                  u.id === user.id
                                    ? { ...u, status: newStatus }
                                    : u,
                                ),
                              );

                              // Show status change notification
                              const message = document.createElement("div");
                              message.className =
                                "fixed top-4 right-4 p-4 rounded-md bg-blue-100 text-blue-800 border border-blue-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
                              message.innerHTML = `<div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                <span>${user.name}'s status changed to ${newStatus}</span>
                              </div>`;
                              document.body.appendChild(message);
                              setTimeout(() => {
                                message.classList.add(
                                  "animate-out",
                                  "fade-out",
                                  "slide-out-to-top-5",
                                );
                                setTimeout(
                                  () => document.body.removeChild(message),
                                  300,
                                );
                              }, 3000);
                            }}
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              // Show the enhanced delete confirmation dialog
                              setUserToDelete({
                                ...user,
                                contributions: {
                                  jobsPosted: Math.floor(Math.random() * 10),
                                  applicationsSubmitted: Math.floor(
                                    Math.random() * 20,
                                  ),
                                  messagesExchanged: Math.floor(
                                    Math.random() * 100,
                                  ),
                                  reviewsWritten: Math.floor(Math.random() * 5),
                                },
                                flags: {
                                  reportCount: Math.floor(Math.random() * 3),
                                  lastReportReason:
                                    Math.random() > 0.7
                                      ? "Inappropriate behavior"
                                      : undefined,
                                  suspensionHistory: Math.floor(
                                    Math.random() * 2,
                                  ),
                                },
                                activity: {
                                  lastLogin: new Date(
                                    Date.now() -
                                      Math.floor(Math.random() * 10) *
                                        24 *
                                        60 *
                                        60 *
                                        1000,
                                  ).toLocaleDateString(),
                                  averageSessionTime: `${Math.floor(Math.random() * 30)} minutes`,
                                  completedProfile: Math.random() > 0.3,
                                },
                              });
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Notes Section */}
                <div ref={userNotesRef}>
                  {selectedUser && (
                    <UserNotes
                      userId={selectedUser.id}
                      userName={selectedUser.name}
                      userEmail={selectedUser.email}
                      userRole={selectedUser.role}
                      userStatus={selectedUser.status}
                      joinDate={selectedUser.joinDate}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            {userToDelete && (
              <UserDeleteConfirmation
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={() => {
                  setUsers(users.filter((u) => u.id !== userToDelete.id));
                  setIsDeleteDialogOpen(false);

                  // Show deletion notification
                  const message = document.createElement("div");
                  message.className =
                    "fixed top-4 right-4 p-4 rounded-md bg-red-100 text-red-800 border border-red-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
                  message.innerHTML = `<div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    <span>User ${userToDelete.name} has been permanently deleted</span>
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
                }}
                user={userToDelete}
              />
            )}
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                {approvals.filter((a) => a.status === "pending").length ===
                0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                    <p className="text-gray-500">
                      There are no pending approvals at this time.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvals
                      .filter((approval) => approval.status === "pending")
                      .map((approval) => (
                        <div
                          key={approval.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">{approval.name}</h3>
                                <Badge variant="outline">
                                  {approval.type === "vendor"
                                    ? "Vendor Application"
                                    : "Premium Request"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mb-1">
                                {approval.email}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Business: </span>
                                {approval.businessName}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Submitted: </span>
                                {approval.date}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="border-green-500 text-green-500 hover:bg-green-50"
                                onClick={() => {
                                  handleApprove(approval.id);
                                  // Show success notification
                                  const message = document.createElement("div");
                                  message.className =
                                    "fixed top-4 right-4 p-4 rounded-md bg-green-100 text-green-800 border border-green-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
                                  message.innerHTML = `<div class="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    <span>Approved ${approval.name}'s application</span>
                                  </div>`;
                                  document.body.appendChild(message);
                                  setTimeout(() => {
                                    message.classList.add(
                                      "animate-out",
                                      "fade-out",
                                      "slide-out-to-top-5",
                                    );
                                    setTimeout(
                                      () => document.body.removeChild(message),
                                      300,
                                    );
                                  }, 3000);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-50"
                                onClick={() => {
                                  handleReject(approval.id);
                                  // Show rejection notification
                                  const message = document.createElement("div");
                                  message.className =
                                    "fixed top-4 right-4 p-4 rounded-md bg-red-100 text-red-800 border border-red-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
                                  message.innerHTML = `<div class="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                    <span>Rejected ${approval.name}'s application</span>
                                  </div>`;
                                  document.body.appendChild(message);
                                  setTimeout(() => {
                                    message.classList.add(
                                      "animate-out",
                                      "fade-out",
                                      "slide-out-to-top-5",
                                    );
                                    setTimeout(
                                      () => document.body.removeChild(message),
                                      300,
                                    );
                                  }, 3000);
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvals
                    .filter((approval) => approval.status !== "pending")
                    .map((approval) => (
                      <div key={approval.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{approval.name}</h3>
                              <Badge variant="outline">
                                {approval.type === "vendor"
                                  ? "Vendor Application"
                                  : "Premium Request"}
                              </Badge>
                              <Badge
                                variant={
                                  approval.status === "approved"
                                    ? "default"
                                    : "destructive"
                                }
                                className={
                                  approval.status === "approved"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : ""
                                }
                              >
                                {approval.status.charAt(0).toUpperCase() +
                                  approval.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-1">
                              {approval.email}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Business: </span>
                              {approval.businessName}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              alert(
                                `Viewing details for ${approval.name}'s application`,
                              );
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reported Content</CardTitle>
              </CardHeader>
              <CardContent>
                {reports.filter((r) => r.status === "pending").length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                    <p className="text-gray-500">
                      There are no pending reports at this time.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports
                      .filter((report) => report.status === "pending")
                      .map((report) => (
                        <div key={report.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">
                                  {report.reportedName}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-800"
                                >
                                  {report.type.charAt(0).toUpperCase() +
                                    report.type.slice(1)}{" "}
                                  Report
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mb-1">
                                Reported by: {report.reportedBy} on{" "}
                                {report.date}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Reason: </span>
                                {report.reason}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  handleResolveReport(report.id);
                                  // Show resolution notification
                                  const message = document.createElement("div");
                                  message.className =
                                    "fixed top-4 right-4 p-4 rounded-md bg-green-100 text-green-800 border border-green-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
                                  message.innerHTML = `<div class="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    <span>Resolved report: ${report.reportedName}</span>
                                  </div>`;
                                  document.body.appendChild(message);
                                  setTimeout(() => {
                                    message.classList.add(
                                      "animate-out",
                                      "fade-out",
                                      "slide-out-to-top-5",
                                    );
                                    setTimeout(
                                      () => document.body.removeChild(message),
                                      300,
                                    );
                                  }, 3000);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Resolve
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  alert(
                                    `Viewing details for report: ${report.reportedName}`,
                                  );
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolved Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports
                    .filter((report) => report.status === "resolved")
                    .map((report) => (
                      <div key={report.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">
                                {report.reportedName}
                              </h3>
                              <Badge variant="outline">
                                {report.type.charAt(0).toUpperCase() +
                                  report.type.slice(1)}{" "}
                                Report
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800"
                              >
                                Resolved
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-1">
                              Reported by: {report.reportedBy} on {report.date}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Reason: </span>
                              {report.reason}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-gray-500">
                      User growth chart would appear here
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-gray-500">
                      Revenue chart would appear here
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-gray-500">
                      Demographics chart would appear here
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-gray-500">
                      Activity chart would appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
