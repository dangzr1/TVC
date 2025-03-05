import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  MessageSquare,
  Briefcase,
  Heart,
  Calendar,
  DollarSign,
  Star,
  UserPlus,
  Settings,
  Filter,
  RefreshCw,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  User,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const GlobalActivityFeed = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Mock data for the global activity feed
  const mockActivities = [
    {
      id: "a1",
      type: "message",
      action: "New message sent",
      user: "Emily Johnson",
      target: "Michael Smith",
      time: "2 minutes ago",
      details: "Discussing wedding photography details",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    {
      id: "a2",
      type: "job",
      action: "New job posted",
      user: "David Lee",
      target: "Wedding Photographer Needed",
      time: "15 minutes ago",
      details: "$2,000-$3,000 budget, June 15th event",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    {
      id: "a3",
      type: "application",
      action: "Job application submitted",
      user: "Sarah Williams",
      target: "Wedding Photographer Needed",
      time: "30 minutes ago",
      details: "Applied with portfolio and custom message",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      id: "a4",
      type: "premium",
      action: "Premium subscription purchased",
      user: "Michael Smith",
      target: "Annual Plan",
      time: "1 hour ago",
      details: "Upgraded to premium vendor account",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
      id: "a5",
      type: "review",
      action: "New review posted",
      user: "Jessica Thompson",
      target: "Michael Smith Photography",
      time: "2 hours ago",
      details: "5-star review: 'Amazing photographer!'",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    },
    {
      id: "a6",
      type: "user",
      action: "New user registered",
      user: "Robert Chen",
      target: "Vendor Account",
      time: "3 hours ago",
      details: "Wedding venue owner from Chicago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    },
    {
      id: "a7",
      type: "booking",
      action: "New booking confirmed",
      user: "Emily Johnson",
      target: "Michael Smith Photography",
      time: "4 hours ago",
      details: "Wedding photography for June 15th",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    {
      id: "a8",
      type: "favorite",
      action: "Vendor favorited",
      user: "Jessica Thompson",
      target: "Sunset Gardens Venue",
      time: "5 hours ago",
      details: "Added to favorites list",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    },
    {
      id: "a9",
      type: "report",
      action: "Content reported",
      user: "David Lee",
      target: "Inappropriate listing",
      time: "6 hours ago",
      details: "Reported for misleading information",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    {
      id: "a10",
      type: "approval",
      action: "Vendor application approved",
      user: "Admin",
      target: "Sarah Williams Photography",
      time: "7 hours ago",
      details: "New vendor account approved",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    },
    {
      id: "a11",
      type: "payment",
      action: "Payment processed",
      user: "Emily Johnson",
      target: "Michael Smith Photography",
      time: "8 hours ago",
      details: "$2,500 deposit for wedding photography",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    {
      id: "a12",
      type: "message",
      action: "Group message sent",
      user: "Jessica Thompson",
      target: "Wedding Planning Group",
      time: "9 hours ago",
      details: "Discussing venue options with vendors",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    },
    {
      id: "a13",
      type: "job",
      action: "Job posting updated",
      user: "David Lee",
      target: "Wedding Photographer Needed",
      time: "10 hours ago",
      details: "Updated budget and requirements",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    {
      id: "a14",
      type: "application",
      action: "Application status changed",
      user: "Admin",
      target: "Sarah Williams",
      time: "11 hours ago",
      details: "Application marked as 'Under Review'",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    },
    {
      id: "a15",
      type: "profile",
      action: "Profile updated",
      user: "Michael Smith",
      target: "Portfolio",
      time: "12 hours ago",
      details: "Added 15 new photos to portfolio",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
      id: "a16",
      type: "community",
      action: "Community post created",
      user: "Emily Johnson",
      target: "Wedding Planning Tips",
      time: "1 day ago",
      details: "Shared article on wedding planning timeline",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    {
      id: "a17",
      type: "system",
      action: "System maintenance",
      user: "System",
      target: "Platform Update",
      time: "1 day ago",
      details: "Platform updated to version 2.5.0",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=System",
    },
    {
      id: "a18",
      type: "alert",
      action: "Security alert",
      user: "System",
      target: "Login Attempt",
      time: "1 day ago",
      details: "Unusual login attempt detected and blocked",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=System",
    },
    {
      id: "a19",
      type: "premium",
      action: "Premium feature used",
      user: "Michael Smith",
      target: "Priority Listing",
      time: "1 day ago",
      details: "Used premium boost for job listing",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
      id: "a20",
      type: "review",
      action: "Review response added",
      user: "Michael Smith",
      target: "Jessica Thompson's Review",
      time: "1 day ago",
      details: "Responded to 5-star review with thanks",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
  ];

  // Generate real-time activities
  useEffect(() => {
    setIsLoading(true);
    // Simulate loading data
    setTimeout(() => {
      setActivities(mockActivities);
      setIsLoading(false);
    }, 1000);

    // Simulate new activities coming in
    const interval = setInterval(() => {
      const newActivity = {
        id: `a${Date.now()}`,
        type: ["message", "job", "application", "review", "user", "booking"][
          Math.floor(Math.random() * 6)
        ],
        action: "New activity",
        user: [
          "Emily Johnson",
          "Michael Smith",
          "Sarah Williams",
          "David Lee",
          "Jessica Thompson",
        ][Math.floor(Math.random() * 5)],
        target: "Platform",
        time: "Just now",
        details: "New real-time activity",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
      };
      setActivities((prev) => [newActivity, ...prev.slice(0, 49)]); // Keep only the latest 50 activities
    }, 30000); // Add new activity every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter activities based on selected tab
  const filteredActivities = activities.filter((activity) => {
    if (activeTab === "all") return true;
    return activity.type === activeTab;
  });

  // Get icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "job":
        return <Briefcase className="h-4 w-4 text-purple" />;
      case "application":
        return <Briefcase className="h-4 w-4 text-green-500" />;
      case "premium":
        return <Star className="h-4 w-4 text-yellow-500" />;
      case "review":
        return <Star className="h-4 w-4 text-orange-500" />;
      case "user":
        return <UserPlus className="h-4 w-4 text-indigo-500" />;
      case "booking":
        return <Calendar className="h-4 w-4 text-teal-500" />;
      case "favorite":
        return <Heart className="h-4 w-4 text-pink-500" />;
      case "report":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "approval":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "payment":
        return <DollarSign className="h-4 w-4 text-emerald-500" />;
      case "profile":
        return <User className="h-4 w-4 text-violet-500" />;
      case "community":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "system":
        return <Settings className="h-4 w-4 text-gray-500" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get badge color based on activity type
  const getActivityBadgeClass = (type) => {
    switch (type) {
      case "message":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "job":
        return "bg-purple/10 text-purple border-purple/20";
      case "application":
        return "bg-green-100 text-green-800 border-green-200";
      case "premium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "review":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "user":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "booking":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "favorite":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "report":
        return "bg-red-100 text-red-800 border-red-200";
      case "approval":
        return "bg-green-100 text-green-800 border-green-200";
      case "payment":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "profile":
        return "bg-violet-100 text-violet-800 border-violet-200";
      case "community":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "system":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "alert":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          Global Activity Feed
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <div className="px-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
            <TabsTrigger value="job">Jobs</TabsTrigger>
            <TabsTrigger value="application">Applications</TabsTrigger>
            <TabsTrigger value="user">Users</TabsTrigger>
            <TabsTrigger value="review">Reviews</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
          </div>
        ) : (
          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No activities found</p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md border border-transparent hover:border-gray-200 transition-all cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/profile/${activity.id}`)
                  }
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatar} alt={activity.user} />
                    <AvatarFallback>{activity.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/profile/${activity.id}`}
                          className="font-medium truncate hover:text-purple hover:underline"
                        >
                          {activity.user}
                        </Link>
                        <span className="text-gray-500">•</span>
                        <Badge
                          variant="outline"
                          className={`${getActivityBadgeClass(activity.type)} text-xs`}
                        >
                          <span className="flex items-center gap-1">
                            {getActivityIcon(activity.type)}
                            {activity.type.charAt(0).toUpperCase() +
                              activity.type.slice(1)}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">
                          {activity.time}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span>:{" "}
                      <span className="text-purple">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.details}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GlobalActivityFeed;
