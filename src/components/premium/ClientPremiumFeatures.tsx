import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Star, Zap, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClientPremiumFeaturesProps {
  isPremium?: boolean;
  onUpgrade?: () => void;
}

const ClientPremiumFeatures = ({
  isPremium = false,
  onUpgrade = () => {},
}: ClientPremiumFeaturesProps) => {
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-purple" />
          Premium Client Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPremium ? (
          <div className="space-y-4">
            <div className="bg-purple/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-purple text-white">Premium Active</Badge>
                <Badge variant="outline" className="bg-white text-purple">
                  Until:{" "}
                  {new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                  ).toLocaleDateString()}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                You're enjoying all premium client benefits. Your subscription
                will renew automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-purple/20 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple/10 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-purple" />
                  </div>
                  <h3 className="font-medium">Priority Listings</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Your job postings appear at the top of search results for
                  maximum visibility.
                </p>
              </div>

              <div className="bg-white border border-purple/20 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple/10 flex items-center justify-center">
                    <Star className="h-4 w-4 text-purple" />
                  </div>
                  <h3 className="font-medium">Featured Badge</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Your job postings display a premium badge, attracting 3x more
                  qualified applicants.
                </p>
              </div>

              <div className="bg-white border border-purple/20 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple/10 flex items-center justify-center">
                    <Crown className="h-4 w-4 text-purple" />
                  </div>
                  <h3 className="font-medium">Advanced Analytics</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Access detailed insights about applicant quality, engagement
                  metrics, and hiring trends.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple/10 to-pink/10 p-4 rounded-lg">
              <h3 className="font-medium text-purple mb-2">
                Upgrade to Premium Client
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Get more visibility for your job postings and attract top talent
                faster with premium features.
              </p>
              <Button
                onClick={onUpgrade}
                className="bg-purple hover:bg-purple/90"
              >
                Upgrade Now
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Premium Benefits:</h4>
              <ul className="space-y-2">
                {[
                  "Priority placement in search results",
                  "Featured badge on all your job postings",
                  "Advanced analytics dashboard",
                  "Unlimited job postings",
                  "Premium applicant filtering tools",
                  "Dedicated account manager",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-purple mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Monthly Plan</p>
                  <p className="text-sm text-gray-600">$49.99/month</p>
                </div>
                <Button variant="outline" onClick={onUpgrade}>
                  Select
                </Button>
              </div>
              <div className="border-t my-3"></div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Annual Plan</p>
                  <p className="text-sm text-gray-600">
                    $499.99/year{" "}
                    <span className="text-green-600 font-medium">Save 17%</span>
                  </p>
                </div>
                <Button
                  onClick={onUpgrade}
                  className="bg-purple hover:bg-purple/90"
                >
                  Best Value
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple" />
              Premium Client Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-purple/5 rounded-lg border border-purple/10">
                <div className="h-8 w-8 rounded-full bg-purple/10 flex items-center justify-center">
                  <Star className="h-4 w-4 text-purple" />
                </div>
                <div>
                  <h4 className="font-medium">Priority Support</h4>
                  <p className="text-sm text-gray-600">
                    Get faster responses from our support team
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple/5 rounded-lg border border-purple/10">
                <div className="h-8 w-8 rounded-full bg-purple/10 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-purple" />
                </div>
                <div>
                  <h4 className="font-medium">Featured Job Postings</h4>
                  <p className="text-sm text-gray-600">
                    Your job posts appear at the top of search results
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
};

export default ClientPremiumFeatures;
