import React from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import JobBrowser from "../../components/dashboard/vendor/JobBrowser";
import PremiumStatusCard from "../../components/dashboard/vendor/PremiumStatusCard";
import PremiumAnalyticsDashboard from "../../components/premium/PremiumAnalyticsDashboard";
import OpenPositionsNotification from "../../components/dashboard/vendor/OpenPositionsNotification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Eye, Users } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";
import PremiumBadge from "@/components/premium/PremiumBadge";
import PremiumPositionMap from "@/components/dashboard/vendor/PremiumPositionMap";
import PaymentHistory from "@/components/dashboard/vendor/PaymentHistory";
import PremiumRoi from "@/components/dashboard/vendor/PremiumRoi";
import PremiumSetupGuide from "@/components/dashboard/vendor/PremiumSetupGuide";
import CancellationPolicy from "@/components/dashboard/vendor/CancellationPolicy";
import JobApplicationsList from "@/components/dashboard/vendor/JobApplicationsList";
import LiveJobFeed from "@/components/dashboard/vendor/LiveJobFeed";

const VendorDashboard = () => {
  const { premiumStatus } = usePremium();

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <header>
        <title>Vendor Dashboard - TheVendorsConnect</title>
        <meta
          name="description"
          content="Manage your vendor profile, view job opportunities, and connect with clients from your vendor dashboard."
        />
      </header>
      <DashboardHeader
        userName="Jane Smith"
        userRole="vendor"
        notificationCount={5}
        avatarUrl="https://api.dicebear.com/7.x/shapes/svg?seed=Jane"
      />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-dark-gray">
              Vendor Dashboard
            </h1>
            <p className="text-dark-gray/70">
              Manage your profile, bookings, and premium membership
            </p>
          </div>

          {/* Live Job Feed removed */}

          {/* Open Positions Notification */}
          <OpenPositionsNotification />

          {/* Premium Setup Guide moved to profile page */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Profile Summary Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-purple/10">
                  <img
                    src="https://api.dicebear.com/7.x/shapes/svg?seed=Jane"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Jane Smith</h3>
                    <PremiumBadge />
                  </div>
                  <p className="text-dark-gray/70">Wedding Photographer</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dark-gray/70">
                      Profile Completion
                    </span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="w-full bg-purple/10 rounded-full h-2">
                    <div
                      className="bg-purple h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-light-gray p-3 rounded-lg">
                    <div className="flex items-center text-sm text-dark-gray/70 mb-1">
                      <Eye className="h-4 w-4 mr-1" /> Profile Views
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg">3,450</span>
                      <Badge
                        variant="outline"
                        className="flex items-center border-purple/30"
                      >
                        <TrendingUp className="h-3 w-3 mr-1 text-purple" />
                        32%
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-light-gray p-3 rounded-lg">
                    <div className="flex items-center text-sm text-dark-gray/70 mb-1">
                      <Users className="h-4 w-4 mr-1" /> Bookings
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg">87</span>
                      <Badge
                        variant="outline"
                        className="flex items-center border-purple/30"
                      >
                        <TrendingUp className="h-3 w-3 mr-1 text-purple" />
                        15%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Membership Card */}
            <div className="lg:col-span-2">
              <PremiumStatusCard />
            </div>
          </div>

          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="mb-6 bg-light-gray">
              <TabsTrigger
                value="jobs"
                className="data-[state=active]:bg-purple data-[state=active]:text-white"
              >
                Available Jobs
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-purple data-[state=active]:text-white"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="data-[state=active]:bg-purple data-[state=active]:text-white"
              >
                My Applications
              </TabsTrigger>
              <TabsTrigger
                value="bookings"
                className="data-[state=active]:bg-purple data-[state=active]:text-white"
              >
                Bookings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="mt-0">
              <JobBrowser />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <div className="space-y-6">
                <PremiumAnalyticsDashboard />
                <PremiumRoi />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PremiumPositionMap />
                  <PaymentHistory />
                </div>
                <CancellationPolicy />
              </div>
            </TabsContent>

            <TabsContent value="applications" className="mt-0">
              <JobApplicationsList />
            </TabsContent>

            <TabsContent value="bookings" className="mt-0">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="font-medium text-lg mb-4 text-dark-gray">
                  Upcoming Bookings
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      event: "Thompson-Garcia Wedding",
                      date: "August 12, 2023",
                      location: "Sunset Gardens, Miami",
                      package: "Full Day Coverage",
                      amount: "$2,500",
                    },
                    {
                      event: "Wilson Family Portraits",
                      date: "July 23, 2023",
                      location: "Riverside Park",
                      package: "Family Session",
                      amount: "$350",
                    },
                    {
                      event: "Chen-Williams Engagement",
                      date: "July 15, 2023",
                      location: "Downtown Arts District",
                      package: "Engagement Session",
                      amount: "$450",
                    },
                  ].map((booking, index) => (
                    <div
                      key={index}
                      className="border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="font-medium">{booking.event}</div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-sm text-dark-gray/70">Date:</p>
                          <p className="text-sm">{booking.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-dark-gray/70">Location:</p>
                          <p className="text-sm">{booking.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-dark-gray/70">Package:</p>
                          <p className="text-sm">{booking.package}</p>
                        </div>
                        <div>
                          <p className="text-sm text-dark-gray/70">Amount:</p>
                          <p className="text-sm font-medium">
                            {booking.amount}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;
