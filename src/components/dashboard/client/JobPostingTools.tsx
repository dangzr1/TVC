import React, { useState } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  Search,
  Filter,
  Users,
  Clock,
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
  jobs = [
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
  applications = [
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
      status: "reviewed",
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      location: "",
      salary: "",
      status: "draft",
    },
  });

  const handleCreateJob = (data: any) => {
    console.log("Creating job:", data);
    setIsCreateDialogOpen(false);
  };

  const handleEditJob = (job: JobPost) => {
    setSelectedJob(job);
    form.reset({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      salary: job.salary,
      status: job.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateJob = (data: any) => {
    console.log("Updating job:", data);
    setIsEditDialogOpen(false);
  };

  const handleDeleteJob = (jobId: string) => {
    console.log("Deleting job:", jobId);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "draft":
        return "secondary";
      case "closed":
        return "outline";
      case "pending":
        return "secondary";
      case "reviewed":
        return "default";
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="w-full h-full bg-background p-6">
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
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="postings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Manage Job Postings</h2>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Job Posting</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to create a new job posting. Click
                    save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleCreateJob)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Senior Frontend Developer"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the role and responsibilities"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requirements</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List the skills and qualifications needed"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Remote, New York, NY"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="salary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Salary Range</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. $100,000 - $130,000"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit">Create Job</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {job.location}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(job.status)}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 line-clamp-3">{job.description}</p>
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
            {applications.map((application) => (
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
                <div>
                  <Badge variant={getStatusBadgeVariant(application.status)}>
                    {application.status.charAt(0).toUpperCase() +
                      application.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Update Status
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Job Posting</DialogTitle>
            <DialogDescription>
              Update the job posting details below.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdateJob)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Range</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Update Job</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobPostingTools;
