import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Clock, ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  authorAvatar?: string;
  category: string;
  image?: string;
}

interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  postedDate: string;
  deadline: string;
  isPremium: boolean;
}

const NewsFeed: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching news and jobs
    setTimeout(() => {
      setNewsItems([
        {
          id: "1",
          title: "Top Wedding Trends for 2023",
          content:
            "Discover the latest wedding trends that are making waves this year. From sustainable decorations to intimate ceremonies, couples are embracing personalization and meaningful experiences.",
          date: "2023-06-15",
          author: "Wedding Planners Association",
          authorAvatar: "https://api.dicebear.com/7.x/shapes/svg?seed=WPA",
          category: "Premium",
          image:
            "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
        {
          id: "2",
          title: "How to Choose the Perfect Wedding Photographer",
          content:
            "Your wedding photos will last a lifetime, so choosing the right photographer is crucial. Learn what questions to ask, what to look for in portfolios, and how to find someone who matches your style.",
          date: "2023-06-10",
          author: "Photography Experts",
          authorAvatar: "https://api.dicebear.com/7.x/shapes/svg?seed=PE",
          category: "Premium",
          image:
            "https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
        {
          id: "3",
          title: "Budget-Friendly Wedding Reception Ideas",
          content:
            "Planning a wedding on a budget doesn't mean sacrificing style. Explore creative ways to save on your reception while still creating a memorable experience for you and your guests.",
          date: "2023-06-05",
          author: "Budget Weddings",
          authorAvatar: "https://api.dicebear.com/7.x/shapes/svg?seed=BW",
          category: "Premium",
          image:
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
      ]);

      setJobPosts([
        {
          id: "j1",
          title: "Wedding Photographer Needed for Summer Event",
          company: "Johnson Wedding",
          location: "New York, NY",
          postedDate: "2023-06-01",
          deadline: "2023-07-15",
          isPremium: true,
        },
        {
          id: "j2",
          title: "Experienced Florist for Garden Wedding",
          company: "Smith-Garcia Wedding",
          location: "Los Angeles, CA",
          postedDate: "2023-06-05",
          deadline: "2023-07-10",
          isPremium: false,
        },
        {
          id: "j3",
          title: "Wedding DJ with Modern Music Selection",
          company: "Williams Wedding",
          location: "Chicago, IL",
          postedDate: "2023-06-10",
          deadline: "2023-07-20",
          isPremium: true,
        },
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* News Feed - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-purple">Latest News Feed</h2>
            <Link
              to="/news"
              className="text-purple hover:text-purple/80 text-sm font-medium flex items-center"
            >
              View all news <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Only show premium member posts */}
              {newsItems
                .filter((item) => item.category === "Premium")
                .map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {item.image && (
                        <div className="md:col-span-1">
                          <div className="h-48 md:h-full w-full overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </div>
                        </div>
                      )}
                      <div
                        className={`p-6 ${item.image ? "md:col-span-2" : "md:col-span-3"}`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="outline"
                            className="bg-purple/10 text-purple border-purple/20"
                          >
                            {item.category}
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />{" "}
                            {formatDate(item.date)}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {item.content}
                        </p>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              {item.authorAvatar ? (
                                <AvatarImage
                                  src={item.authorAvatar}
                                  alt={item.author}
                                />
                              ) : (
                                <AvatarFallback>
                                  {item.author.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <span className="text-sm text-gray-700">
                              {item.author}
                            </span>
                          </div>
                          <Button
                            variant="link"
                            className="text-purple p-0 h-auto"
                          >
                            Read more
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>

        {/* Sidebar - Open Jobs */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-purple mb-4">Open Jobs</h2>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-gray-100 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {jobPosts.map((job) => (
                  <Card
                    key={job.id}
                    className="overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800">
                          {job.title}
                        </h3>
                        {job.isPremium && (
                          <Badge className="bg-purple text-white">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {job.company}
                      </p>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Deadline: {formatDate(job.deadline)}
                        </div>
                      </div>

                      {isAuthenticated ? (
                        <Button
                          className="w-full bg-purple hover:bg-purple/90"
                          onClick={() =>
                            (window.location.href = `/dashboard/${job.id}`)
                          }
                        >
                          Apply Now
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-not-allowed flex items-center justify-center gap-2"
                          onClick={() => (window.location.href = "/login")}
                        >
                          <Lock className="h-4 w-4" /> Login to Apply
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}

                <div className="text-center pt-2">
                  <Link
                    to={isAuthenticated ? "/dashboard/client" : "/login"}
                    className="inline-flex items-center text-purple hover:text-purple/80 font-medium"
                  >
                    View all job postings{" "}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Join Our Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Connect with other wedding professionals and couples planning
                their special day.
              </p>
              <Button className="w-full bg-purple hover:bg-purple/90">
                {isAuthenticated ? "Go to Dashboard" : "Register Now"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
