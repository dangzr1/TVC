import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  Download,
  BarChart2,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Filter,
  ChevronDown,
  Users,
  CreditCard,
  Wallet,
  AlertTriangle,
  CheckCircle,
  Zap,
  Crown,
  Target,
} from "lucide-react";

const RevenueAnalytics = () => {
  const [timeframe, setTimeframe] = useState("monthly");
  const [isLoading, setIsLoading] = useState(true);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [revenueData, setRevenueData] = useState(null);

  // Mock revenue data
  const mockRevenueData = {
    monthly: {
      total: 145890,
      previousPeriod: 128450,
      percentChange: 13.6,
      breakdown: {
        subscriptions: 98750,
        premiumFeatures: 32450,
        transactionFees: 14690,
      },
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
      dailyRevenue: [
        { date: "2023-06-01", amount: 4850 },
        { date: "2023-06-02", amount: 4950 },
        { date: "2023-06-03", amount: 4750 },
        { date: "2023-06-04", amount: 4650 },
        { date: "2023-06-05", amount: 4950 },
        { date: "2023-06-06", amount: 5150 },
        { date: "2023-06-07", amount: 5250 },
        { date: "2023-06-08", amount: 4950 },
        { date: "2023-06-09", amount: 4850 },
        { date: "2023-06-10", amount: 4750 },
        { date: "2023-06-11", amount: 4650 },
        { date: "2023-06-12", amount: 4950 },
        { date: "2023-06-13", amount: 5050 },
        { date: "2023-06-14", amount: 5150 },
        { date: "2023-06-15", amount: 5250 },
        { date: "2023-06-16", amount: 5350 },
        { date: "2023-06-17", amount: 5450 },
        { date: "2023-06-18", amount: 5250 },
        { date: "2023-06-19", amount: 5150 },
        { date: "2023-06-20", amount: 5050 },
        { date: "2023-06-21", amount: 4950 },
        { date: "2023-06-22", amount: 4850 },
        { date: "2023-06-23", amount: 4950 },
        { date: "2023-06-24", amount: 5050 },
        { date: "2023-06-25", amount: 5150 },
        { date: "2023-06-26", amount: 5250 },
        { date: "2023-06-27", amount: 5350 },
        { date: "2023-06-28", amount: 5450 },
        { date: "2023-06-29", amount: 5550 },
        { date: "2023-06-30", amount: 5650 },
      ],
      projectedRevenue: 158000,
      expenses: 67450,
      profit: 78440,
    },
    weekly: {
      total: 34250,
      previousPeriod: 31890,
      percentChange: 7.4,
      breakdown: {
        subscriptions: 23450,
        premiumFeatures: 7650,
        transactionFees: 3150,
      },
      topSources: [
        {
          name: "Premium Vendor Subscriptions",
          amount: 18500,
          percentage: 54.0,
        },
        { name: "Transaction Fees", amount: 3150, percentage: 9.2 },
        { name: "Featured Listings", amount: 7650, percentage: 22.3 },
        { name: "Client Premium Plans", amount: 4950, percentage: 14.5 },
      ],
      dailyRevenue: [
        { date: "2023-06-24", amount: 4750 },
        { date: "2023-06-25", amount: 4850 },
        { date: "2023-06-26", amount: 4950 },
        { date: "2023-06-27", amount: 5050 },
        { date: "2023-06-28", amount: 5150 },
        { date: "2023-06-29", amount: 4750 },
        { date: "2023-06-30", amount: 4750 },
      ],
      projectedRevenue: 36500,
      expenses: 15890,
      profit: 18360,
    },
    daily: {
      total: 5650,
      previousPeriod: 5450,
      percentChange: 3.7,
      breakdown: {
        subscriptions: 3850,
        premiumFeatures: 1250,
        transactionFees: 550,
      },
      topSources: [
        {
          name: "Premium Vendor Subscriptions",
          amount: 3050,
          percentage: 54.0,
        },
        { name: "Transaction Fees", amount: 550, percentage: 9.7 },
        { name: "Featured Listings", amount: 1250, percentage: 22.1 },
        { name: "Client Premium Plans", amount: 800, percentage: 14.2 },
      ],
      hourlyRevenue: [
        { hour: "00:00", amount: 120 },
        { hour: "01:00", amount: 90 },
        { hour: "02:00", amount: 75 },
        { hour: "03:00", amount: 60 },
        { hour: "04:00", amount: 45 },
        { hour: "05:00", amount: 75 },
        { hour: "06:00", amount: 150 },
        { hour: "07:00", amount: 225 },
        { hour: "08:00", amount: 300 },
        { hour: "09:00", amount: 375 },
        { hour: "10:00", amount: 450 },
        { hour: "11:00", amount: 525 },
        { hour: "12:00", amount: 600 },
        { hour: "13:00", amount: 525 },
        { hour: "14:00", amount: 450 },
        { hour: "15:00", amount: 375 },
        { hour: "16:00", amount: 300 },
        { hour: "17:00", amount: 375 },
        { hour: "18:00", amount: 450 },
        { hour: "19:00", amount: 375 },
        { hour: "20:00", amount: 300 },
        { hour: "21:00", amount: 225 },
        { hour: "22:00", amount: 180 },
        { hour: "23:00", amount: 150 },
      ],
      projectedRevenue: 5800,
      expenses: 2650,
      profit: 3000,
    },
    hourly: {
      total: 450,
      previousPeriod: 375,
      percentChange: 20.0,
      breakdown: {
        subscriptions: 300,
        premiumFeatures: 100,
        transactionFees: 50,
      },
      topSources: [
        { name: "Premium Vendor Subscriptions", amount: 240, percentage: 53.3 },
        { name: "Transaction Fees", amount: 50, percentage: 11.1 },
        { name: "Featured Listings", amount: 100, percentage: 22.2 },
        { name: "Client Premium Plans", amount: 60, percentage: 13.3 },
      ],
      minuteRevenue: [
        { minute: "00", amount: 7 },
        { minute: "05", amount: 8 },
        { minute: "10", amount: 7 },
        { minute: "15", amount: 8 },
        { minute: "20", amount: 7 },
        { minute: "25", amount: 8 },
        { minute: "30", amount: 7 },
        { minute: "35", amount: 8 },
        { minute: "40", amount: 7 },
        { minute: "45", amount: 8 },
        { minute: "50", amount: 7 },
        { minute: "55", amount: 8 },
      ],
      projectedRevenue: 475,
      expenses: 210,
      profit: 240,
    },
    realtime: {
      currentUsers: 1245,
      activeTransactions: 18,
      revenuePerMinute: 7.5,
      topActiveSources: [
        { name: "Premium Vendor Subscriptions", amount: 4.0, percentage: 53.3 },
        { name: "Transaction Fees", amount: 0.8, percentage: 10.7 },
        { name: "Featured Listings", amount: 1.7, percentage: 22.7 },
        { name: "Client Premium Plans", amount: 1.0, percentage: 13.3 },
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
        {
          id: "tx120",
          user: "Sarah Williams",
          amount: 29.99,
          type: "Client Premium",
          time: "5 minutes ago",
        },
        {
          id: "tx119",
          user: "Robert Chen",
          amount: 49.99,
          type: "Premium Subscription",
          time: "7 minutes ago",
        },
      ],
      projectedHourlyRevenue: 450,
    },
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate loading data
    setTimeout(() => {
      setRevenueData(mockRevenueData[timeframe]);
      setIsLoading(false);
    }, 800);
  }, [timeframe]);

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
    },
    {
      name: "Competitor Intelligence",
      description: "Real-time market share and competitor analysis",
    },
    {
      name: "Strategic Opportunity Alerts",
      description: "Automated alerts for high-value business opportunities",
    },
    {
      name: "Executive Dashboard",
      description: "Personalized KPIs and business health metrics",
    },
    {
      name: "Acquisition Target Finder",
      description: "Identifies potential acquisition targets in your market",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Revenue Analytics</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Calendar className="h-4 w-4 mr-2" />
            Custom Range
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => setShowSensitiveData(!showSensitiveData)}
          >
            {showSensitiveData ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Sensitive Data
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Sensitive Data
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="monthly"
        value={timeframe}
        onValueChange={setTimeframe}
      >
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="realtime" className="text-red-500">
            Real-time
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-purple/10 to-purple/5 border-purple/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Total Revenue</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {showSensitiveData ? (
                          formatCurrency(revenueData.total)
                        ) : (
                          <span className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-gray-400" />
                            <span className="blur-sm">$XXX,XXX</span>
                          </span>
                        )}
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

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Projected Revenue</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {showSensitiveData ? (
                          formatCurrency(revenueData.projectedRevenue)
                        ) : (
                          <span className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-gray-400" />
                            <span className="blur-sm">$XXX,XXX</span>
                          </span>
                        )}
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

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Expenses</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {showSensitiveData ? (
                          formatCurrency(revenueData.expenses)
                        ) : (
                          <span className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-gray-400" />
                            <span className="blur-sm">$XX,XXX</span>
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="p-3 bg-red-100 rounded-full shadow-sm">
                      <Wallet className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <span className="text-gray-500 font-medium">
                      {formatPercentage(
                        (revenueData.expenses / revenueData.total) * 100,
                      )}{" "}
                      of revenue
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Net Profit</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {showSensitiveData ? (
                          formatCurrency(revenueData.profit)
                        ) : (
                          <span className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-gray-400" />
                            <span className="blur-sm">$XX,XXX</span>
                          </span>
                        )}
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>Revenue Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                    {timeframe === "realtime" ? (
                      <div className="text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="text-4xl font-bold text-purple">
                            {showSensitiveData ? (
                              `$${revenueData.revenuePerMinute.toFixed(2)}`
                            ) : (
                              <span className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-gray-400" />
                                <span className="blur-sm">$X.XX</span>
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500">Revenue per minute</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-green-100 text-green-800">
                              <Users className="h-3 w-3 mr-1" />
                              {revenueData.currentUsers} active users
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800">
                              <CreditCard className="h-3 w-3 mr-1" />
                              {revenueData.activeTransactions} active
                              transactions
                            </Badge>
                          </div>
                          <div className="animate-pulse mt-4 flex items-center gap-2 text-green-500">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            Live data updating in real-time
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        Revenue chart would appear here
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-40 flex items-center justify-center bg-gray-50 rounded-md mb-4">
                      <p className="text-gray-500">
                        Revenue pie chart would appear here
                      </p>
                    </div>
                    <div className="space-y-3">
                      {revenueData.topSources &&
                        revenueData.topSources.map((source, index) => (
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
                                {showSensitiveData ? (
                                  formatCurrency(source.amount)
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <Lock className="h-3 w-3 text-gray-400" />
                                    <span className="blur-sm">$XX,XXX</span>
                                  </span>
                                )}
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
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {revenueData.recentTransactions.map(
                      (transaction, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
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
                              {showSensitiveData ? (
                                `$${transaction.amount.toFixed(2)}`
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Lock className="h-3 w-3 text-gray-400" />
                                  <span className="blur-sm">$XX.XX</span>
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {transaction.time}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-purple">
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
                      onClick={() => {
                        alert("Activating all executive features");
                        // In a real app, this would activate all features
                      }}
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
                            {index === 0 ? (
                              <BarChart2 className="h-5 w-5 text-purple" />
                            ) : index === 1 ? (
                              <Eye className="h-5 w-5 text-purple" />
                            ) : index === 2 ? (
                              <AlertTriangle className="h-5 w-5 text-purple" />
                            ) : index === 3 ? (
                              <PieChart className="h-5 w-5 text-purple" />
                            ) : (
                              <Target className="h-5 w-5 text-purple" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{feature.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {feature.description}
                            </p>
                            <Button
                              size="sm"
                              className="mt-3 bg-purple hover:bg-purple/90"
                              onClick={() => {
                                alert(
                                  `Accessing executive feature: ${feature.name}`,
                                );
                                // In a real app, this would open the feature
                              }}
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
        )}
      </Tabs>
    </div>
  );
};

export default RevenueAnalytics;
