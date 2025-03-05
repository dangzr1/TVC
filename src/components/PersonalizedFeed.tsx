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

const PersonalizedFeed = () => {
  const [activeTab, setActiveTab] = useState("foryou");
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for personalized feed
  const mockActivities = {
    foryou: [
      {
        id: "p1",
        type: "job_match",
        title: "Perfect Job Match: Wedding Photographer Needed",
        description: "This job matches your skills and preferences (98% match)",
        user: "David Lee",
        time: "15 minutes ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        priority: "high",
      },
      {
        id: "p2",
        type: "message",
        title: "New message from potential client",
        description:
          "Emily Johnson: Hi, I'm interested in your photography services...",
        user: "Emily Johnson",
        time: "30 minutes ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        priority: "high",
      },
      {
        id: "p3",
        type: "premium_opportunity",
        title: "Premium Opportunity: Featured Listing Available",
        description:
          "Boost your visibility with a featured listing spot (5 spots left)",
        user: "System",
        time: "1 hour ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=System",
        priority: "medium",
      },
      {
        id: "p4",
        type: "application_update",
        title: "Your application status changed",
        description:
          "Your application for 'Wedding Photographer' is now 'Under Review'",
        user: "Jessica Thompson",
        time: "2 hours ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
        priority: "high",
      },
      {
        id: "p5",
        type: "review",
        title: "New 5-star review received",
        description:
          "Jessica Thompson left you a 5-star review: 'Amazing photographer!'",
        user: "Jessica Thompson",
        time: "3 hours ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
        priority: "medium",
      },
      {
        id: "p6",
        type: "trending",
        title: "Trending in your area: Wedding Venues",
        description:
          "Wedding venues are trending in your area. Update your services?",
        user: "System",
        time: "4 hours ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=System",
        priority: "low",
      },
      {
        id: "p7",
        type: "booking",
        title: "New booking request",
        description:
          "Emily Johnson requested to book your services for June 15th",
        user: "Emily Johnson",
        time: "5 hours ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        priority: "high",
      },
    ],
    connections: [
      {
        id: "c1",
        type: "new_connection",
        title: "New connection: Sarah Williams",
        description: "Sarah Williams (Wedding Photographer) connected with you",
        user: "Sarah Williams",
        time: "1 hour ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      {
        id: "c2",
        type: "connection_activity",
        title: "Michael Smith updated his portfolio",
        description: "Your connection Michael Smith added 15 new photos",
        user: "Michael Smith",
        time: "2 hours ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      },
      {
        id: "c3",
        type: "connection_milestone",
        title: "Jessica Thompson reached 100 clients",
        description: "Your connection Jessica Thompson celebrated a milestone",
        user: "Jessica Thompson",
        time: "3 hours ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
      },
      {
        id: "c4",
        type: "connection_job",
        title: "Robert Chen posted a new job",
        description:
          "Your connection Robert Chen is looking for a wedding photographer",
        user: "Robert Chen",
        time: "4 hours ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      },
    ],
    jobs: [
      {
        id: "j1",
        type: "new_job",
        title: "New Job: Wedding Photographer Needed",
        description: "$2,000-$3,000 budget, June 15th event in New York",
        user: "David Lee",
        time: "15 minutes ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        match: "98%",
      },
      {
        id: "j2",
        type: "new_job",
        title: "New Job: Engagement Photographer",
        description: "$500-$800 budget, May 20th session in Central Park",
        user: "Emily Johnson",
        time: "1 hour ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        match: "85%",
      },
      {
        id: "j3",
        type: "new_job",
        title: "New Job: Wedding Videographer",
        description: "$3,000-$4,000 budget, July 10th event in Boston",
        user: "Jessica Thompson",
        time: "2 hours ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
        match: "75%",
      },
      {
        id: "j4",
        type: "job_update",
        title: "Job Updated: Wedding Photographer",
        description: "Budget increased to $3,500-$4,500, requirements updated",
        user: "Robert Chen",
        time: "3 hours ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
        match: "90%",
      },
    ],
    insights: [
      {
        id: "i1",
        type: "profile_views",
        title: "Your profile views increased by 45%",
        description:
          "Your profile has been viewed 120 times in the last 7 days",
        time: "1 day ago",
        icon: <Eye className="h-10 w-10 text-blue-500" />,
      },
      {
        id: "i2",
        type: "application_stats",
        title: "Your application success rate: 75%",
        description:
          "You've been selected for 3 out of 4 recent job applications",
        time: "2 days ago",
        icon: <CheckCircle className="h-10 w-10 text-green-500" />,
      },
      {
        id: "i3",
        type: "earnings",
        title: "Earnings this month: $4,500",
        description: "You've earned 30% more than last month",
        time: "3 days ago",
        icon: <DollarSign className="h-10 w-10 text-emerald-500" />,
      },
      {
        id: "i4",
        type: "market_trend",
        title: "Market Trend: Wedding Photography +15%",
        description: "Wedding photography demand is up 15% in your area",
        time: "4 days ago",
        icon: <TrendingUp className="h-10 w-10 text-purple" />,
      },
    ],
    saved: [
      {
        id: "s1",
        type: "saved_job",
        title: "Saved Job: Wedding Photographer",
        description:
          "You saved this job 2 days ago. Application deadline: May 15",
        user: "David Lee",
        time: "2 days ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      },
      {
        id: "s2",
        type: "saved_profile",
        title: "Saved Profile: Emily Johnson",
        description: "You saved this client profile 3 days ago",
        user: "Emily Johnson",
        time: "3 days ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      },
      {
        id: "s3",
        type: "saved_article",
        title: "Saved Article: Wedding Photography Tips",
        description: "You saved this article 4 days ago",
        user: "System",
        time: "4 days ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=System",
      },
    ],
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
          <TabsList className="grid grid-cols-5 mb-4">
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() =>
                              (window.location.href = `/messages?user=${activity.id}`)
                            }
                          >
                            Message
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
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonalizedFeed;
