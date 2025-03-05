import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Star, Clock, AlertCircle } from "lucide-react";

interface OpenPosition {
  tier: "top10" | "top50";
  position: number;
  price: number;
  expiresIn?: string;
}

interface OpenPositionsAlertProps {
  openPositions?: OpenPosition[];
  onUpgrade?: (tier: "top10" | "top50", position: number) => void;
}

const OpenPositionsAlert = ({
  openPositions = [
    { tier: "top10", position: 3, price: 170, expiresIn: "2 days" },
    { tier: "top10", position: 6, price: 140 },
    { tier: "top50", position: 14, price: 25 },
    { tier: "top50", position: 23, price: 25 },
  ],
  onUpgrade = () => {},
}: OpenPositionsAlertProps) => {
  // Filter positions by tier
  const top10Positions = openPositions.filter((pos) => pos.tier === "top10");
  const top50Positions = openPositions.filter((pos) => pos.tier === "top50");

  if (openPositions.length === 0) {
    return null;
  }

  return (
    <Alert className="bg-gradient-to-r from-soft-mint to-light-sky-blue/30 border border-light-sky-blue">
      <AlertCircle className="h-4 w-4 text-deep-teal" />
      <AlertTitle className="text-deep-teal flex items-center gap-2">
        Premium Positions Available!
        <Badge variant="outline" className="ml-2 bg-light-gray text-xs">
          <Clock className="h-3 w-3 mr-1 text-deep-teal" /> Limited Time
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm text-deep-teal mb-3">
          Secure your spot in our featured vendors section to increase
          visibility and bookings.
        </p>

        <div className="space-y-3">
          {top10Positions.length > 0 && (
            <div className="bg-light-gray/80 backdrop-blur-sm rounded-md p-3 border border-deep-teal/30">
              <h4 className="text-sm font-medium flex items-center gap-1 text-deep-teal mb-2">
                <Crown className="h-4 w-4 text-deep-teal" /> Top 10 Positions
              </h4>
              <div className="flex flex-wrap gap-2">
                {top10Positions.map((pos) => (
                  <div key={pos.position} className="flex items-center">
                    <Badge
                      variant="secondary"
                      className="bg-deep-teal/20 text-deep-teal mr-1"
                    >
                      #{pos.position}
                    </Badge>
                    <span className="text-xs font-medium mr-1">
                      ${pos.price}/mo
                    </span>
                    {pos.expiresIn && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-light-sky-blue/20 text-deep-teal border-light-sky-blue/30"
                      >
                        <Clock className="h-3 w-3 mr-1" /> {pos.expiresIn}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs ml-1 text-deep-teal hover:text-deep-teal hover:bg-soft-mint"
                      onClick={() => onUpgrade("top10", pos.position)}
                    >
                      Claim
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {top50Positions.length > 0 && (
            <div className="bg-light-gray/80 backdrop-blur-sm rounded-md p-3 border border-light-sky-blue/30">
              <h4 className="text-sm font-medium flex items-center gap-1 text-deep-teal mb-2">
                <Star className="h-4 w-4 text-light-sky-blue" /> Top 50
                Positions
              </h4>
              <div className="flex flex-wrap gap-2">
                {top50Positions.map((pos) => (
                  <div key={pos.position} className="flex items-center">
                    <Badge
                      variant="secondary"
                      className="bg-light-sky-blue/30 text-deep-teal mr-1"
                    >
                      #{pos.position}
                    </Badge>
                    <span className="text-xs font-medium mr-1">
                      ${pos.price}/mo
                    </span>
                    {pos.expiresIn && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-light-sky-blue/20 text-deep-teal border-light-sky-blue/30"
                      >
                        <Clock className="h-3 w-3 mr-1" /> {pos.expiresIn}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs ml-1 text-deep-teal hover:text-deep-teal hover:bg-light-sky-blue/20"
                      onClick={() => onUpgrade("top50", pos.position)}
                    >
                      Claim
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default OpenPositionsAlert;
