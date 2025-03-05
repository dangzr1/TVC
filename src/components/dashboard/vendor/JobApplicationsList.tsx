import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Calendar,
  Building,
  MapPin,
  Bell,
  AlertCircle,
  Check,
} from "lucide-react";
import ContactInfoModal from "@/components/dashboard/ContactInfoModal";
import { Progress } from "@/components/ui/progress";

interface JobApplication {
  id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  company_logo?: string;
  location: string;
  applied_at: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  has_unread_messages: boolean;
}

const JobApplicationsList = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);
  const [newJobAlert, setNewJobAlert] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [progress, setProgress] = useState(100);
  const refreshIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    fetchApplications();

    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      setLastRefresh(Date.now());
      fetchApplications();

      // Simulate new job alerts occasionally
      if (Math.random() > 0.7) {
        const companies = [
          "TechCorp Inc.",
          "Creative Solutions",
          "Cloud Systems",
          "WebTech Solutions",
          "Digital Innovations",
        ];
        const positions = [
          "Senior Developer",
          "UX Designer",
          "Project Manager",
          "DevOps Engineer",
          "Marketing Specialist",
        ];
        const company = companies[Math.floor(Math.random() * companies.length)];
        const position =
          positions[Math.floor(Math.random() * positions.length)];
        setNewJobAlert(`New job alert: ${position} at ${company}`);

        // Clear the alert after 5 seconds
        setTimeout(() => setNewJobAlert(null), 5000);
      }
    }, 30000);

    // Set up progress bar that counts down to next refresh
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - lastRefresh;
      const remaining = Math.max(0, 100 - (elapsed / 30000) * 100);
      setProgress(remaining);
    }, 100);

    refreshIntervalRef.current = refreshInterval as unknown as number;

    return () => {
      clearInterval(refreshInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // Update progress when lastRefresh changes
  useEffect(() => {
    setProgress(100);
  }, [lastRefresh]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from Supabase
      // For demo purposes, we'll use mock data
      const mockApplications: JobApplication[] = [
        {
          id: "app1",
          job_id: "1",
          job_title: "Senior Web Developer",
          company_name: "TechCorp Inc.",
          company_logo: "https://api.dicebear.com/7.x/shapes/svg?seed=TC",
          location: "New York, NY",
          applied_at: "2023-06-20",
          status: "pending",
          has_unread_messages: true,
        },
        {
          id: "app2",
          job_id: "2",
          job_title: "UX/UI Designer",
          company_name: "Creative Solutions",
          company_logo: "https://api.dicebear.com/7.x/shapes/svg?seed=CS",
          location: "Remote",
          applied_at: "2023-06-15",
          status: "pending",
          has_unread_messages: false,
        },
        {
          id: "app3",
          job_id: "3",
          job_title: "DevOps Engineer",
          company_name: "Cloud Systems",
          company_logo: "https://api.dicebear.com/7.x/shapes/svg?seed=CS",
          location: "San Francisco, CA",
          applied_at: "2023-06-10",
          status: "accepted",
          has_unread_messages: true,
        },
        {
          id: "app4",
          job_id: "4",
          job_title: "Frontend Developer",
          company_name: "WebTech Solutions",
          company_logo: "https://api.dicebear.com/7.x/shapes/svg?seed=WS",
          location: "Chicago, IL",
          applied_at: "2023-06-05",
          status: "rejected",
          has_unread_messages: false,
        },
      ];

      // Occasionally add a new application to simulate real-time updates
      if (Math.random() > 0.8 && applications.length > 0) {
        const newId = `app${Date.now()}`;
        const randomJobTitles = [
          "Mobile Developer",
          "Data Scientist",
          "Product Manager",
          "QA Engineer",
          "Full Stack Developer",
        ];
        const randomCompanies = [
          "Innovate Tech",
          "Digital Frontier",
          "NextGen Solutions",
          "Future Systems",
          "Tech Pioneers",
        ];
        const randomLocations = [
          "Boston, MA",
          "Austin, TX",
          "Seattle, WA",
          "Denver, CO",
          "Remote",
        ];

        mockApplications.unshift({
          id: newId,
          job_id: `job${Date.now()}`,
          job_title:
            randomJobTitles[Math.floor(Math.random() * randomJobTitles.length)],
          company_name:
            randomCompanies[Math.floor(Math.random() * randomCompanies.length)],
          company_logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${Math.random()}`,
          location:
            randomLocations[Math.floor(Math.random() * randomLocations.length)],
          applied_at: new Date().toISOString().split("T")[0],
          status: "pending",
          has_unread_messages: false,
        });
      }

      setApplications(mockApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewApplicationDetails = (application: JobApplication) => {
    // Set the selected application regardless of status
    setSelectedApplication(application);
    setIsContactModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;

      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (activeTab === "all") return true;
    return app.status === activeTab;
  });

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <CardTitle>My Job Applications</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Live feed of your job applications
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <div className="text-xs text-muted-foreground">Auto-refreshing</div>
          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
            <Progress value={progress} className="h-full" />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={() => {
              setLastRefresh(Date.now());
              fetchApplications();
            }}
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {newJobAlert && (
          <div className="mb-4 p-3 bg-purple/10 border border-purple/20 rounded-md flex items-center gap-2">
            <Bell className="h-4 w-4 text-purple" />
            <p className="text-sm text-purple font-medium">{newJobAlert}</p>
          </div>
        )}

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-purple border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <p>No applications found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div
                    id={`application-${application.id}`}
                    key={application.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer bg-white hover:bg-gradient-to-r hover:from-purple/5 hover:to-pink/5 transform hover:-translate-y-1"
                    onClick={() => viewApplicationDetails(application)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          {application.company_logo ? (
                            <img
                              src={application.company_logo}
                              alt={application.company_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {application.job_title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {application.company_name}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {application.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        {getStatusBadge(application.status)}
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Applied: {application.applied_at}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewApplicationDetails(application);
                          }}
                        >
                          View Details
                        </Button>
                        {application.status === "pending" && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-purple hover:bg-purple/90"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApplication(application);
                              setIsContactModalOpen(true);
                            }}
                          >
                            Manage
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Contact Info Modal */}
      {selectedApplication && (
        <ContactInfoModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          contactInfo={{
            name: selectedApplication.company_name,
            email: `contact@${selectedApplication.company_name.toLowerCase().replace(/\s+/g, "")}.com`,
            phone: "(555) 987-6543",
            website: `https://www.${selectedApplication.company_name.toLowerCase().replace(/\s+/g, "")}.com`,
            location: selectedApplication.location,
          }}
          applicationType="vendor"
          jobTitle={selectedApplication.job_title}
        />
      )}
    </Card>
  );
};

export default JobApplicationsList;
