import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  Search,
  Filter,
  Users,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import JobPostingForm from "./JobPostingForm";

interface JobPostingToolsProps {
  jobs?: JobPost[];
  applications?: JobApplication[];
}

interface JobPost {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary: string;
  status: "active" | "draft" | "closed";
  createdAt: string;
  applicationsCount: number;
}

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedAt: string;
}

const JobPostingTools: React.FC<JobPostingToolsProps> = ({
  jobs: initialJobs = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      description:
        "We are looking for an experienced frontend developer to join our team.",
      requirements: "React, TypeScript, 5+ years experience",
      location: "Remote",
      salary: "$120,000 - $150,000",
      status: "active",
      createdAt: "2023-06-15",
      applicationsCount: 12,
    },
    {
      id: "2",
      title: "Backend Engineer",
      description: "Join our backend team to build scalable APIs and services.",
      requirements: "Node.js, PostgreSQL, AWS",
      location: "New York, NY",
      salary: "$130,000 - $160,000",
      status: "active",
      createdAt: "2023-07-01",
      applicationsCount: 8,
    },
    {
      id: "3",
      title: "UX Designer",
      description: "Help us create beautiful and intuitive user experiences.",
      requirements: "Figma, 3+ years experience, portfolio required",
      location: "San Francisco, CA",
      salary: "$110,000 - $140,000",
      status: "draft",
      createdAt: "2023-07-10",
      applicationsCount: 0,
    },
  ],
  applications: initialApplications = [
    {
      id: "a1",
      jobId: "1",
      jobTitle: "Senior Frontend Developer",
      applicantName: "Jane Smith",
      applicantEmail: "jane.smith@example.com",
      status: "pending",
      appliedAt: "2023-06-20",
    },
    {
      id: "a2",
      jobId: "1",
      jobTitle: "Senior Frontend Developer",
      applicantName: "Michael Johnson",
      applicantEmail: "michael.j@example.com",
      status: "pending",
      appliedAt: "2023-06-18",
    },
    {
      id: "a3",
      jobId: "2",
      jobTitle: "Backend Engineer",
      applicantName: "David Lee",
      applicantEmail: "david.lee@example.com",
      status: "pending",
      appliedAt: "2023-07-05",
    },
  ],
}) => {
  // State for jobs and applications
  const [jobs, setJobs] = useState<JobPost[]>(() => {
    try {
      // Try to load jobs from localStorage
      const savedJobs = localStorage.getItem("savedJobs");
      return savedJobs ? JSON.parse(savedJobs) : initialJobs;
    } catch (error) {
      console.error("Error loading jobs from localStorage:", error);
      return initialJobs;
    }
  });
  const [applications, setApplications] =
    useState<JobApplication[]>(initialApplications);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [showContactInfo, setShowContactInfo] = useState<
    Record<string, boolean>
  >({});

  // Listen for new job posted events from the parent component
  useEffect(() => {
    const handleNewJobPosted = (event: CustomEvent) => {
      console.log("New job posted event received:", event.detail);
      const newJobData = event.detail;

      // Create a new job object with the received data
      const newJob = {
        id: newJobData.id || `${jobs.length + 1}`,
        title: newJobData.title || "New Job",
        description: "New job description",
        requirements: "Requirements not specified",
        location: newJobData.location || "Remote",
        salary: newJobData.salary || "Competitive",
        status: newJobData.type === "Full-time" ? "active" : "draft",
        createdAt: new Date().toISOString().split("T")[0],
        applicationsCount: 0,
      };

      // Add the new job to the jobs list
      const updatedJobs = [newJob, ...jobs];
      setJobs(updatedJobs);
      localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
    };

    // Add event listener for custom event
    window.addEventListener(
      "newJobPosted",
      handleNewJobPosted as EventListener,
    );

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener(
        "newJobPosted",
        handleNewJobPosted as EventListener,
      );
    };
  }, [jobs]);

  const handleCreateJob = (data: any) => {
    console.log("Creating job:", data);
    setIsCreateDialogOpen(false);

    // Add the new job to the jobs list
    const newJob = {
      id: `${jobs.length + 1}`,
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      location: data.location,
      salary: data.salary,
      status: data.status,
      createdAt: new Date().toISOString().split("T")[0],
      applicationsCount: 0,
    };

    // Store jobs in localStorage to persist between refreshes
    const updatedJobs = [newJob, ...jobs];
    setJobs(updatedJobs);
    localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));

    // Publish job to global job feed (in a real app, this would be a database operation)
    // This simulates publishing the job to the vendor's live job feed
    window.dispatchEvent(
      new CustomEvent("newJobPosted", {
        detail: {
          id: newJob.id,
          title: newJob.title,
          company: "Your Company", // In a real app, this would be the client's company name
          location: newJob.location,
          salary: newJob.salary,
          type: data.status === "active" ? "Full-time" : "Draft",
          postedAt: "Just now",
        },
      }),
    );
  };

  const handleEditJob = (job: JobPost) => {
    setSelectedJob(job);
    setIsEditDialogOpen(true);
  };

  const handleUpdateJob = (data: any) => {
    console.log("Updating job:", data);
    setIsEditDialogOpen(false);

    // Update the job in the jobs list
    if (selectedJob) {
      const updatedJobs = jobs.map((job) =>
        job.id === selectedJob.id
          ? {
              ...job,
              title: data.title,
              description: data.description,
              requirements: data.requirements,
              location: data.location,
              salary: data.salary,
              status: data.status,
            }
          : job,
      );

      setJobs(updatedJobs);
      localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
    }
  };

  const handleDeleteJob = (jobId: string) => {
    console.log("Deleting job:", jobId);

    // Create a dialog element for confirmation
    const dialog = document.createElement("dialog");
    dialog.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4";

    dialog.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
        <p class="text-gray-700 mb-6">Are you sure you want to delete this job posting? This action cannot be undone.</p>
        <div class="flex justify-end gap-3">
          <button id="cancel-btn" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors">Cancel</button>
          <button id="delete-btn" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">Delete</button>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);
    dialog.showModal();

    // Add event listeners to buttons
    dialog.querySelector("#cancel-btn")?.addEventListener("click", () => {
      dialog.close();
      document.body.removeChild(dialog);
    });

    dialog.querySelector("#delete-btn")?.addEventListener("click", () => {
      // Remove the job from the jobs list
      const updatedJobs = jobs.filter((job) => job.id !== jobId);
      setJobs(updatedJobs);
      localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));

      dialog.close();
      document.body.removeChild(dialog);
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "closed":
        return <Badge variant="outline">Closed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;

      case "accepted":
        return <Badge variant="default">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="w-full h-full bg-background p-6 overflow-auto">
      <Tabs defaultValue="postings" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="postings">Job Postings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <TabsContent value="postings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Manage Job Postings</h2>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-purple hover:bg-purple/90 text-black font-medium"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Job
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs
              .filter((job) => {
                // Filter by search term
                if (
                  searchTerm &&
                  !job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                  !job.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ) {
                  return false;
                }
                // Filter by status
                if (filterStatus && job.status !== filterStatus) {
                  return false;
                }
                return true;
              })
              .map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {job.location}
                        </CardDescription>
                      </div>
                      {getStatusBadge(job.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4 line-clamp-3">
                      {job.description}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Users className="mr-2 h-4 w-4" />
                      <span>{job.applicationsCount} applications</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Posted on {job.createdAt}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditJob(job)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Job Applications</h2>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 bg-muted p-4 font-medium">
              <div>Applicant</div>
              <div>Job Position</div>
              <div>Applied Date</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            {applications
              .filter((app) => {
                // Filter by search term
                if (
                  searchTerm &&
                  !app.applicantName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) &&
                  !app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                  return false;
                }
                return true;
              })
              .map((application) => (
                <div
                  key={application.id}
                  className="grid grid-cols-5 p-4 border-t items-center"
                >
                  <div>
                    <p className="font-medium">{application.applicantName}</p>
                    <p className="text-sm text-muted-foreground">
                      {application.applicantEmail}
                    </p>
                  </div>
                  <div>{application.jobTitle}</div>
                  <div>{application.appliedAt}</div>
                  <div>{getStatusBadge(application.status)}</div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {application.status === "accepted" ? (
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="relative"
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
                          <div className="mt-2 p-2 bg-purple/5 rounded-md border border-purple/20">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3 text-purple" />
                              <a
                                href={`mailto:${application.applicantEmail}`}
                                className="text-purple hover:underline"
                              >
                                {application.applicantEmail}
                              </a>
                            </div>
                            <div className="flex items-center gap-1 text-sm mt-1">
                              <Phone className="h-3 w-3 text-purple" />
                              <a
                                href={`tel:(555) 123-${application.id.padStart(4, "0")}`}
                                className="text-purple hover:underline"
                              >
                                (555) 123-{application.id.padStart(4, "0")}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="relative"
                        onClick={() => {
                          // Find the application in the applications list
                          const app = applications.find(
                            (a) => a.id === application.id,
                          );
                          if (app) {
                            alert(
                              `Accept this application to view contact information for ${app.applicantName}`,
                            );
                          }
                        }}
                      >
                        Contact
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Job Posting Form for Create */}
      <JobPostingForm
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateJob}
      />

      {/* Job Posting Form for Edit */}
      {selectedJob && (
        <JobPostingForm
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          initialData={{
            title: selectedJob.title,
            description: selectedJob.description,
            requirements: selectedJob.requirements,
            location: selectedJob.location,
            salary: selectedJob.salary,
            status: selectedJob.status,
          }}
          onSubmit={handleUpdateJob}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default JobPostingTools;
