import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, Clock } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  status: "successful" | "pending" | "failed";
  description: string;
  tier: "top10" | "top50";
  position: number;
  billingCycle: "monthly" | "annual";
}

const PaymentHistory = () => {
  const { premiumStatus } = usePremium();
  const { user } = useAuth();

  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch payment history from Supabase
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("payment_history")
          .select(
            `
            id,
            amount,
            status,
            description,
            created_at,
            payment_method,
            payment_id,
            premium_subscriptions!inner(tier, position, billing_cycle)
          `,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedData: PaymentRecord[] = data.map((item) => ({
            id: item.id,
            date: item.created_at,
            amount: item.amount,
            status: item.status as "successful" | "pending" | "failed",
            description: item.description,
            tier: item.premium_subscriptions.tier as "top10" | "top50",
            position: item.premium_subscriptions.position,
            billingCycle: item.premium_subscriptions.billing_cycle as
              | "monthly"
              | "annual",
          }));

          setPaymentHistory(formattedData);
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
        // Fallback to empty array
        setPaymentHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "successful":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200 flex items-center gap-1"
          >
            <Check className="h-3 w-3" /> Successful
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-600 border-yellow-200 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" /> Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  if (premiumStatus.tier === "none" || !premiumStatus.isActive) {
    return (
      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-dark-gray/70">
            <p>
              No payment history available. Upgrade to premium to view your
              payment records.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-purple border-t-transparent"></div>
            <p className="mt-2 text-dark-gray/70">Loading payment history...</p>
          </div>
        ) : paymentHistory.length === 0 ? (
          <div className="text-center py-6 text-dark-gray/70">
            <p>No payment records found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-dark-gray/70">
                      {formatDate(payment.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(payment.amount)}
                    </p>
                    <div className="mt-1">{getStatusBadge(payment.status)}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-dark-gray/70">
                  <p>Transaction ID: {payment.id}</p>
                  <p>
                    Billing Cycle:{" "}
                    {payment.billingCycle === "monthly" ? "Monthly" : "Annual"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-xs text-dark-gray/60 italic">
          * Payment receipts are also sent to your email address.
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
