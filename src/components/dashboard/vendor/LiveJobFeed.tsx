import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bell, Briefcase, MapPin, DollarSign, Clock, Zap } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedAt: string;
  isNew: boolean;
}

const LiveJobFeed = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [progress, setProgress] = useState(100);
  const [newJobAlert, setNewJobAlert] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState(
    Math.floor(Math.random() * 50) + 150,
  );
  const refreshIntervalRef = useRef<number | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  // Simulate fetching jobs
  const fetchJobs = () => {
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Generate random jobs
      const jobTitles = [
        "Senior Frontend Developer",
        "UX/UI Designer",
        "Full Stack Engineer",
        "Product Manager",
        "DevOps Engineer",
        "Mobile Developer",
        "Data Scientist",
        "Project Manager",
        "QA Engineer",
        "Marketing Specialist",
      ];

      const companies = [
        "TechCorp Inc.",
        "Creative Solutions",
        "Digital Innovations",
        "Future Systems",
        "Cloud Technologies",
        "WebTech Solutions",
        "Mobile Pioneers",
        "Data Insights",
        "Agile Projects",
        "Marketing Experts",
      ];

      const locations = [
        "New York, NY",
        "San Francisco, CA",
        "Austin, TX",
        "Chicago, IL",
        "Seattle, WA",
        "Boston, MA",
        "Denver, CO",
        "Los Angeles, CA",
        "Miami, FL",
        "Remote",
      ];

      const salaryRanges = [
        "$80,000 - $100,000",
        "$90,000 - $120,000",
        "$100,000 - $130,000",
        "$110,000 - $140,000",
        "$120,000 - $150,000",
        "$130,000 - $160,000",
        "$140,000 - $170,000",
        "$150,000 - $180,000",
        "$160,000 - $190,000",
        "$170,000 - $200,000",
      ];

      // Generate a single new job
      const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];

      const newJob: Job = {
        id: `job-${Date.now()}`,
        title,
        company,
        location: locations[Math.floor(Math.random() * locations.length)],
        salary: salaryRanges[Math.floor(Math.random() * salaryRanges.length)],
        postedAt: "Just now",
        isNew: true,
      };

      // Replace the entire job list with just the new job
      setJobs([newJob]);
      setIsLoading(false);

      // Randomly update active users count
      if (Math.random() > 0.5) {
        const change = Math.floor(Math.random() * 10) - 5; // -5 to +5
        setActiveUsers((prev) => Math.max(100, prev + change));
      }
    }, 500);
  };

  useEffect(() => {
    // Initial fetch
    fetchJobs();

    // Set up auto-refresh every 15 seconds
    const refreshInterval = setInterval(() => {
      setLastRefresh(Date.now());
      fetchJobs();
    }, 15000);

    // Set up progress bar that counts down to next refresh
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - lastRefresh;
      const remaining = Math.max(0, 100 - (elapsed / 15000) * 100);
      setProgress(remaining);
    }, 100);

    // Listen for new job postings from clients
    const handleNewJobPosted = (event: CustomEvent) => {
      const newJob = event.detail;
      setJobs([
        {
          ...newJob,
          isNew: true,
        },
      ]);
      setLastRefresh(Date.now());
      setProgress(100);
    };

    window.addEventListener(
      "newJobPosted",
      handleNewJobPosted as EventListener,
    );

    refreshIntervalRef.current = refreshInterval as unknown as number;

    return () => {
      clearInterval(refreshInterval);
      clearInterval(progressInterval);
      window.removeEventListener(
        "newJobPosted",
        handleNewJobPosted as EventListener,
      );
    };
  }, []);

  // Update progress when lastRefresh changes
  useEffect(() => {
    setProgress(100);
  }, [lastRefresh]);

  // Scroll to new jobs when they appear
  useEffect(() => {
    if (jobs.some((job) => job.isNew) && feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [jobs]);

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple" />
            Live Job Feed
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time job opportunities matching your profile
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            {activeUsers} active users
          </div>
          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
            <Progress value={progress} className="h-full" />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={() => {
              setLastRefresh(Date.now());
              fetchJobs();
            }}
          >
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {newJobAlert && (
          <div className="m-4 p-3 bg-purple/10 border border-purple/20 rounded-md flex items-center gap-2">
            <Bell className="h-4 w-4 text-purple" />
            <p className="text-sm text-purple font-medium">{newJobAlert}</p>
          </div>
        )}

        <div
          ref={feedRef}
          className="max-h-[400px] overflow-y-auto"
          style={{ scrollBehavior: "smooth" }}
        >
          {isLoading && jobs.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple border-t-transparent"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No jobs found matching your profile.</p>
            </div>
          ) : (
            <div className="divide-y">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={`p-4 hover:bg-gradient-to-r hover:from-purple/5 hover:to-pink/5 transition-all duration-200 cursor-pointer rounded-lg border border-transparent hover:border-purple/20 hover:shadow-lg transform hover:-translate-y-1 ${job.isNew ? "bg-purple/5 animate-pulse" : ""}`}
                  onClick={() => {
                    alert(`Viewing details for ${job.title} at ${job.company}`);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{job.title}</h3>
                        {job.isNew && (
                          <Badge className="bg-purple text-white">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          alert(
                            `Viewing details for ${job.title} at ${job.company}`,
                          );
                        }}
                      >
                        View Job
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-purple hover:bg-purple/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = "#jobs";
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {job.salary}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {job.postedAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveJobFeed;
