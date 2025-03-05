import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Calculator, DollarSign, Stars } from "lucide-react";

const BudgetCalculator = () => {
  const [totalBudget, setTotalBudget] = useState(20000);
  const [allocations, setAllocations] = useState({
    venue: 40,
    catering: 20,
    photography: 12,
    attire: 8,
    flowers: 5,
    music: 7,
    other: 8,
  });

  const [amounts, setAmounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Calculate actual amounts based on percentages
    const newAmounts = Object.entries(allocations).reduce(
      (acc, [key, percentage]) => {
        acc[key] = Math.round((percentage / 100) * totalBudget);
        return acc;
      },
      {} as Record<string, number>,
    );
    setAmounts(newAmounts);
  }, [totalBudget, allocations]);

  const handleSliderChange = (category: string, value: number[]) => {
    // Ensure total stays at 100%
    const currentTotal = Object.entries(allocations)
      .filter(([key]) => key !== category)
      .reduce((sum, [_, value]) => sum + value, 0);

    const newValue = Math.min(value[0], 100 - currentTotal);

    setAllocations({
      ...allocations,
      [category]: newValue,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/50 hover:border-teal-300/50 transition-all duration-300 hover:shadow-teal-500/10 hover:-translate-y-1 group">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-500/20 to-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Calculator className="h-5 w-5 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Wedding Budget Calculator</h3>
          <p className="text-sm text-gray-500">Plan your spending wisely</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Total Budget</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="number"
            value={totalBudget}
            onChange={(e) => setTotalBudget(Number(e.target.value) || 0)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(allocations).map(([category, percentage]) => (
          <div key={category} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium capitalize">
                {category}
              </label>
              <div className="text-sm font-medium">
                {formatCurrency(amounts[category] || 0)} ({percentage}%)
              </div>
            </div>
            <Slider
              value={[percentage]}
              max={100}
              step={1}
              onValueChange={(value) => handleSliderChange(category, value)}
            />
            <Progress value={percentage} className="h-1" />
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <Button className="w-full bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-teal-500/25 group">
          Save Budget Plan{" "}
          <Stars className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default BudgetCalculator;
