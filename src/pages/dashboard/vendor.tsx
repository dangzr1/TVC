import React from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import JobBrowser from "../../components/dashboard/vendor/JobBrowser";

const VendorDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader
        userName="Jane Smith"
        userRole="vendor"
        notificationCount={5}
        avatarUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
      />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
            <p className="text-gray-600">
              Find and apply for jobs that match your skills
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <JobBrowser />
            </div>

            <div className="space-y-6">
              {/* Profile Summary Card */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Jane Smith</h3>
                    <p className="text-sm text-gray-500">Web Developer</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Profile Completion</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                  <button className="text-sm text-primary hover:underline mt-2">
                    Complete your profile
                  </button>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium mb-3">Recent Applications</h3>
                <div className="space-y-3">
                  {[
                    {
                      job: "Senior Web Developer",
                      company: "TechCorp Inc.",
                      date: "Jun 15, 2023",
                      status: "pending",
                    },
                    {
                      job: "Frontend Engineer",
                      company: "WebSolutions",
                      date: "Jun 10, 2023",
                      status: "reviewed",
                    },
                    {
                      job: "React Developer",
                      company: "AppWorks",
                      date: "Jun 5, 2023",
                      status: "rejected",
                    },
                  ].map((application, index) => (
                    <div
                      key={index}
                      className="border-b pb-2 last:border-0 last:pb-0"
                    >
                      <div className="font-medium text-sm">
                        {application.job}
                      </div>
                      <div className="text-xs text-gray-500">
                        {application.company}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {application.date}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${application.status === "pending" ? "bg-yellow-100 text-yellow-800" : application.status === "reviewed" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}
                        >
                          {application.status.charAt(0).toUpperCase() +
                            application.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full text-sm text-center text-primary hover:underline mt-3">
                  View all applications
                </button>
              </div>

              {/* Saved Jobs */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium mb-3">Saved Jobs</h3>
                <div className="space-y-3">
                  {[
                    {
                      job: "UX/UI Designer",
                      company: "Creative Solutions",
                      location: "Remote",
                    },
                    {
                      job: "Full Stack Developer",
                      company: "Tech Innovators",
                      location: "New York, NY",
                    },
                  ].map((job, index) => (
                    <div
                      key={index}
                      className="border-b pb-2 last:border-0 last:pb-0"
                    >
                      <div className="font-medium text-sm">{job.job}</div>
                      <div className="text-xs text-gray-500">{job.company}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {job.location}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full text-sm text-center text-primary hover:underline mt-3">
                  View all saved jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;
