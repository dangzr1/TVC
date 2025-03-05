import React from "react";
import {
  Activity,
  AlertCircle,
  BarChart,
  Clock,
  Code,
  Database,
  LineChart,
  Server,
  Shield,
  Zap,
  Calendar,
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-purple" />,
      title: "Availability Calendar",
      description: "See real-time vendor availability for your wedding date.",
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-purple" />,
      title: "Style Matching",
      description:
        "Find vendors that match your unique wedding vision and aesthetic.",
    },
    {
      icon: <Shield className="h-6 w-6 text-pink" />,
      title: "Verified Reviews",
      description:
        "Read authentic reviews from real couples who've used each vendor.",
    },
    {
      icon: <Database className="h-6 w-6 text-purple" />,
      title: "Planning Tools",
      description:
        "Access checklists, timelines, and budgeting tools all in one place.",
    },
    {
      icon: <BarChart className="h-6 w-6 text-purple" />,
      title: "Portfolio Showcase",
      description:
        "Vendors can display their best work with beautiful galleries.",
    },
    {
      icon: <Zap className="h-6 w-6 text-pink" />,
      title: "Instant Messaging",
      description:
        "Communicate directly with vendors through our secure platform.",
    },
    {
      icon: <Server className="h-6 w-6 text-purple" />,
      title: "Premium Placement",
      description:
        "Vendors can boost visibility with premium placement in search results.",
    },
    {
      icon: <Code className="h-6 w-6 text-purple" />,
      title: "Budget Calculator",
      description:
        "Plan your wedding budget and track expenses with our easy-to-use calculator.",
    },
    {
      icon: <Clock className="h-6 w-6 text-pink" />,
      title: "Wedding Timeline",
      description:
        "Create a detailed timeline for your wedding day to keep everything on schedule.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-purple mb-4">
            Powerful Features For Everyone
          </h2>
          <p className="text-xl text-dark-gray/70 max-w-2xl mx-auto">
            Tools and features designed to make wedding planning seamless
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-light-gray p-6 rounded-xl border border-gray-200 hover:border-purple/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple/5"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-white rounded-lg">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-purple">
                  {feature.title}
                </h3>
              </div>
              <p className="text-dark-gray/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
