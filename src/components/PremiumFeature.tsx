import React, { useState } from "react";
import { Button } from "./ui/button";
import { Crown, Star, Check, ArrowRight } from "lucide-react";
import PremiumUpgradeModal from "./premium/PremiumUpgradeModal";

const PremiumFeature = () => {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"top10" | "top50">("top10");

  const handleUpgradeClick = (tier: "top10" | "top50") => {
    setSelectedTier(tier);
    setIsUpgradeModalOpen(true);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block bg-purple/10 px-4 py-2 rounded-full mb-4">
            <span className="text-purple font-semibold flex items-center gap-2">
              <Crown className="h-5 w-5" /> Premium Membership
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-purple mb-4">
            Boost Your Visibility with Premium
          </h2>
          <p className="text-xl text-dark-gray/70 max-w-2xl mx-auto">
            Stand out from the crowd and get more bookings
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-light-gray rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-dark-gray mb-2">Free</h3>
              <p className="text-dark-gray/70">Basic features for couples</p>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-dark-gray">$0</span>
              <span className="text-dark-gray/70">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Browse vendors",
                "Read reviews",
                "Basic planning tools",
                "Limited messaging",
              ].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-5 w-5 text-purple mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-dark-gray">{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full">
              Get Started
            </Button>
          </div>

          {/* Premium Top 50 */}
          <div className="bg-white rounded-xl p-6 border-2 border-lavender shadow-lg relative">
            <div className="absolute -top-4 -right-4 bg-lavender text-white px-3 py-1 rounded-full text-sm font-medium">
              Popular
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-purple mb-2">
                Premium Top 50
              </h3>
              <p className="text-dark-gray/70">
                Enhanced visibility for vendors
              </p>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-purple">$25</span>
              <span className="text-dark-gray/70">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Featured in Top 50 section",
                "Improved search placement",
                "Premium badge on profile",
                "Basic analytics dashboard",
                "Unlimited messaging",
                "Priority support",
              ].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-5 w-5 text-purple mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-dark-gray">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-lavender hover:bg-purple"
              onClick={() => handleUpgradeClick("top50")}
            >
              Upgrade Now
            </Button>
          </div>

          {/* Premium Top 10 */}
          <div className="bg-gradient-to-br from-purple to-pink rounded-xl p-6 border border-lavender shadow-xl">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">
                Premium Top 10
              </h3>
              <p className="text-white/80">Maximum exposure for vendors</p>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$100-190</span>
              <span className="text-white/80">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Featured on homepage Top 10",
                "Priority placement in search",
                "Premium badge on profile",
                "Advanced analytics dashboard",
                "Exclusive access to high-value leads",
                "Dedicated account manager",
                "Guaranteed spot reservation",
              ].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-white">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-white text-purple hover:bg-light-gray"
              onClick={() => handleUpgradeClick("top10")}
            >
              Get Elite Access
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="link"
            className="text-purple hover:text-lavender inline-flex items-center"
          >
            Learn more about premium features
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        initialTier={selectedTier}
      />
    </section>
  );
};

export default PremiumFeature;
