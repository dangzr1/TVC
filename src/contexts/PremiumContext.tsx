import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

export type PremiumTier = "none" | "top10" | "top50";

export interface PremiumStatus {
  tier: PremiumTier;
  position: number;
  expiresAt: Date | null;
  isActive: boolean;
  isCancelled?: boolean;
}

export interface PremiumContextType {
  premiumStatus: PremiumStatus;
  availablePositions: {
    top10: number[];
    top50: number[];
  };
  isLoading: boolean;
  upgradeToPremium: (
    tier: "top10" | "top50",
    position: number,
    billingCycle: "monthly" | "annual",
  ) => Promise<boolean>;
  cancelPremium: () => Promise<boolean>;
  refreshPremiumStatus: () => Promise<void>;
}

const defaultPremiumStatus: PremiumStatus = {
  tier: "none",
  position: 0,
  expiresAt: null,
  isActive: false,
  isCancelled: false,
};

const defaultAvailablePositions = {
  top10: [],
  top50: [],
};

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [premiumStatus, setPremiumStatus] =
    useState<PremiumStatus>(defaultPremiumStatus);
  const [availablePositions, setAvailablePositions] = useState(
    defaultAvailablePositions,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch premium status when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshPremiumStatus();
      fetchAvailablePositions();
    } else {
      setPremiumStatus(defaultPremiumStatus);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const refreshPremiumStatus = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from("premium_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        setPremiumStatus({
          tier: data.tier as PremiumTier,
          position: data.position,
          expiresAt: data.expires_at ? new Date(data.expires_at) : null,
          isActive: !!data.expires_at && new Date(data.expires_at) > new Date(),
          isCancelled: data.is_cancelled || false,
        });
      } else {
        setPremiumStatus(defaultPremiumStatus);
      }
    } catch (error) {
      console.error("Error fetching premium status:", error);
      setPremiumStatus(defaultPremiumStatus);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailablePositions = async () => {
    try {
      // Fetch from Supabase
      const { data: top10Data, error: top10Error } = await supabase
        .from("premium_positions")
        .select("position")
        .eq("tier", "top10")
        .eq("is_available", true)
        .order("position", { ascending: true });

      const { data: top50Data, error: top50Error } = await supabase
        .from("premium_positions")
        .select("position")
        .eq("tier", "top50")
        .eq("is_available", true)
        .order("position", { ascending: true });

      if (top10Error) throw top10Error;
      if (top50Error) throw top50Error;

      setAvailablePositions({
        top10: top10Data?.map((item) => item.position) || [],
        top50: top50Data?.map((item) => item.position) || [],
      });
    } catch (error) {
      console.error("Error fetching available positions:", error);
      // Fallback to some default positions if there's an error
      setAvailablePositions({
        top10: [1, 3, 4, 6, 8, 10],
        top50: [11, 12, 15, 18, 20, 25, 30, 35, 40, 45, 50],
      });
    }
  };

  const upgradeToPremium = async (
    tier: "top10" | "top50",
    position: number,
    billingCycle: "monthly" | "annual",
  ) => {
    if (!user) return false;

    setIsLoading(true);
    try {
      // Calculate price based on tier, position and billing cycle
      const price = calculatePrice(tier, position, billingCycle);

      // In a real implementation, this would process payment through Stripe first
      // For now, we'll just create the subscription record

      // Calculate expiry date (1 month or 1 year from now)
      const expiresAt = new Date();
      if (billingCycle === "monthly") {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }

      // First check if the position is still available
      const { data: positionData, error: positionError } = await supabase
        .from("premium_positions")
        .select("*")
        .eq("tier", tier)
        .eq("position", position)
        .eq("is_available", true)
        .single();

      if (positionError || !positionData) {
        throw new Error(
          "This position is no longer available. Please select another position.",
        );
      }

      // Create subscription record in Supabase
      const { data: subscriptionData, error: subscriptionError } =
        await supabase
          .from("premium_subscriptions")
          .insert([
            {
              user_id: user.id,
              tier,
              position,
              billing_cycle: billingCycle,
              amount: price,
              expires_at: expiresAt.toISOString(),
              is_active: true,
            },
          ])
          .select()
          .single();

      if (subscriptionError) throw subscriptionError;

      // Create payment record
      const { error: paymentError } = await supabase
        .from("payment_history")
        .insert([
          {
            user_id: user.id,
            subscription_id: subscriptionData.id,
            amount: price,
            status: "successful",
            description: `Premium ${tier === "top10" ? "Top 10" : "Top 50"} Membership - Position #${position}`,
            payment_method: "credit_card", // This would come from the payment processor
            payment_id: `pay_${Math.random().toString(36).substring(2, 15)}`, // This would come from the payment processor
          },
        ]);

      if (paymentError) throw paymentError;

      // Update local state
      setPremiumStatus({
        tier,
        position,
        expiresAt,
        isActive: true,
      });

      // Update available positions
      await fetchAvailablePositions();

      return true;
    } catch (error) {
      console.error("Error upgrading to premium:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelPremium = async () => {
    if (!user) return false;

    setIsLoading(true);
    try {
      // In a real implementation, this would also cancel the subscription in Stripe

      // Get the current active subscription
      const { data: subscription, error: fetchError } = await supabase
        .from("premium_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !subscription) {
        throw new Error("No active subscription found");
      }

      // We don't actually deactivate the subscription - we just mark it as cancelled
      // but it will remain active until the expiration date
      const { error: updateError } = await supabase
        .from("premium_subscriptions")
        .update({ is_cancelled: true })
        .eq("id", subscription.id);

      if (updateError) throw updateError;

      // Keep the premium status active until expiration date
      // Just update the local state to show it's been cancelled but still active
      setPremiumStatus({
        ...premiumStatus,
        isCancelled: true,
      });

      return true;
    } catch (error) {
      console.error("Error cancelling premium:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate price
  const calculatePrice = (
    tier: "top10" | "top50",
    position: number,
    billingCycle: "monthly" | "annual",
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
    if (billingCycle === "annual") {
      return basePrice * 12 * 0.8;
    }

    return basePrice;
  };

  const value = {
    premiumStatus,
    availablePositions,
    isLoading,
    upgradeToPremium,
    cancelPremium,
    refreshPremiumStatus,
  };

  return (
    <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
};
