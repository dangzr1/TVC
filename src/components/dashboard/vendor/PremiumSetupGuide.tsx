import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Crown, Star, ArrowRight } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";

const PremiumSetupGuide = () => {
  const { premiumStatus } = usePremium();

  // Don't show the guide if the user already has premium
  if (premiumStatus.tier !== "none" && premiumStatus.isActive) {
    return null;
  }

  const steps = [
    {
      title: "Choose your premium tier",
      description:
        "Select between Top 10 or Top 50 premium membership based on your visibility needs and budget.",
      icon: <Crown className="h-5 w-5 text-purple" />,
      completed: false,
    },
    {
      title: "Select your position",
      description:
        "Pick an available position in your chosen tier. Lower numbers get more visibility.",
      icon: <Star className="h-5 w-5 text-pink" />,
      completed: false,
    },
    {
      title: "Complete payment",
      description:
        "Choose monthly or annual billing (save 20% with annual) and complete your payment.",
      icon: <AlertCircle className="h-5 w-5 text-purple" />,
      completed: false,
    },
  ];

  return (
    <Card className="w-full bg-white shadow-sm mb-6 mt-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-purple" />
          Premium Membership Setup Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? "bg-green-100" : "bg-purple/10"}`}
              >
                {step.completed ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="text-sm font-medium text-purple">
                    {index + 1}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-dark-gray/70">{step.description}</p>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Button
              className="w-full bg-purple hover:bg-purple/90"
              onClick={() => (window.location.href = "#premium-upgrade")}
            >
              Start Premium Setup <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumSetupGuide;
