import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, FileText, Users, Calendar, Clock } from "lucide-react";

interface ClientDashboardStatsProps {
  stats?: {
    activeJobs: number;
    activeJobsChange: number;
    totalApplications: number;
    totalApplicationsChange: number;
    averageResponseTime: number;
    averageResponseTimeChange: number;
    upcomingInterviews: number;
  };
}

const ClientDashboardStats: React.FC<ClientDashboardStatsProps> = ({
  stats = {
    activeJobs: 3,
    activeJobsChange: 1,
    totalApplications: 24,
    totalApplicationsChange: 8,
    averageResponseTime: 2.5,
    averageResponseTimeChange: -0.5,
    upcomingInterviews: 5,
  },
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active Job Postings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-purple" />
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
            </div>
            <Badge
              variant="outline"
              className="flex items-center bg-green-50 text-green-700 border-green-200"
            >
              <TrendingUp className="mr-1 h-3 w-3" />
              {stats.activeJobsChange > 0 ? "+" : ""}
              {stats.activeJobsChange}
            </Badge>
          </div>
          <Progress value={75} className="h-1 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-purple" />
              <div className="text-2xl font-bold">
                {stats.totalApplications}
              </div>
            </div>
            <Badge
              variant="outline"
              className="flex items-center bg-green-50 text-green-700 border-green-200"
            >
              <TrendingUp className="mr-1 h-3 w-3" />
              {stats.totalApplicationsChange > 0 ? "+" : ""}
              {stats.totalApplicationsChange}
            </Badge>
          </div>
          <Progress value={60} className="h-1 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboardStats;
