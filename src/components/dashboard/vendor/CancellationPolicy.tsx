import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CancellationPolicy = () => {
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-purple" />
          Membership & Cancellation Policy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-700">No Refund Policy</AlertTitle>
          <AlertDescription className="text-yellow-600">
            We do not offer refunds for premium memberships. If you cancel, your
            membership will remain active until the end of your current billing
            period.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple" /> Cancellation Terms
          </h3>
          <ul className="space-y-2 text-sm text-dark-gray/80 pl-6 list-disc">
            <li>You can cancel your premium membership at any time</li>
            <li>
              Your premium benefits will remain active until the end of your
              current billing period
            </li>
            <li>
              After cancellation, your membership will not automatically renew
            </li>
            <li>
              Your premium position will be released after your membership
              expires
            </li>
            <li>
              You can upgrade to a different tier or position even after
              cancellation
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-purple" /> Billing Cycles
          </h3>
          <ul className="space-y-2 text-sm text-dark-gray/80 pl-6 list-disc">
            <li>
              <span className="font-medium">Monthly:</span> Billed every 30 days
              from your signup date
            </li>
            <li>
              <span className="font-medium">Annual:</span> Billed once per year
              from your signup date (20% discount)
            </li>
            <li>
              You will receive a reminder email 7 days before your membership
              renews
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CancellationPolicy;
