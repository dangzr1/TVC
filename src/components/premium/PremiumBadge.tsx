import React from "react";
import { Badge } from "@/components/ui/badge";
import { Crown, Star } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";

interface PremiumBadgeProps {
  showPosition?: boolean;
  className?: string;
}

const PremiumBadge = ({
  showPosition = true,
  className = "",
}: PremiumBadgeProps) => {
  const { premiumStatus } = usePremium();

  if (premiumStatus.tier === "none" || !premiumStatus.isActive) {
    return null;
  }

  return (
    <Badge
      variant="secondary"
      className={`${
        premiumStatus.tier === "top10"
          ? "bg-purple/20 text-purple"
          : "bg-pink/20 text-pink"
      } ${className}`}
    >
      {premiumStatus.tier === "top10" ? (
        <>
          <Crown className="h-3 w-3 mr-1" />
          Premium{showPosition ? ` #${premiumStatus.position}` : ""}
        </>
      ) : (
        <>
          <Star className="h-3 w-3 mr-1" />
          Featured{showPosition ? ` #${premiumStatus.position}` : ""}
        </>
      )}
    </Badge>
  );
};

export default PremiumBadge;
