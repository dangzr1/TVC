import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, TrendingUp, BarChart, Users, Star, Zap } from "lucide-react";

const PremiumFeatureShowcase = () => {
  const features = [
    {
      icon: <Crown className="h-10 w-10 text-purple" />,
      title: "Premium Placement",
      description:
        "Get featured at the top of search results and on the homepage",
      color: "bg-purple/10",
      badge: "Top 10",
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-pink" />,
      title: "Conversion Boost",
      description: "Premium vendors see up to 3x higher conversion rates",
      color: "bg-pink/10",
      badge: "300% Increase",
    },
    {
      icon: <BarChart className="h-10 w-10 text-purple" />,
      title: "Advanced Analytics",
      description: "Detailed insights into profile views, clicks, and bookings",
      color: "bg-purple/10",
      badge: "Premium Only",
    },
    {
      icon: <Users className="h-10 w-10 text-pink" />,
      title: "Exclusive Leads",
      description: "Get access to high-value client leads before anyone else",
      color: "bg-pink/10",
      badge: "Top 10 Only",
    },
    {
      icon: <Star className="h-10 w-10 text-purple" />,
      title: "Premium Badge",
      description: "Stand out with a premium badge on your profile",
      color: "bg-purple/10",
      badge: "Trust Signal",
    },
    {
      icon: <Zap className="h-10 w-10 text-pink" />,
      title: "Priority Support",
      description: "Get faster responses from our dedicated support team",
      color: "bg-pink/10",
      badge: "24/7 Access",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block bg-purple/10 px-4 py-2 rounded-full mb-4">
            <span className="text-purple font-semibold flex items-center gap-2">
              <Crown className="h-5 w-5" /> Premium Features
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-purple mb-4">
            Exclusive Benefits for Premium Vendors
          </h2>
          <p className="text-xl text-dark-gray/70 max-w-2xl mx-auto">
            Unlock these powerful features to grow your wedding business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div
                  className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <Badge
                    variant="secondary"
                    className="bg-purple/10 text-purple"
                  >
                    {feature.badge}
                  </Badge>
                </div>

                <p className="text-dark-gray/70">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumFeatureShowcase;
