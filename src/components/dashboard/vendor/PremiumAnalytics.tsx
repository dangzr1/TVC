import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Calendar,
} from "lucide-react";

interface PremiumAnalyticsProps {
  premiumTier?: "top10" | "top50" | null;
  position?: number;
  stats?: {
    profileViews: number;
    profileViewsIncrease: number;
    clientsBooked: number;
    clientsBookedIncrease: number;
    revenue: number;
    revenueIncrease: number;
    conversionRate: number;
    conversionRateIncrease: number;
  };
}

const PremiumAnalytics = ({
  premiumTier = null,
  position = 0,
  stats = {
    profileViews: 3450,
    profileViewsIncrease: 32,
    clientsBooked: 87,
    clientsBookedIncrease: 15,
    revenue: 125000,
    revenueIncrease: 22,
    conversionRate: 2.5,
    conversionRateIncrease: 0.8,
  },
}: PremiumAnalyticsProps) => {
  if (!premiumTier) {
    return (
      <Card className="w-full bg-light-gray">
        <CardHeader>
          <CardTitle>Premium Analytics</CardTitle>
          <CardDescription>
            Upgrade to premium to access detailed analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Award className="h-16 w-16 text-deep-teal/30 mb-4" />
          <p className="text-center text-deep-teal/70 max-w-md">
            Premium members get access to detailed analytics including profile
            views, clients booked, revenue generated, and conversion rates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-light-gray">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Premium Analytics</CardTitle>
            <CardDescription>Track your performance and growth</CardDescription>
          </div>
          <Badge
            variant="secondary"
            className={`${premiumTier === "top10" ? "bg-deep-teal/20 text-deep-teal" : "bg-light-sky-blue/30 text-deep-teal"}`}
          >
            {premiumTier === "top10" ? "Top 10" : "Top 50"} #{position}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Profile Views */}
          <div className="bg-soft-mint rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-light-sky-blue/30 flex items-center justify-center mr-2">
                  <Eye className="h-4 w-4 text-deep-teal" />
                </div>
                <div>
                  <p className="text-sm font-medium">Profile Views</p>
                  <p className="text-2xl font-bold">
                    {stats.profileViews.toLocaleString()}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="flex items-center border-deep-teal/30"
              >
                <TrendingUp className="h-3 w-3 mr-1 text-deep-teal" />
                {stats.profileViewsIncrease}%
              </Badge>
            </div>
            <Progress value={75} className="h-1.5 bg-light-sky-blue/20" />
            <p className="text-xs text-deep-teal/60 mt-2">Last 30 days</p>
          </div>

          {/* Clients Booked */}
          <div className="bg-soft-mint rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-deep-teal/20 flex items-center justify-center mr-2">
                  <Users className="h-4 w-4 text-deep-teal" />
                </div>
                <div>
                  <p className="text-sm font-medium">Clients Booked</p>
                  <p className="text-2xl font-bold">{stats.clientsBooked}</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="flex items-center border-deep-teal/30"
              >
                <TrendingUp className="h-3 w-3 mr-1 text-deep-teal" />
                {stats.clientsBookedIncrease}%
              </Badge>
            </div>
            <Progress value={65} className="h-1.5 bg-light-sky-blue/20" />
            <p className="text-xs text-deep-teal/60 mt-2">Last 12 months</p>
          </div>

          {/* Revenue Generated */}
          <div className="bg-soft-mint rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-light-sky-blue/30 flex items-center justify-center mr-2">
                  <DollarSign className="h-4 w-4 text-deep-teal" />
                </div>
                <div>
                  <p className="text-sm font-medium">Revenue Generated</p>
                  <p className="text-2xl font-bold">
                    ${stats.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="flex items-center border-deep-teal/30"
              >
                <TrendingUp className="h-3 w-3 mr-1 text-deep-teal" />
                {stats.revenueIncrease}%
              </Badge>
            </div>
            <Progress value={80} className="h-1.5 bg-light-sky-blue/20" />
            <p className="text-xs text-deep-teal/60 mt-2">Last 12 months</p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-soft-mint rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-deep-teal/20 flex items-center justify-center mr-2">
                  <Calendar className="h-4 w-4 text-deep-teal" />
                </div>
                <div>
                  <p className="text-sm font-medium">Conversion Rate</p>
                  <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="flex items-center border-deep-teal/30"
              >
                <TrendingUp className="h-3 w-3 mr-1 text-deep-teal" />
                {stats.conversionRateIncrease}%
              </Badge>
            </div>
            <Progress value={60} className="h-1.5 bg-light-sky-blue/20" />
            <p className="text-xs text-deep-teal/60 mt-2">Views to bookings</p>
          </div>
        </div>

        <div className="text-xs text-deep-teal/60 italic">
          * Premium members receive detailed analytics reports. Your position in
          the featured vendors section directly impacts these metrics.
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumAnalytics;
