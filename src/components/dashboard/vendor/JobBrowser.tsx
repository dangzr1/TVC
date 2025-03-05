import React, { useState } from "react";
import JobApplicationModal from "./JobApplicationModal";
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedDate: string;
  deadline: string;
  description: string;
  skills: string[];
  salary: string;
  isFavorite: boolean;
}

interface JobBrowserProps {
  jobs?: Job[];
}

const JobBrowser = ({ jobs = [] }: JobBrowserProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  // Default jobs if none are provided
  const defaultJobs: Job[] = [
    {
      id: "1",
      title: "Senior Web Developer",
      company: "TechCorp Inc.",
      location: "New York, NY",
      type: "Full-time",
      postedDate: "2023-06-15",
      deadline: "2023-07-15",
      description:
        "We are looking for an experienced web developer to join our team and help build innovative web applications.",
      skills: ["React", "Node.js", "TypeScript", "MongoDB"],
      salary: "$90,000 - $120,000",
      isFavorite: false,
    },
    {
      id: "2",
      title: "UX/UI Designer",
      company: "Creative Solutions",
      location: "Remote",
      type: "Contract",
      postedDate: "2023-06-10",
      deadline: "2023-07-10",
      description:
        "Looking for a talented UX/UI designer to create beautiful and intuitive user interfaces for our products.",
      skills: ["Figma", "Adobe XD", "Sketch", "User Research"],
      salary: "$75,000 - $95,000",
      isFavorite: true,
    },
    {
      id: "3",
      title: "DevOps Engineer",
      company: "Cloud Systems",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "2023-06-05",
      deadline: "2023-07-05",
      description:
        "Join our team to build and maintain our cloud infrastructure and deployment pipelines.",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      salary: "$100,000 - $130,000",
      isFavorite: false,
    },
  ];

  const displayJobs = jobs.length > 0 ? jobs : defaultJobs;

  // Toggle favorite status
  const toggleFavorite = (jobId: string) => {
    // This would typically update state or call an API
    console.log(`Toggled favorite status for job ${jobId}`);
  };

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  // Apply for job
  const applyForJob = (job: Job) => {
    setSelectedJob(job);
    setIsApplicationModalOpen(true);
  };

  // Handle successful application
  const handleApplicationSuccess = () => {
    // In a real app, this would update the job status or show a success message
    console.log(`Successfully applied for job ${selectedJob?.id}`);
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Jobs</h1>
          <p className="text-gray-600">
            Browse and apply for jobs that match your skills and interests
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search jobs by title or keyword"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedJobType} onValueChange={setSelectedJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="new-york">New York, NY</SelectItem>
                <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
                <SelectItem value="austin">Austin, TX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>

            <Button>Search Jobs</Button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {displayJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="text-base">
                      {job.company}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(job.id)}
                    className="text-yellow-500"
                  >
                    <Star className={job.isFavorite ? "fill-yellow-500" : ""} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-3 mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {job.type}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Deadline: {job.deadline}
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{job.description}</p>

                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="border-t bg-gray-50 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => window.open("#", "_blank")}
                >
                  View Details
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    applyForJob(job);
                  }}
                  className="bg-purple hover:bg-purple/90"
                >
                  Apply Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination or Load More (simplified) */}
        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="mx-2">
            Previous
          </Button>
          <Button
            variant="outline"
            className="mx-2 bg-primary text-primary-foreground"
          >
            1
          </Button>
          <Button variant="outline" className="mx-2">
            2
          </Button>
          <Button variant="outline" className="mx-2">
            3
          </Button>
          <Button variant="outline" className="mx-2">
            Next
          </Button>
        </div>
      </div>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        job={selectedJob}
        onSuccess={handleApplicationSuccess}
      />
    </div>
  );
};

export default JobBrowser;
