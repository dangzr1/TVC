import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  User,
  MessageCircle,
  Calendar,
  Clock,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  website?: string;
  location?: string;
}

interface ContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactInfo: ContactInfo;
  applicationType: "vendor" | "client";
  jobTitle?: string;
}

const ContactInfoModal: React.FC<ContactInfoModalProps> = ({
  isOpen,
  onClose,
  contactInfo,
  applicationType,
  jobTitle,
}) => {
  const [activeTab, setActiveTab] = React.useState("details");
  const [withdrawConfirm, setWithdrawConfirm] = React.useState(false);

  const handleWithdraw = () => {
    if (withdrawConfirm) {
      // In a real app, this would call an API to withdraw the application
      // For demo purposes, we'll simulate the withdrawal by showing a success message
      // and closing the modal
      const message = document.createElement("div");
      message.className =
        "fixed top-4 right-4 p-4 rounded-md bg-green-100 text-green-800 border border-green-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
      message.innerHTML = `<div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>Application withdrawn successfully</span>
      </div>`;
      document.body.appendChild(message);

      setTimeout(() => {
        message.classList.add("animate-out", "fade-out", "slide-out-to-top-5");
        setTimeout(() => document.body.removeChild(message), 300);
      }, 3000);

      onClose();

      // Update local storage to reflect the withdrawal
      const applicationId = "app1"; // This would be dynamic in a real app
      const storedApplications = localStorage.getItem("applications");
      if (storedApplications) {
        const applications = JSON.parse(storedApplications);
        const updatedApplications = applications.filter(
          (app: any) => app.id !== applicationId,
        );
        localStorage.setItem(
          "applications",
          JSON.stringify(updatedApplications),
        );
      }
    } else {
      setWithdrawConfirm(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple" />
            Application Details
          </DialogTitle>
          <DialogDescription>
            {jobTitle && (
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-purple/10 border-purple/20"
                >
                  {jobTitle}
                </Badge>
                <Badge variant="outline">{contactInfo.location}</Badge>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="border-b border-gray-200 mb-4">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 border-b-2 ${activeTab === "details" ? "border-purple text-purple font-medium" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button
              className={`px-4 py-2 border-b-2 ${activeTab === "status" ? "border-purple text-purple font-medium" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("status")}
            >
              Status
            </button>
            <button
              className={`px-4 py-2 border-b-2 ${activeTab === "contact" ? "border-purple text-purple font-medium" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("contact")}
            >
              Contact
            </button>
          </div>
        </div>

        {activeTab === "details" && (
          <div className="space-y-4 py-2">
            <div className="bg-gradient-to-r from-purple/5 to-pink/5 p-4 rounded-lg border border-purple/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple" />
                </div>
                <div>
                  <h3 className="font-medium">{contactInfo.name}</h3>
                  <p className="text-sm text-gray-600">
                    {applicationType === "vendor"
                      ? "Hiring Manager"
                      : "Applicant"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple" />
                  <span>Applied: June 15, 2023</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple" />
                  <span>Status: Pending</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Cover Letter</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <p>
                  I am very interested in this position and believe my skills in
                  React, TypeScript, and UI/UX design make me a strong
                  candidate. I have over 5 years of experience building
                  responsive web applications and would love to bring my
                  expertise to your team.
                </p>
                <p className="mt-2">
                  I'm particularly drawn to your company's focus on user
                  experience and innovative solutions. I look forward to
                  discussing how I can contribute to your team's success.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">UI/UX Design</Badge>
                  <Badge variant="outline">Responsive Design</Badge>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Experience</h3>
                <p className="text-sm">5+ years of frontend development</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "status" && (
          <div className="space-y-4 py-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Application Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Application Submitted</p>
                    <p className="text-sm text-gray-600">
                      June 15, 2023 at 2:30 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple/10 flex items-center justify-center mt-0.5">
                    <Clock className="h-3 w-3 text-purple" />
                  </div>
                  <div>
                    <p className="font-medium">Pending</p>
                    <p className="text-sm text-gray-600">
                      Your application is pending review by the hiring team
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-50">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <MessageCircle className="h-3 w-3 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">Interview</p>
                    <p className="text-sm text-gray-600">
                      Waiting for interview scheduling
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-50">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">Decision</p>
                    <p className="text-sm text-gray-600">
                      Final hiring decision
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">
                    Application Status: Pending
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your application is currently under review. The typical
                    response time is 5-7 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-4 py-2">
            {applicationType === "vendor" ? (
              <div className="bg-purple/5 p-4 rounded-lg border border-purple/10">
                <p className="text-sm mb-3">
                  Contact information is available for accepted applications.
                  Once your application is accepted, you'll be able to contact
                  the hiring manager directly.
                </p>

                <div className="space-y-3 opacity-70">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-purple mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">
                        ••••••@{contactInfo.email.split("@")[1]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-purple mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        (•••) •••-{contactInfo.phone.slice(-4)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-purple mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{contactInfo.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-purple mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-purple hover:underline"
                      >
                        {contactInfo.email}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-purple mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="text-purple hover:underline"
                      >
                        {contactInfo.phone}
                      </a>
                    </p>
                  </div>
                </div>

                {contactInfo.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-purple mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <p className="font-medium">
                        <a
                          href={
                            contactInfo.website.startsWith("http")
                              ? contactInfo.website
                              : `https://${contactInfo.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple hover:underline"
                        >
                          {contactInfo.website}
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                {contactInfo.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-purple mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{contactInfo.location}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex justify-between items-center">
          {applicationType === "vendor" && (
            <Button
              variant="destructive"
              onClick={handleWithdraw}
              className={withdrawConfirm ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {withdrawConfirm ? "Confirm Withdrawal" : "Withdraw Application"}
            </Button>
          )}
          <div className="flex gap-2">
            {withdrawConfirm && (
              <Button
                variant="outline"
                onClick={() => setWithdrawConfirm(false)}
              >
                Cancel
              </Button>
            )}
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactInfoModal;
