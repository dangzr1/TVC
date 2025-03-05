import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Star, Clock, AlertCircle } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";
import PremiumUpgradeModal from "@/components/premium/PremiumUpgradeModal";

interface OpenPosition {
  tier: "top10" | "top50";
  position: number;
  price: number;
  expiresIn?: string;
}

const OpenPositionsNotification = () => {
  const { premiumStatus, availablePositions } = usePremium();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"top10" | "top50">("top10");

  // Don't show if user already has an active premium membership
  if (premiumStatus.tier !== "none" && premiumStatus.isActive) {
    return null;
  }

  // Don't show if there are no available positions
  if (
    availablePositions.top10.length === 0 &&
    availablePositions.top50.length === 0
  ) {
    return null;
  }

  // Create open positions array with pricing
  const openPositions: OpenPosition[] = [
    ...availablePositions.top10.slice(0, 3).map((position) => ({
      tier: "top10" as const,
      position,
      price: 100 + (10 - position) * 10,
      expiresIn: position === 1 ? "2 days" : undefined,
    })),
    ...availablePositions.top50.slice(0, 3).map((position) => ({
      tier: "top50" as const,
      position,
      price: 25,
    })),
  ];

  // Filter positions by tier
  const top10Positions = openPositions.filter((pos) => pos.tier === "top10");
  const top50Positions = openPositions.filter((pos) => pos.tier === "top50");

  const handleUpgradeClick = (tier: "top10" | "top50") => {
    setSelectedTier(tier);
    setIsUpgradeModalOpen(true);
  };

  return (
    <>
      <Alert className="bg-gradient-to-r from-purple/10 to-pink/10 border border-lavender mb-6">
        <AlertCircle className="h-4 w-4 text-purple" />
        <AlertTitle className="text-purple flex items-center gap-2">
          Premium Positions Available!
          <Badge variant="outline" className="ml-2 bg-white text-xs">
            <Clock className="h-3 w-3 mr-1 text-purple" /> Limited Time
          </Badge>
        </AlertTitle>
        <AlertDescription className="mt-2">
          <p className="text-sm text-dark-gray mb-3">
            Secure your spot in our featured vendors section to increase
            visibility and bookings.
          </p>

          <div className="space-y-3">
            {top10Positions.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-md p-3 border border-purple/30">
                <h4 className="text-sm font-medium flex items-center gap-1 text-purple mb-2">
                  <Crown className="h-4 w-4 text-purple" /> Top 10 Positions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {top10Positions.map((pos) => (
                    <div key={pos.position} className="flex items-center">
                      <Badge
                        variant="secondary"
                        className="bg-purple/20 text-purple mr-1"
                      >
                        #{pos.position}
                      </Badge>
                      <span className="text-xs font-medium mr-1">
                        ${pos.price}/mo
                      </span>
                      {pos.expiresIn && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-pink/20 text-purple border-pink/30"
                        >
                          <Clock className="h-3 w-3 mr-1" /> {pos.expiresIn}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs ml-1 text-purple hover:text-purple hover:bg-purple/10"
                        onClick={() => handleUpgradeClick("top10")}
                      >
                        Claim
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {top50Positions.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-md p-3 border border-pink/30">
                <h4 className="text-sm font-medium flex items-center gap-1 text-pink mb-2">
                  <Star className="h-4 w-4 text-pink" /> Top 50 Positions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {top50Positions.map((pos) => (
                    <div key={pos.position} className="flex items-center">
                      <Badge
                        variant="secondary"
                        className="bg-pink/20 text-pink mr-1"
                      >
                        #{pos.position}
                      </Badge>
                      <span className="text-xs font-medium mr-1">
                        ${pos.price}/mo
                      </span>
                      {pos.expiresIn && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-pink/20 text-pink border-pink/30"
                        >
                          <Clock className="h-3 w-3 mr-1" /> {pos.expiresIn}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs ml-1 text-pink hover:text-pink hover:bg-pink/10"
                        onClick={() => handleUpgradeClick("top50")}
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

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        initialTier={selectedTier}
      />
    </>
  );
};

export default OpenPositionsNotification;
