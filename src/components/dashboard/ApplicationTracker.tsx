import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock3,
} from "lucide-react";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: "pending" | "reviewed" | "interview" | "accepted" | "rejected";
  lastUpdated: string;
  nextStep?: string;
  nextStepDate?: string;
  notes?: string;
  timeline: {
    status: string;
    date: string;
    note?: string;
  }[];
}

const ApplicationTracker: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from a database
    // For demo purposes, we'll use localStorage with some defaults
    const storedApplications = localStorage.getItem("jobApplications");

    if (storedApplications) {
      setApplications(JSON.parse(storedApplications));
    } else {
      // Check if we have any applied jobs in other localStorage items
      const appliedJobs = JSON.parse(
        localStorage.getItem("appliedJobs") || "[]",
      );
      const userPrefs = JSON.parse(
        localStorage.getItem("userJobPreferences") || "{}",
      );
      const userAppliedJobs = userPrefs.appliedJobs || [];

      // Combine all applied jobs
      const allAppliedJobs = [...new Set([...appliedJobs, ...userAppliedJobs])];

      if (allAppliedJobs.length > 0) {
        // Create application objects from applied jobs
        const newApplications = allAppliedJobs.map(
          (jobTitle: string, index: number) => ({
            id: `app-${Date.now()}-${index}`,
            jobTitle,
            company: getRandomCompany(),
            location: getRandomLocation(),
            appliedDate: new Date(
              Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            status: getRandomStatus(),
            lastUpdated: new Date().toISOString(),
            timeline: [
              {
                status: "applied",
                date: new Date(
                  Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
            ],
          }),
        );

        setApplications(newApplications);
        localStorage.setItem(
          "jobApplications",
          JSON.stringify(newApplications),
        );
      } else {
        // Default applications if no applied jobs found
        const defaultApplications: Application[] = [
          {
            id: "app1",
            jobTitle: "Wedding Photographer",
            company: "Johnson Wedding",
            location: "New York, NY",
            appliedDate: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            status: "interview",
            lastUpdated: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            nextStep: "Interview with client",
            nextStepDate: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            timeline: [
              {
                status: "applied",
                date: new Date(
                  Date.now() - 2 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
              {
                status: "reviewed",
                date: new Date(
                  Date.now() - 1.5 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
              {
                status: "interview",
                date: new Date(
                  Date.now() - 1 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                note: "Interview scheduled for next week",
              },
            ],
          },
          {
            id: "app2",
            jobTitle: "Event Photographer",
            company: "Smith-Garcia Wedding",
            location: "Los Angeles, CA",
            appliedDate: new Date(
              Date.now() - 5 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            status: "accepted",
            lastUpdated: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            timeline: [
              {
                status: "applied",
                date: new Date(
                  Date.now() - 5 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
              {
                status: "reviewed",
                date: new Date(
                  Date.now() - 4 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
              {
                status: "interview",
                date: new Date(
                  Date.now() - 3 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
              {
                status: "accepted",
                date: new Date(
                  Date.now() - 1 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                note: "Offer accepted! Contract to be signed.",
              },
            ],
          },
          {
            id: "app3",
            jobTitle: "Wedding DJ",
            company: "Williams Wedding",
            location: "Chicago, IL",
            appliedDate: new Date(
              Date.now() - 10 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            status: "rejected",
            lastUpdated: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            timeline: [
              {
                status: "applied",
                date: new Date(
                  Date.now() - 10 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
              {
                status: "reviewed",
                date: new Date(
                  Date.now() - 8 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
              {
                status: "rejected",
                date: new Date(
                  Date.now() - 7 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                note: "Position filled by another candidate",
              },
            ],
          },
          {
            id: "app4",
            jobTitle: "Wedding Florist",
            company: "Chen-Davis Wedding",
            location: "Boston, MA",
            appliedDate: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            status: "pending",
            lastUpdated: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            timeline: [
              {
                status: "applied",
                date: new Date(
                  Date.now() - 1 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
            ],
          },
        ];

        setApplications(defaultApplications);
        localStorage.setItem(
          "jobApplications",
          JSON.stringify(defaultApplications),
        );
      }
    }

    setIsLoading(false);

    // Listen for job application updates
    const handleJobApplicationUpdate = (event: CustomEvent) => {
      const { jobTitle, isApplying } = event.detail;

      if (isApplying) {
        // Add new application
        const newApplication: Application = {
          id: `app-${Date.now()}`,
          jobTitle,
          company: getRandomCompany(),
          location: getRandomLocation(),
          appliedDate: new Date().toISOString(),
          status: "pending",
          lastUpdated: new Date().toISOString(),
          timeline: [
            {
              status: "applied",
              date: new Date().toISOString(),
            },
          ],
        };

        setApplications((prev) => {
          const updated = [newApplication, ...prev];
          localStorage.setItem("jobApplications", JSON.stringify(updated));
          return updated;
        });

        // Create notification
        const newNotification = {
          id: `notif-${Date.now()}`,
          type: "application",
          title: "Application Submitted",
          description: `You've successfully applied for ${jobTitle}`,
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: "/dashboard/vendor?tab=applications",
        };

        window.dispatchEvent(
          new CustomEvent("new-notification", {
            detail: newNotification,
          }),
        );
      } else {
        // Remove application
        setApplications((prev) => {
          const updated = prev.filter((app) => app.jobTitle !== jobTitle);
          localStorage.setItem("jobApplications", JSON.stringify(updated));
          return updated;
        });
      }
    };

    window.addEventListener(
      "job-application-update" as any,
      handleJobApplicationUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "job-application-update" as any,
        handleJobApplicationUpdate as EventListener,
      );
    };
  }, []);

  // Helper functions for random data generation
  function getRandomCompany() {
    const companies = [
      "Johnson Wedding",
      "Smith-Garcia Wedding",
      "Williams Wedding",
      "Chen-Davis Wedding",
      "Taylor Wedding",
      "Martinez Engagement",
    ];
    return companies[Math.floor(Math.random() * companies.length)];
  }

  function getRandomLocation() {
    const locations = [
      "New York, NY",
      "Los Angeles, CA",
      "Chicago, IL",
      "Boston, MA",
      "Miami, FL",
      "Seattle, WA",
      "Remote",
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  function getRandomStatus() {
    const statuses = [
      "pending",
      "reviewed",
      "interview",
      "accepted",
      "rejected",
    ];
    const weights = [0.4, 0.3, 0.15, 0.1, 0.05]; // Higher weight for pending

    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random < sum) {
        return statuses[i];
      }
    }
    return "pending";
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Pending
          </Badge>
        );
      case "reviewed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Reviewed
          </Badge>
        );
      case "interview":
        return (
          <Badge variant="outline" className="bg-purple/10 text-purple">
            Interview
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <Briefcase className="h-4 w-4 text-gray-600" />;
      case "reviewed":
        return <Clock3 className="h-4 w-4 text-blue-600" />;
      case "interview":
        return <Calendar className="h-4 w-4 text-purple" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  // Filter applications based on active tab
  const filteredApplications = applications.filter((app) => {
    if (activeTab === "all") return true;
    return app.status === activeTab;
  });

  // Calculate statistics
  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    reviewed: applications.filter((app) => app.status === "reviewed").length,
    interview: applications.filter((app) => app.status === "interview").length,
    accepted: applications.filter((app) => app.status === "accepted").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Application Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <Progress value={100} className="h-1 mt-2" />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Pending</div>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <Progress
                  value={(stats.pending / stats.total) * 100}
                  className="h-1 mt-2 bg-gray-200"
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">In Progress</div>
                <div className="text-2xl font-bold">
                  {stats.reviewed + stats.interview}
                </div>
                <Progress
                  value={
                    ((stats.reviewed + stats.interview) / stats.total) * 100
                  }
                  className="h-1 mt-2 bg-purple/20"
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Accepted</div>
                <div className="text-2xl font-bold">{stats.accepted}</div>
                <Progress
                  value={(stats.accepted / stats.total) * 100}
                  className="h-1 mt-2 bg-green-200"
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Rejected</div>
                <div className="text-2xl font-bold">{stats.rejected}</div>
                <Progress
                  value={(stats.rejected / stats.total) * 100}
                  className="h-1 mt-2 bg-red-200"
                />
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
                <TabsTrigger value="interview">Interview</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No applications found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApplications.map((application) => (
                      <div
                        key={application.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        <div className="p-4 bg-white">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <h3 className="font-medium text-lg">
                                {application.jobTitle}
                              </h3>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Briefcase className="h-4 w-4 mr-1" />
                                  {application.company}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {application.location}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Applied: {formatDate(application.appliedDate)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {getStatusBadge(application.status)}
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="text-sm font-medium mb-3">
                              Application Timeline
                            </h4>
                            <div className="space-y-3">
                              {application.timeline.map((event, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3"
                                >
                                  <div className="mt-0.5">
                                    {getStatusIcon(event.status)}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm capitalize">
                                        {event.status}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatDate(event.date)}
                                      </span>
                                    </div>
                                    {event.note && (
                                      <p className="text-sm text-gray-600 mt-0.5">
                                        {event.note}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Next Steps (if any) */}
                          {application.nextStep && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="bg-purple/5 p-3 rounded-lg border border-purple/20">
                                <h4 className="text-sm font-medium text-purple mb-1">
                                  Next Steps
                                </h4>
                                <p className="text-sm">
                                  {application.nextStep}
                                </p>
                                {application.nextStepDate && (
                                  <div className="flex items-center text-xs text-gray-600 mt-1">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(application.nextStepDate)}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationTracker;
