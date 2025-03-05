import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Search, Check, X } from "lucide-react";
import ContactInfoModal from "@/components/dashboard/ContactInfoModal";

interface Applicant {
  id: string;
  name: string;
  email: string;
  position: string;
  appliedDate: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
}

const ApplicationsTable = () => {
  const [applications, setApplications] = useState<Applicant[]>(() => {
    // Try to load applications from localStorage
    const savedApplications = localStorage.getItem("savedApplications");
    return savedApplications
      ? JSON.parse(savedApplications)
      : [
          {
            id: "1",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            position: "Senior Frontend Developer",
            appliedDate: "2023-06-20",
            status: "pending",
          },
          {
            id: "2",
            name: "Michael Johnson",
            email: "michael.j@example.com",
            position: "Senior Frontend Developer",
            appliedDate: "2023-06-18",
            status: "pending",
          },
          {
            id: "3",
            name: "David Lee",
            email: "david.lee@example.com",
            position: "Backend Engineer",
            appliedDate: "2023-07-05",
            status: "pending",
          },
        ];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null,
  );
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState<
    Record<string, boolean>
  >({});

  const handleStatusChange = (
    applicantId: string,
    newStatus: "pending" | "reviewed" | "accepted" | "rejected",
  ) => {
    const updatedApplications = applications.map((app) =>
      app.id === applicantId ? { ...app, status: newStatus } : app,
    );

    // Update state and save to localStorage
    setApplications(updatedApplications);
    localStorage.setItem(
      "savedApplications",
      JSON.stringify(updatedApplications),
    );

    // Show a confirmation message
    const app = applications.find((a) => a.id === applicantId);
    if (app) {
      const action = newStatus === "accepted" ? "accepted" : "rejected";
      const message = document.createElement("div");
      message.className = `fixed top-4 right-4 p-4 rounded-md ${newStatus === "accepted" ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"} shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300`;
      message.innerHTML = `<div class="flex items-center gap-2">
        ${newStatus === "accepted" ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'}
        <span>Application ${action}</span>
      </div>`;
      document.body.appendChild(message);

      // Remove the message after 3 seconds
      setTimeout(() => {
        message.classList.add("animate-out", "fade-out", "slide-out-to-top-5");
        setTimeout(() => document.body.removeChild(message), 300);
      }, 3000);
    }
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
    if (!searchTerm) return true;
    return (
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Job Applications</h2>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search applications..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-5 bg-muted p-4 font-medium">
          <div>Applicant</div>
          <div>Job Position</div>
          <div>Applied Date</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No applications found.
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div
              key={application.id}
              className="grid grid-cols-5 p-4 border-t items-center hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-medium">{application.name}</p>
                <p className="text-sm text-muted-foreground">
                  {application.email}
                </p>
              </div>
              <div>{application.position}</div>
              <div>{application.appliedDate}</div>
              <div>{getStatusBadge(application.status)}</div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedApplicant(application);
                    setIsContactModalOpen(true);
                  }}
                >
                  View Details
                </Button>

                {application.status === "pending" && (
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500 text-green-600 hover:bg-green-50 px-2"
                      onClick={() =>
                        handleStatusChange(application.id, "accepted")
                      }
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-600 hover:bg-red-50 px-2"
                      onClick={() =>
                        handleStatusChange(application.id, "rejected")
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {application.status === "accepted" ? (
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-green-50 border-green-200 text-green-700"
                      onClick={() => {
                        setShowContactInfo((prev) => ({
                          ...prev,
                          [application.id]: !prev[application.id],
                        }));
                      }}
                    >
                      {showContactInfo[application.id]
                        ? "Hide Contact"
                        : "Show Contact"}
                    </Button>

                    {showContactInfo[application.id] && (
                      <div className="absolute right-0 mt-2 p-3 bg-white rounded-md border border-gray-200 shadow-md z-10 w-64">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="h-4 w-4 text-purple" />
                          <a
                            href={`mailto:${application.email}`}
                            className="text-purple hover:underline text-sm"
                          >
                            {application.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-purple" />
                          <a
                            href={`tel:(555) 123-${application.id.padStart(4, "0")}`}
                            className="text-purple hover:underline text-sm"
                          >
                            (555) 123-{application.id.padStart(4, "0")}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : application.status === "rejected" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="opacity-50 cursor-not-allowed bg-red-50 border-red-200 text-red-700"
                    disabled
                  >
                    Rejected
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative"
                    onClick={() => {
                      const message = document.createElement("div");
                      message.className =
                        "fixed top-4 right-4 p-4 rounded-md bg-blue-100 text-blue-800 border border-blue-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
                      message.innerHTML = `<div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        <span>Accept this application to view contact information</span>
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
                    Contact
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contact Info Modal */}
      {selectedApplicant && (
        <ContactInfoModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          contactInfo={{
            name: selectedApplicant.name,
            email: selectedApplicant.email,
            phone: `(555) 123-${selectedApplicant.id.padStart(4, "0")}`,
            website: `https://portfolio.${selectedApplicant.name.toLowerCase().replace(/\s+/g, "")}.com`,
            location: "New York, NY",
          }}
          applicationType="client"
          jobTitle={selectedApplicant.position}
        />
      )}
    </div>
  );
};

export default ApplicationsTable;
