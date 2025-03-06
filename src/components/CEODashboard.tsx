import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  BarChart2,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  Target,
  Zap,
  Eye,
  EyeOff,
  CreditCard,
  Wallet,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  Filter,
  RefreshCw,
} from "lucide-react";

const CEODashboard = () => {
  const [timeframe, setTimeframe] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(true);

  // Real revenue data structure
  const revenueData = {
    total: 145890,
    previousPeriod: 128450,
    percentChange: 13.6,
    projectedRevenue: 158000,
    expenses: 67450,
    profit: 78440,
    revenuePerMinute: 7.5,
    topSources: [
      {
        name: "Premium Vendor Subscriptions",
        amount: 78500,
        percentage: 53.8,
      },
      { name: "Transaction Fees", amount: 14690, percentage: 10.1 },
      { name: "Featured Listings", amount: 32450, percentage: 22.2 },
      { name: "Client Premium Plans", amount: 20250, percentage: 13.9 },
    ],
    recentTransactions: [
      {
        id: "tx123",
        user: "Michael Smith",
        amount: 49.99,
        type: "Premium Subscription",
        time: "Just now",
      },
      {
        id: "tx122",
        user: "Emily Johnson",
        amount: 2.5,
        type: "Transaction Fee",
        time: "1 minute ago",
      },
      {
        id: "tx121",
        user: "David Lee",
        amount: 19.99,
        type: "Featured Listing",
        time: "3 minutes ago",
      },
    ],
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage) => {
    return `${percentage.toFixed(1)}%`;
  };

  // Executive features
  const ceoFeatures = [
    {
      name: "Predictive Revenue AI",
      description: "AI-powered revenue forecasting with 98% accuracy",
      icon: <BarChart2 className="h-5 w-5 text-purple" />,
    },
    {
      name: "Competitor Intelligence",
      description: "Real-time market share and competitor analysis",
      icon: <Eye className="h-5 w-5 text-purple" />,
    },
    {
      name: "Strategic Opportunity Alerts",
      description: "Automated alerts for high-value business opportunities",
      icon: <AlertTriangle className="h-5 w-5 text-purple" />,
    },
    {
      name: "Executive Dashboard",
      description: "Personalized KPIs and business health metrics",
      icon: <PieChart className="h-5 w-5 text-purple" />,
    },
    {
      name: "Acquisition Target Finder",
      description: "Identifies potential acquisition targets in your market",
      icon: <Target className="h-5 w-5 text-purple" />,
    },
  ];

  return (
    <div className="space-y-6 bg-white p-8 rounded-xl border-2 border-purple shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-purple" />
          <h2 className="text-3xl font-bold text-purple">
            CEO Executive Dashboard
          </h2>
          <Badge className="ml-2 bg-purple text-white text-sm px-3 py-1">
            Admin Access
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-purple text-purple"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Custom Range
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-purple text-purple"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-purple text-purple"
            onClick={() => setShowSensitiveData(!showSensitiveData)}
          >
            {showSensitiveData ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Data
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Data
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="monthly"
        value={timeframe}
        onValueChange={setTimeframe}
        className="mt-6"
      >
        <TabsList className="grid grid-cols-5 w-full bg-purple/10">
          <TabsTrigger
            value="monthly"
            className="data-[state=active]:bg-purple data-[state=active]:text-white"
          >
            Monthly
          </TabsTrigger>
          <TabsTrigger
            value="weekly"
            className="data-[state=active]:bg-purple data-[state=active]:text-white"
          >
            Weekly
          </TabsTrigger>
          <TabsTrigger
            value="daily"
            className="data-[state=active]:bg-purple data-[state=active]:text-white"
          >
            Daily
          </TabsTrigger>
          <TabsTrigger
            value="hourly"
            className="data-[state=active]:bg-purple data-[state=active]:text-white"
          >
            Hourly
          </TabsTrigger>
          <TabsTrigger
            value="realtime"
            className="text-red-500 data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            Real-time
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-purple/10 to-purple/5 border-purple/20 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Total Revenue
                    </p>
                    <h3 className="text-3xl font-bold mt-1 text-purple">
                      {formatCurrency(revenueData.total)}
                    </h3>
                  </div>
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <DollarSign className="h-6 w-6 text-purple" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  {revenueData.percentChange > 0 ? (
                    <span className="text-green-500 font-medium flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      {formatPercentage(revenueData.percentChange)} from
                      previous period
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium flex items-center">
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      {formatPercentage(
                        Math.abs(revenueData.percentChange),
                      )}{" "}
                      from previous period
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Projected Revenue
                    </p>
                    <h3 className="text-3xl font-bold mt-1 text-blue-600">
                      {formatCurrency(revenueData.projectedRevenue)}
                    </h3>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full shadow-sm">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-blue-500 font-medium">
                    {formatPercentage(
                      (revenueData.projectedRevenue / revenueData.total - 1) *
                        100,
                    )}{" "}
                    growth projected
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Expenses
                    </p>
                    <h3 className="text-3xl font-bold mt-1 text-red-600">
                      {formatCurrency(revenueData.expenses)}
                    </h3>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full shadow-sm">
                    <Wallet className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-gray-600 font-medium">
                    {formatPercentage(
                      (revenueData.expenses / revenueData.total) * 100,
                    )}{" "}
                    of revenue
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Net Profit
                    </p>
                    <h3 className="text-3xl font-bold mt-1 text-green-600">
                      {formatCurrency(revenueData.profit)}
                    </h3>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full shadow-sm">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-green-500 font-medium">
                    {formatPercentage(
                      (revenueData.profit / revenueData.total) * 100,
                    )}{" "}
                    profit margin
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="lg:col-span-2 shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-purple" />
                  Revenue Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md border border-gray-200">
                  {timeframe === "realtime" ? (
                    <div className="text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="text-4xl font-bold text-purple">
                          ${revenueData.revenuePerMinute.toFixed(2)}
                        </div>
                        <p className="text-gray-600">Revenue per minute</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-green-100 text-green-800">
                            <Users className="h-3 w-3 mr-1" />
                            1,245 active users
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800">
                            <CreditCard className="h-3 w-3 mr-1" />
                            18 active transactions
                          </Badge>
                        </div>
                        <div className="animate-pulse mt-4 flex items-center gap-2 text-green-500">
                          <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                          Live data updating in real-time
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <LineChart className="h-12 w-12 text-purple/30 mb-4" />
                      <p className="text-gray-500">
                        Revenue chart visualization will appear here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-40 flex items-center justify-center bg-gray-50 rounded-md border border-gray-200 mb-4">
                    <div className="flex flex-col items-center justify-center">
                      <PieChart className="h-12 w-12 text-purple/30 mb-4" />
                      <p className="text-gray-500">
                        Revenue pie chart visualization will appear here
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {revenueData.topSources.map((source, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${index === 0 ? "bg-purple" : index === 1 ? "bg-blue-500" : index === 2 ? "bg-green-500" : "bg-yellow-500"}`}
                          ></div>
                          <span className="text-sm">{source.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {formatCurrency(source.amount)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatPercentage(source.percentage)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions or CEO Features */}
          {timeframe === "realtime" ? (
            <Card className="mt-6 shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {revenueData.recentTransactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple/10 rounded-full">
                          <CreditCard className="h-4 w-4 text-purple" />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.user}</p>
                          <p className="text-xs text-gray-500">
                            {transaction.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mt-6 border-2 border-purple shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-2 bg-purple/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-purple" />
                    Executive Features
                    <Badge className="ml-2 bg-purple text-white">
                      Admin Access
                    </Badge>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-purple"
                  >
                    <Zap className="h-4 w-4" />
                    Activate All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ceoFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:shadow-md transition-all bg-gradient-to-br from-purple/5 to-transparent"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple/10 rounded-full">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{feature.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {feature.description}
                          </p>
                          <Button
                            size="sm"
                            className="mt-3 bg-purple hover:bg-purple/90"
                          >
                            Access Feature
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default CEODashboard;
