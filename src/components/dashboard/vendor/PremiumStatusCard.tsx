import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Star, Calendar, AlertCircle } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";
import PremiumUpgradeModal from "@/components/premium/PremiumUpgradeModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PremiumStatusCard = () => {
  const { premiumStatus, cancelPremium } = usePremium();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancelPremium = async () => {
    if (
      confirm(
        "Are you sure you want to cancel your premium membership? Your membership will remain active until the end of your current billing period, but will not renew.",
      )
    ) {
      setIsCancelling(true);
      setError(null);
      try {
        const success = await cancelPremium();
        if (!success) {
          setError("Failed to cancel premium membership. Please try again.");
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
        console.error(err);
      } finally {
        setIsCancelling(false);
      }
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderCurrentStatus = () => {
    if (premiumStatus.tier === "none" || !premiumStatus.isActive) {
      return (
        <div className="text-center py-4">
          <div className="mb-4">
            <div className="inline-block p-3 bg-light-gray rounded-full mb-2">
              <AlertCircle className="h-6 w-6 text-dark-gray/70" />
            </div>
            <h3 className="text-lg font-medium">Standard Member</h3>
            <p className="text-dark-gray/70 mt-1">
              Upgrade to premium to increase your visibility and bookings
            </p>
          </div>
          <Button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="bg-purple hover:bg-purple/90"
            id="premium-upgrade"
          >
            Upgrade to Premium
          </Button>
        </div>
      );
    }

    return (
      <div className="py-4">
        <div className="flex items-center justify-center mb-4">
          {premiumStatus.tier === "top10" ? (
            <div className="inline-block p-3 bg-purple/10 rounded-full">
              <Crown className="h-6 w-6 text-purple" />
            </div>
          ) : (
            <div className="inline-block p-3 bg-pink/10 rounded-full">
              <Star className="h-6 w-6 text-pink" />
            </div>
          )}
        </div>

        <div className="text-center mb-4">
          <h3 className="text-lg font-medium">
            {premiumStatus.tier === "top10"
              ? "Premium Top 10"
              : "Premium Top 50"}{" "}
            Member
          </h3>
          <p className="text-dark-gray/70 mt-1">
            Position #{premiumStatus.position}
          </p>
          {premiumStatus.isCancelled && (
            <Badge
              variant="outline"
              className="mt-2 bg-yellow-50 text-yellow-600 border-yellow-200"
            >
              Cancelled - Active until {formatDate(premiumStatus.expiresAt)}
            </Badge>
          )}
        </div>

        <div className="bg-light-gray p-4 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 text-dark-gray mr-2" />
            <span className="text-sm font-medium">Membership Details</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-dark-gray/70">Status:</div>
            <div className="font-medium">Active</div>
            <div className="text-dark-gray/70">Expires on:</div>
            <div className="font-medium">
              {formatDate(premiumStatus.expiresAt)}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsUpgradeModalOpen(true)}
          >
            Change Plan
          </Button>
          {!premiumStatus.isCancelled ? (
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleCancelPremium}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Cancel"}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex-1 opacity-50 cursor-not-allowed"
              disabled={true}
            >
              Cancelled
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Premium Membership</CardTitle>
        <CardDescription>
          Boost your visibility and get more bookings
        </CardDescription>
      </CardHeader>

      <CardContent>{renderCurrentStatus()}</CardContent>

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        initialTier={premiumStatus.tier === "top10" ? "top10" : "top50"}
      />
    </Card>
  );
};

export default PremiumStatusCard;
