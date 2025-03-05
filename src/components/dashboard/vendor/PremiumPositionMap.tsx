import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, User } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";

const PremiumPositionMap = () => {
  const { premiumStatus, availablePositions } = usePremium();

  // Create an array of all positions 1-50
  const allPositions = Array.from({ length: 50 }, (_, i) => i + 1);

  // Determine status of each position
  const getPositionStatus = (position: number) => {
    // Current user's position
    if (premiumStatus.isActive && premiumStatus.position === position) {
      return {
        status: "current",
        tier: premiumStatus.tier,
      };
    }

    // Available positions
    if (position <= 10 && availablePositions.top10.includes(position)) {
      return {
        status: "available",
        tier: "top10",
      };
    }

    if (position > 10 && availablePositions.top50.includes(position)) {
      return {
        status: "available",
        tier: "top50",
      };
    }

    // Taken positions
    return {
      status: "taken",
      tier: position <= 10 ? "top10" : "top50",
    };
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-purple" />
          Premium Positions Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple"></div>
              <span className="text-xs">Your Position</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-xs">Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-xs">Taken</span>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-4 w-4 text-purple" />
            <h3 className="font-medium">Top 10 Premium Positions</h3>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {allPositions.slice(0, 10).map((position) => {
              const status = getPositionStatus(position);
              return (
                <div
                  key={position}
                  className={`h-10 rounded-md flex items-center justify-center ${status.status === "current" ? "bg-purple text-white" : status.status === "available" ? "bg-green-100 border border-green-400" : "bg-gray-100 border border-gray-200"}`}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{position}</span>
                    {status.status === "current" && (
                      <User className="h-3 w-3" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-pink" />
            <h3 className="font-medium">Top 50 Featured Positions</h3>
          </div>
          <div className="grid grid-cols-8 gap-2">
            {allPositions.slice(10, 50).map((position) => {
              const status = getPositionStatus(position);
              return (
                <div
                  key={position}
                  className={`h-8 rounded-md flex items-center justify-center text-sm ${status.status === "current" ? "bg-pink text-white" : status.status === "available" ? "bg-green-100 border border-green-400" : "bg-gray-100 border border-gray-200"}`}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{position}</span>
                    {status.status === "current" && (
                      <User className="h-3 w-3" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumPositionMap;
