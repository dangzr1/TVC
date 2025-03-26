import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Zap,
  Bookmark,
  ThumbsUp,
  TrendingUp,
  Award,
  FileText,
  Trash,
  BarChart2,
} from "lucide-react";
import { Link } from "react-router-dom";
import GlobalActivityFeed from "./GlobalActivityFeed";

const PersonalizedFeed = () => {
  const [activeTab, setActiveTab] = useState("foryou");
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Empty data for personalized feed until real data is available
  const mockActivities = {
    foryou: [],
    connections: [],
    jobs: [],
    insights: [],
    saved: [],
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate loading data
    setTimeout(() => {
      setActivities(mockActivities[activeTab] || []);
      setIsLoading(false);
    }, 800);
  }, [activeTab]);

  // Get icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case "job_match":
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "premium_opportunity":
        return <Star className="h-5 w-5 text-purple" />;
      case "application_update":
        return <Briefcase className="h-5 w-5 text-green-500" />;
      case "review":
        return <Star className="h-5 w-5 text-orange-500" />;
      case "trending":
        return <TrendingUp className="h-5 w-5 text-red-500" />;
      case "booking":
        return <Calendar className="h-5 w-5 text-teal-500" />;
      case "new_connection":
        return <UserPlus className="h-5 w-5 text-indigo-500" />;
      case "connection_activity":
        return <User className="h-5 w-5 text-blue-500" />;
      case "connection_milestone":
        return <Award className="h-5 w-5 text-yellow-500" />;
      case "connection_job":
        return <Briefcase className="h-5 w-5 text-green-500" />;
      case "new_job":
        return <Briefcase className="h-5 w-5 text-purple" />;
      case "job_update":
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      case "profile_views":
        return <Eye className="h-5 w-5 text-blue-500" />;
      case "application_stats":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "earnings":
        return <DollarSign className="h-5 w-5 text-emerald-500" />;
      case "market_trend":
        return <TrendingUp className="h-5 w-5 text-purple" />;
      case "saved_job":
        return <Bookmark className="h-5 w-5 text-purple" />;
      case "saved_profile":
        return <User className="h-5 w-5 text-blue-500" />;
      case "saved_article":
        return <FileText className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get background color based on priority
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-50 border-red-200";
      case "medium":
        return "bg-yellow-50 border-yellow-200";
      case "low":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">
          Your Personalized Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="foryou"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="foryou" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              For You
            </TabsTrigger>
            <TabsTrigger
              value="connections"
              className="flex items-center gap-1"
            >
              <Users className="h-4 w-4" />
              Connections
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              Saved
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="foryou" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`p-4 rounded-lg border ${getPriorityClass(activity.priority)} hover:shadow-md transition-all cursor-pointer`}
                    onClick={() =>
                      (window.location.href = `/profile/${activity.id}`)
                    }
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{activity.title}</h3>
                          <div className="flex items-center gap-2">
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
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={activity.avatar}
                              alt={activity.user}
                            />
                            <AvatarFallback>{activity.user[0]}</AvatarFallback>
                          </Avatar>
                          <Link
                            to={`/profile/${activity.id}`}
                            className="text-xs text-gray-500 hover:text-purple hover:underline"
                          >
                            {activity.user}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="connections" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 rounded-lg border bg-indigo-50 border-indigo-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={activity.avatar}
                          alt={activity.user}
                        />
                        <AvatarFallback>{activity.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{activity.title}</h3>
                          <span className="text-xs text-gray-500">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            className="h-8 bg-indigo-600 hover:bg-indigo-700"
                            onClick={() =>
                              (window.location.href = `/profile/${activity.id}`)
                            }
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="jobs" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 rounded-lg border bg-purple/5 border-purple/20 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={activity.avatar}
                            alt={activity.user}
                          />
                          <AvatarFallback>{activity.user[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{activity.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-green-100 text-green-800">
                              {activity.match} Match
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Posted {activity.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-purple hover:bg-purple/90"
                        onClick={() => {
                          alert(`Applied to job: ${activity.title}`);
                          // In a real app, this would submit an application
                        }}
                      >
                        Quick Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 rounded-lg border bg-gray-50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-full shadow-sm">
                        {activity.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{activity.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <span className="text-xs text-gray-500 mt-2 inline-block">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 rounded-lg border hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{activity.title}</h3>
                          <span className="text-xs text-gray-500">
                            Saved {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => {
                              if (activity.type === "saved_job") {
                                window.location.href = `/dashboard/client?tab=jobs`;
                              } else if (activity.type === "saved_profile") {
                                window.location.href = `/profile/${activity.id}`;
                              } else {
                                alert(`Viewing: ${activity.title}`);
                              }
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => {
                              alert(
                                `Removed from saved items: ${activity.title}`,
                              );
                              // In a real app, this would remove the item from saved items
                            }}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <GlobalActivityFeed />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonalizedFeed;
