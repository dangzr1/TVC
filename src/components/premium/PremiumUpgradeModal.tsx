import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Crown, Star, AlertCircle, Info } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: "top10" | "top50";
}

const PremiumUpgradeModal = ({
  isOpen,
  onClose,
  initialTier = "top10",
}: PremiumUpgradeModalProps) => {
  const { availablePositions, upgradeToPremium, isLoading } = usePremium();
  const [selectedTier, setSelectedTier] = useState<"top10" | "top50">(
    initialTier,
  );
  const [selectedPosition, setSelectedPosition] = useState<number>(0);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedTier(initialTier);
      setSelectedPosition(0);
      setBillingCycle("monthly");
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, initialTier]);

  // Set default position when tier changes or when positions load
  React.useEffect(() => {
    const positions =
      selectedTier === "top10"
        ? availablePositions.top10
        : availablePositions.top50;
    if (positions.length > 0 && !positions.includes(selectedPosition)) {
      setSelectedPosition(positions[0]);
    }
  }, [selectedTier, availablePositions, selectedPosition]);

  // Calculate price based on position and billing cycle
  const calculatePrice = (
    tier: "top10" | "top50",
    position: number,
    cycle: "monthly" | "annual",
  ) => {
    let basePrice = 0;

    if (tier === "top10") {
      // Position 1 costs the most, decreasing as position number increases
      basePrice = 100 + (10 - position) * 10; // Position 1: $190/mo, Position 10: $100/mo
    } else {
      // Top 50 tier costs $25/mo base
      basePrice = 25;
    }

    // Annual discount (20% off)
    if (cycle === "annual") {
      return basePrice * 12 * 0.8;
    }

    return basePrice;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleUpgrade = async () => {
    if (selectedPosition === 0) {
      setError("Please select a position");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Call the upgradeToPremium function
      const success = await upgradeToPremium(
        selectedTier,
        selectedPosition,
        billingCycle,
      );

      if (success) {
        setSuccess(true);
        // Close the modal after a delay
        setTimeout(() => {
          onClose();
          // Force reload the page to show the updated premium status
          window.location.reload();
        }, 2000);
      } else {
        setError("Failed to process payment. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {selectedTier === "top10" ? (
              <span className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-purple" />
                Top 10 Premium Membership
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Star className="h-5 w-5 text-pink" />
                Top 50 Premium Membership
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            Select your preferred position and billing cycle
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success ? (
          <div className="py-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Payment Successful!
            </h3>
            <p className="text-gray-500">
              Your premium subscription is now active. Enjoy all the premium
              features!
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium">Membership tier:</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={selectedTier === "top10" ? "default" : "outline"}
                  className={selectedTier === "top10" ? "bg-purple" : ""}
                  onClick={() => setSelectedTier("top10")}
                >
                  <Crown className="mr-2 h-4 w-4" /> Top 10
                </Button>
                <Button
                  variant={selectedTier === "top50" ? "default" : "outline"}
                  className={selectedTier === "top50" ? "bg-pink" : ""}
                  onClick={() => setSelectedTier("top50")}
                >
                  <Star className="mr-2 h-4 w-4" /> Top 50
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">
                Choose your position:
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {(selectedTier === "top10"
                  ? availablePositions.top10
                  : availablePositions.top50
                ).map((pos) => (
                  <Button
                    key={pos}
                    variant={selectedPosition === pos ? "default" : "outline"}
                    className={`h-10 ${selectedPosition === pos ? (selectedTier === "top10" ? "bg-purple" : "bg-pink") : ""}`}
                    onClick={() => setSelectedPosition(pos)}
                  >
                    #{pos}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Billing cycle:</h4>
              <RadioGroup
                defaultValue="monthly"
                className="flex gap-4"
                onValueChange={(value) =>
                  setBillingCycle(value as "monthly" | "annual")
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="annual" id="annual" />
                  <Label htmlFor="annual">Annual (20% off)</Label>
                </div>
              </RadioGroup>
            </div>

            <Alert
              variant="default"
              className={
                selectedTier === "top10"
                  ? "bg-purple/10 border-purple/30"
                  : "bg-pink/10 border-pink/30"
              }
            >
              <Info className="h-4 w-4" />
              <AlertTitle>Price</AlertTitle>
              <AlertDescription className="font-medium">
                {billingCycle === "monthly" ? (
                  <>
                    {formatCurrency(
                      calculatePrice(selectedTier, selectedPosition, "monthly"),
                    )}
                    /month
                  </>
                ) : (
                  <>
                    {formatCurrency(
                      calculatePrice(selectedTier, selectedPosition, "annual"),
                    )}
                    /year
                    <span className="text-sm font-normal ml-2">
                      (Save{" "}
                      {formatCurrency(
                        calculatePrice(
                          selectedTier,
                          selectedPosition,
                          "monthly",
                        ) *
                          12 *
                          0.2,
                      )}
                      )
                    </span>
                  </>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing || success}
          >
            {success ? "Close" : "Cancel"}
          </Button>
          {!success && (
            <Button
              onClick={handleUpgrade}
              disabled={isProcessing || selectedPosition === 0 || isLoading}
              className={
                selectedTier === "top10"
                  ? "bg-purple hover:bg-purple/90"
                  : "bg-pink hover:bg-pink/90"
              }
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Upgrade Now"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumUpgradeModal;
