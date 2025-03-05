import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, User, Calendar } from "lucide-react";
import ContactInfoModal from "@/components/dashboard/ContactInfoModal";

interface Application {
  id: string;
  applicantName: string;
  applicantAvatar?: string;
  jobTitle: string;
  appliedDate: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  hasUnreadMessages: boolean;
}

interface RecentApplicationsProps {
  applications?: Application[];
  onViewApplication?: (id: string) => void;
  onAcceptApplication?: (id: string) => void;
  onRejectApplication?: (id: string) => void;
  onMessageApplicant?: (id: string) => void;
}

const RecentApplications: React.FC<RecentApplicationsProps> = ({
  applications = [
    {
      id: "app1",
      applicantName: "Michael Johnson",
      applicantAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      jobTitle: "Senior Frontend Developer",
      appliedDate: "2023-06-18",
      status: "pending",
      hasUnreadMessages: true,
    },
    {
      id: "app2",
      applicantName: "Sarah Williams",
      applicantAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      jobTitle: "Senior Frontend Developer",
      appliedDate: "2023-06-20",
      status: "pending",
      hasUnreadMessages: false,
    },
    {
      id: "app3",
      applicantName: "David Lee",
      applicantAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      jobTitle: "Backend Engineer",
      appliedDate: "2023-07-05",
      status: "pending",
      hasUnreadMessages: false,
    },
    {
      id: "app4",
      applicantName: "Emily Chen",
      applicantAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      jobTitle: "UX Designer",
      appliedDate: "2023-07-10",
      status: "accepted",
      hasUnreadMessages: true,
    },
    {
      id: "app5",
      applicantName: "Robert Smith",
      applicantAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      jobTitle: "Backend Engineer",
      appliedDate: "2023-07-03",
      status: "rejected",
      hasUnreadMessages: false,
    },
  ],
  onViewApplication = (id) => console.log(`View application ${id}`),
  onAcceptApplication = (id) => console.log(`Accept application ${id}`),
  onRejectApplication = (id) => console.log(`Reject application ${id}`),
  onMessageApplicant = (id) => console.log(`Message applicant ${id}`),
}) => {
  const [localApplications, setLocalApplications] =
    useState<Application[]>(applications);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  const handleAccept = (id: string) => {
    // Find the application that was accepted
    const acceptedApp = localApplications.find((app) => app.id === id);

    // Update the status
    setLocalApplications((prevApps) =>
      prevApps.map((app) =>
        app.id === id ? { ...app, status: "accepted" } : app,
      ),
    );

    // Call the callback
    onAcceptApplication(id);

    // Open the contact modal with the accepted application
    if (acceptedApp) {
      setSelectedApplication(acceptedApp);
      setIsContactModalOpen(true);
    }
  };

  const handleReject = (id: string) => {
    setLocalApplications((prevApps) =>
      prevApps.map((app) =>
        app.id === id ? { ...app, status: "rejected" } : app,
      ),
    );
    onRejectApplication(id);
  };

  const handleViewApplication = (id: string) => {
    const app = localApplications.find((app) => app.id === id);

    // If the application is accepted, show contact info
    if (app && app.status === "accepted") {
      setSelectedApplication(app);
      setIsContactModalOpen(true);
    } else {
      // Otherwise just view the application details
      onViewApplication(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;

      case "accepted":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Accepted</Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <>
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {localApplications.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No applications found
              </div>
            ) : (
              localApplications.map((application) => (
                <div
                  id={`application-${application.id}`}
                  key={application.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center mb-3 sm:mb-0">
                    <Avatar className="h-10 w-10 mr-3">
                      {application.applicantAvatar ? (
                        <AvatarImage
                          src={application.applicantAvatar}
                          alt={application.applicantName}
                        />
                      ) : (
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {application.applicantName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.jobTitle}
                      </div>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Applied: {application.appliedDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="mr-2">
                      {getStatusBadge(application.status)}
                    </div>

                    {application.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => handleAccept(application.id)}
                        >
                          <Check className="h-4 w-4 mr-1" /> Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => handleReject(application.id)}
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      className="relative"
                      onClick={() => handleViewApplication(application.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      {/* Contact Info Modal */}
      {selectedApplication && (
        <ContactInfoModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          contactInfo={{
            name: selectedApplication.applicantName,
            email: `${selectedApplication.applicantName.toLowerCase().replace(" ", ".")}@example.com`,
            phone: "(555) 123-4567",
            website: `https://${selectedApplication.applicantName.toLowerCase().replace(" ", "")}.portfolio.com`,
            location: "New York, NY",
          }}
          applicationType="client"
          jobTitle={selectedApplication.jobTitle}
        />
      )}
    </>
  );
};

export default RecentApplications;
