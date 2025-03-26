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

  // Empty activity feed until real data is available
  const mockActivities = [];

  // Load real activities when available
  useEffect(() => {
    setIsLoading(true);
    // Set empty activities until real data is available
    setActivities(mockActivities);
    setIsLoading(false);
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
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
            <TabsTrigger value="job">Jobs</TabsTrigger>
            <TabsTrigger value="application">Applications</TabsTrigger>
            <TabsTrigger value="user">Users</TabsTrigger>
            <TabsTrigger value="review">Reviews</TabsTrigger>
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
