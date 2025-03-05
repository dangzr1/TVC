import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Users, Calculator } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";

const PremiumRoi = () => {
  const { premiumStatus } = usePremium();

  // Mock data - in a real app, this would come from an API
  const roiData = {
    monthlyInvestment: premiumStatus.tier === "top10" ? 190 : 25,
    estimatedMonthlyRevenue: 5750,
    newClientsPerMonth: 8,
    averageBookingValue: 1250,
    roi: 2926, // (Revenue - Investment) / Investment * 100
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (premiumStatus.tier === "none" || !premiumStatus.isActive) {
    return (
      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-purple" />
            Premium ROI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-dark-gray/70">
            <p>
              Upgrade to premium to see your estimated return on investment.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-purple" />
          Premium ROI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-purple/5 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-purple/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple" />
                </div>
                <div>
                  <p className="text-sm font-medium">Estimated ROI</p>
                  <p className="text-2xl font-bold">{roiData.roi}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-dark-gray/70">Monthly Investment</p>
                <p className="font-medium">
                  {formatCurrency(roiData.monthlyInvestment)}
                </p>
              </div>
            </div>
            <Progress
              value={Math.min(100, roiData.roi / 30)}
              className="h-2 bg-purple/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-light-gray p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-purple" />
                <p className="text-sm font-medium">Est. Monthly Revenue</p>
              </div>
              <p className="text-xl font-bold">
                {formatCurrency(roiData.estimatedMonthlyRevenue)}
              </p>
            </div>

            <div className="bg-light-gray p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-purple" />
                <p className="text-sm font-medium">New Clients/Month</p>
              </div>
              <p className="text-xl font-bold">{roiData.newClientsPerMonth}</p>
            </div>

            <div className="bg-light-gray p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-purple" />
                <p className="text-sm font-medium">Avg. Booking Value</p>
              </div>
              <p className="text-xl font-bold">
                {formatCurrency(roiData.averageBookingValue)}
              </p>
            </div>
          </div>

          <div className="text-xs text-dark-gray/60 italic">
            * ROI calculation: (Estimated Revenue - Premium Cost) / Premium Cost
            × 100
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumRoi;
