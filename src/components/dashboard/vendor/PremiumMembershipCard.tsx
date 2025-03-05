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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Star, Check, AlertCircle, Info, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { usePremium } from "@/contexts/PremiumContext";
import PremiumUpgradeModal from "@/components/premium/PremiumUpgradeModal";

interface PremiumMembershipCardProps {
  currentTier?: "none" | "top10" | "top50";
  currentPosition?: number;
  onUpgrade?: (
    tier: "top10" | "top50",
    position: number,
    billingCycle: "monthly" | "annual",
  ) => void;
}

const PremiumMembershipCard = ({
  currentTier = "none",
  currentPosition = 0,
  onUpgrade = () => {},
}: PremiumMembershipCardProps) => {
  const { premiumStatus } = usePremium();
  const [selectedTier, setSelectedTier] = useState<"top10" | "top50">("top10");
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  // Use premium status from context if available
  const tier = premiumStatus.isActive ? premiumStatus.tier : currentTier;
  const position = premiumStatus.isActive
    ? premiumStatus.position
    : currentPosition;

  const renderCurrentStatus = () => {
    if (tier === "none") {
      return (
        <div className="text-center py-4">
          <Badge
            variant="outline"
            className="mb-2 border-purple/30 text-purple"
          >
            Standard Member
          </Badge>
          <p className="text-sm text-purple/70">
            Upgrade to premium to increase your visibility and bookings
          </p>
        </div>
      );
    }

    return (
      <div className="text-center py-4">
        <Badge
          variant="secondary"
          className={`mb-2 ${tier === "top10" ? "bg-purple/20 text-purple" : "bg-pink/30 text-pink"}`}
        >
          {tier === "top10" ? (
            <>
              <Crown className="h-3 w-3 mr-1" /> Top 10 Member
            </>
          ) : (
            <>
              <Star className="h-3 w-3 mr-1" /> Top 50 Member
            </>
          )}
        </Badge>
        <p className="text-sm font-medium">Current Position: #{position}</p>
        <p className="text-xs text-purple/60 mt-1">
          Your premium membership renews on{" "}
          {premiumStatus.expiresAt
            ? new Date(premiumStatus.expiresAt).toLocaleDateString()
            : "July 15, 2023"}
        </p>
      </div>
    );
  };

  return (
    <Card className="w-full bg-light-gray">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple" />
          Premium Membership
        </CardTitle>
        <CardDescription>
          Boost your visibility and get more bookings
        </CardDescription>
      </CardHeader>

      <CardContent>
        {renderCurrentStatus()}

        <Tabs defaultValue="top10" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="top10"
              onClick={() => setSelectedTier("top10")}
              className="data-[state=active]:bg-purple data-[state=active]:text-white"
            >
              <Crown className="h-4 w-4 mr-2" /> Top 10
            </TabsTrigger>
            <TabsTrigger
              value="top50"
              onClick={() => setSelectedTier("top50")}
              className="data-[state=active]:bg-pink data-[state=active]:text-white"
            >
              <Star className="h-4 w-4 mr-2" /> Top 50
            </TabsTrigger>
          </TabsList>

          <TabsContent value="top10" className="space-y-4 mt-4">
            <div className="bg-purple/10 rounded-lg p-4 border border-purple/30">
              <h4 className="font-semibold flex items-center gap-2 text-purple">
                <Crown className="h-4 w-4 text-purple" />
                Top 10 Premium Benefits
              </h4>
              <ul className="mt-2 space-y-2">
                {[
                  "Featured on the homepage in the Top 10 section",
                  "Priority placement in search results",
                  "Premium badge on your profile",
                  "Analytics dashboard with detailed insights",
                  "Exclusive access to high-value client leads",
                  "Guaranteed spot reservation for 12 months (annual plan)",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <Check className="h-4 w-4 text-purple mr-2 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-sm text-purple">
                <p className="font-medium">Pricing:</p>
                <p>Position #1: $190/month • Position #10: $100/month</p>
                <p className="text-xs mt-1">*20% discount for annual billing</p>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Limited Availability</AlertTitle>
              <AlertDescription>
                Only a few positions available in the Top 10 tier.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="top50" className="space-y-4 mt-4">
            <div className="bg-pink/10 rounded-lg p-4 border border-pink/30">
              <h4 className="font-semibold flex items-center gap-2 text-pink">
                <Star className="h-4 w-4 text-pink" />
                Top 50 Premium Benefits
              </h4>
              <ul className="mt-2 space-y-2">
                {[
                  "Featured on the homepage in the Top 50 section",
                  "Improved placement in search results",
                  "Premium badge on your profile",
                  "Basic analytics dashboard",
                  "Access to client leads",
                  "Guaranteed spot reservation for 12 months (annual plan)",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <Check className="h-4 w-4 text-pink mr-2 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-sm text-pink">
                <p className="font-medium">Pricing:</p>
                <p>All positions: $25/month</p>
                <p className="text-xs mt-1">*20% discount for annual billing</p>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Limited Availability</AlertTitle>
              <AlertDescription>
                Only a few positions available in the Top 50 tier.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full bg-purple hover:bg-purple/90"
          onClick={() => setShowUpgradeDialog(true)}
        >
          {tier === "none" ? "Upgrade to Premium" : "Change Premium Plan"}
        </Button>
      </CardFooter>

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        initialTier={selectedTier}
      />
    </Card>
  );
};

export default PremiumMembershipCard;
