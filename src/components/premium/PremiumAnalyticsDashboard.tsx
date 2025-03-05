import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";

interface AnalyticMetric {
  value: number;
  increase: number;
  label: string;
  icon: React.ReactNode;
  progress: number;
  subtitle: string;
}

const PremiumAnalyticsDashboard = () => {
  const { premiumStatus } = usePremium();

  // Mock data - in a real app, this would come from an API
  const metrics: AnalyticMetric[] = [
    {
      value: 3450,
      increase: 32,
      label: "Profile Views",
      icon: <Eye className="h-4 w-4 text-purple" />,
      progress: 75,
      subtitle: "Last 30 days",
    },
    {
      value: 87,
      increase: 15,
      label: "Clients Booked",
      icon: <Users className="h-4 w-4 text-purple" />,
      progress: 65,
      subtitle: "Last 12 months",
    },
    {
      value: 125000,
      increase: 22,
      label: "Revenue Generated",
      icon: <DollarSign className="h-4 w-4 text-purple" />,
      progress: 80,
      subtitle: "Last 12 months",
    },
    {
      value: 2.5,
      increase: 0.8,
      label: "Conversion Rate",
      icon: <Calendar className="h-4 w-4 text-purple" />,
      progress: 60,
      subtitle: "Views to bookings",
    },
  ];

  if (premiumStatus.tier === "none" || !premiumStatus.isActive) {
    return (
      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Premium Analytics</CardTitle>
          <CardDescription>
            Upgrade to premium to access detailed analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-center max-w-md">
            <p className="text-dark-gray/70 mb-4">
              Premium members get access to detailed analytics including profile
              views, clients booked, revenue generated, and conversion rates.
            </p>
            <p className="text-purple font-medium">
              Upgrade to Premium to unlock these insights
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Premium Analytics</CardTitle>
            <CardDescription>Track your performance and growth</CardDescription>
          </div>
          <Badge
            variant="secondary"
            className={`${premiumStatus.tier === "top10" ? "bg-purple/20 text-purple" : "bg-pink/20 text-pink"}`}
          >
            {premiumStatus.tier === "top10" ? "Top 10" : "Top 50"} #
            {premiumStatus.position}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-light-gray rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-purple/10 flex items-center justify-center mr-2">
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{metric.label}</p>
                    <p className="text-2xl font-bold">
                      {metric.label === "Revenue Generated" ? "$" : ""}
                      {metric.value.toLocaleString()}
                      {metric.label === "Conversion Rate" ? "%" : ""}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="flex items-center border-purple/30"
                >
                  <TrendingUp className="h-3 w-3 mr-1 text-purple" />
                  {metric.increase}
                  {metric.label === "Conversion Rate" ? "" : "%"}
                </Badge>
              </div>
              <Progress
                value={metric.progress}
                className="h-1.5 bg-purple/20"
              />
              <p className="text-xs text-dark-gray/60 mt-2">
                {metric.subtitle}
              </p>
            </div>
          ))}
        </div>

        <div className="text-xs text-dark-gray/60 italic">
          * Premium members receive detailed analytics reports. Your position in
          the featured vendors section directly impacts these metrics.
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumAnalyticsDashboard;
