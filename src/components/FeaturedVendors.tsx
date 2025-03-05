import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Crown,
  Star,
  Eye,
  Calendar,
  Users,
  Sparkles,
  Zap,
  Award,
  TrendingUp,
} from "lucide-react";

interface FeaturedVendor {
  id: string;
  name: string;
  category: string;
  position: number;
  image: string;
  rating: number;
  reviewCount: number;
  viewCount: number;
  bookingCount: number;
  revenue: number;
  isPremium: boolean;
  premiumTier: "top10" | "top50" | null;
}

interface FeaturedVendorsProps {
  vendors?: FeaturedVendor[];
}

const FeaturedVendors = ({ vendors }: FeaturedVendorsProps) => {
  // Default vendors if none are provided
  const defaultVendors: FeaturedVendor[] = [
    {
      id: "1",
      name: "Elegant Moments Photography",
      category: "Photography",
      position: 1,
      image:
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      rating: 4.9,
      reviewCount: 124,
      viewCount: 3450,
      bookingCount: 87,
      revenue: 125000,
      isPremium: true,
      premiumTier: "top10",
    },
    {
      id: "2",
      name: "Dreamy Venues",
      category: "Venues",
      position: 2,
      image:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      rating: 4.8,
      reviewCount: 98,
      viewCount: 2980,
      bookingCount: 62,
      revenue: 310000,
      isPremium: true,
      premiumTier: "top10",
    },
    {
      id: "3",
      name: "Floral Fantasies",
      category: "Florists",
      position: 3,
      image:
        "https://images.unsplash.com/photo-1464982326199-86f32f81b211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      rating: 4.7,
      reviewCount: 86,
      viewCount: 2450,
      bookingCount: 54,
      revenue: 95000,
      isPremium: true,
      premiumTier: "top10",
    },
    {
      id: "4",
      name: "Harmony Wedding DJs",
      category: "Music",
      position: 4,
      image:
        "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      rating: 4.8,
      reviewCount: 112,
      viewCount: 2100,
      bookingCount: 78,
      revenue: 85000,
      isPremium: true,
      premiumTier: "top10",
    },
    {
      id: "5",
      name: "Sweet Celebrations Bakery",
      category: "Cakes",
      position: 12,
      image:
        "https://images.unsplash.com/photo-1535254973040-607b474cb50d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      rating: 4.6,
      reviewCount: 76,
      viewCount: 1850,
      bookingCount: 42,
      revenue: 65000,
      isPremium: true,
      premiumTier: "top50",
    },
    {
      id: "6",
      name: "Gourmet Wedding Catering",
      category: "Catering",
      position: 15,
      image:
        "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      rating: 4.7,
      reviewCount: 92,
      viewCount: 1920,
      bookingCount: 38,
      revenue: 120000,
      isPremium: true,
      premiumTier: "top50",
    },
  ];

  const displayVendors = vendors || defaultVendors;

  // Filter vendors by premium tier
  const top10Vendors = displayVendors
    .filter((vendor) => vendor.premiumTier === "top10")
    .slice(0, 4);
  const top50Vendors = displayVendors
    .filter((vendor) => vendor.premiumTier === "top50")
    .slice(0, 2);

  // Animation states
  const [animatedStats, setAnimatedStats] = useState<{ [key: string]: number }>(
    {},
  );

  useEffect(() => {
    // Initialize with zeros
    const initialStats: { [key: string]: number } = {};
    [...top10Vendors, ...top50Vendors].forEach((vendor) => {
      initialStats[`viewCount-${vendor.id}`] = 0;
      initialStats[`bookingCount-${vendor.id}`] = 0;
      initialStats[`rating-${vendor.id}`] = 0;
    });
    setAnimatedStats(initialStats);

    // Animate the stats
    const interval = setInterval(() => {
      setAnimatedStats((prev) => {
        const newStats = { ...prev };
        [...top10Vendors, ...top50Vendors].forEach((vendor) => {
          if (newStats[`viewCount-${vendor.id}`] < vendor.viewCount) {
            newStats[`viewCount-${vendor.id}`] += Math.ceil(
              vendor.viewCount / 20,
            );
            if (newStats[`viewCount-${vendor.id}`] > vendor.viewCount) {
              newStats[`viewCount-${vendor.id}`] = vendor.viewCount;
            }
          }

          if (newStats[`bookingCount-${vendor.id}`] < vendor.bookingCount) {
            newStats[`bookingCount-${vendor.id}`] += Math.ceil(
              vendor.bookingCount / 20,
            );
            if (newStats[`bookingCount-${vendor.id}`] > vendor.bookingCount) {
              newStats[`bookingCount-${vendor.id}`] = vendor.bookingCount;
            }
          }

          if (newStats[`rating-${vendor.id}`] < vendor.rating) {
            newStats[`rating-${vendor.id}`] += 0.1;
            if (newStats[`rating-${vendor.id}`] > vendor.rating) {
              newStats[`rating-${vendor.id}`] = vendor.rating;
            }
          }
        });
        return newStats;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [top10Vendors, top50Vendors]);

  return (
    <div className="w-full">
      {/* Top 10 Featured Vendors */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-deep-teal to-light-sky-blue rounded-full blur-sm opacity-75 animate-pulse"></div>
              <Crown className="h-8 w-8 text-light-gray relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-light-gray drop-shadow-lg">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-soft-mint to-light-gray animate-shimmer">
                Top 10 Featured Vendors
              </span>
            </h3>
          </div>
          <Link
            to="/vendors/featured"
            className="text-light-sky-blue hover:text-light-gray font-medium text-sm flex items-center bg-deep-teal/50 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-deep-teal/70 transition-all duration-300"
          >
            View all top vendors
            <Sparkles className="ml-1 h-4 w-4 animate-pulse" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {top10Vendors.map((vendor) => (
            <Card
              key={vendor.id}
              className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-none bg-gradient-to-br from-deep-teal/80 to-light-sky-blue/80 backdrop-blur-md hover:scale-105 hover:from-deep-teal/90 hover:to-light-sky-blue/90 text-light-gray"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-deep-teal/90 to-transparent z-10"></div>
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-75"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1 z-20">
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-deep-teal to-light-sky-blue text-light-gray border-none shadow-lg"
                  >
                    <Crown className="h-3 w-3 mr-1 animate-pulse-slow" /> #
                    {vendor.position}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2 z-20">
                  <Badge
                    variant="secondary"
                    className="bg-light-gray/20 backdrop-blur-md text-light-gray border-none"
                  >
                    {vendor.category}
                  </Badge>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h4 className="font-bold text-lg mb-1 truncate text-light-gray drop-shadow-md">
                    {vendor.name}
                  </h4>
                  <div className="flex items-center">
                    <div className="flex items-center bg-light-gray/10 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="h-3 w-3 text-soft-mint mr-1" />
                      <span className="text-xs font-medium">
                        {animatedStats[`rating-${vendor.id}`]?.toFixed(1) || 0}
                      </span>
                    </div>
                    <div className="flex items-center ml-2 text-xs text-light-gray/80">
                      <Eye className="h-3 w-3 mr-1" />
                      {(
                        animatedStats[`viewCount-${vendor.id}`] || 0
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between text-xs text-light-gray/80 mt-2">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span className="flex items-center">
                      <span>
                        {animatedStats[`bookingCount-${vendor.id}`] || 0}
                      </span>
                      <TrendingUp className="h-3 w-3 ml-1 text-soft-mint" />
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-light-sky-blue p-0 h-auto hover:text-light-gray hover:bg-transparent group-hover:scale-105 transition-all duration-300"
                  >
                    <span className="relative">
                      <span className="absolute -inset-1 bg-gradient-to-r from-deep-teal/30 to-light-sky-blue/30 rounded-full blur-sm group-hover:opacity-100 opacity-0 transition-opacity duration-300"></span>
                      <span className="relative">View Profile</span>
                    </span>
                    <Zap className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Top 50 Featured Vendors */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-deep-teal to-light-sky-blue rounded-full blur-sm opacity-75 animate-pulse"></div>
              <Award className="h-7 w-7 text-light-sky-blue relative z-10" />
            </div>
            <h3 className="text-xl font-bold text-light-gray drop-shadow-lg">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-light-sky-blue to-soft-mint animate-shimmer">
                Top 50 Featured Vendors
              </span>
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {top50Vendors.map((vendor) => (
            <Card
              key={vendor.id}
              className="overflow-hidden group hover:shadow-xl transition-all duration-500 border-none bg-gradient-to-br from-deep-teal/60 to-light-sky-blue/60 backdrop-blur-md hover:from-deep-teal/70 hover:to-light-sky-blue/70 text-light-gray"
            >
              <div className="flex">
                <div className="w-1/3 relative overflow-hidden">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-deep-teal/50 to-transparent"></div>
                </div>
                <CardContent className="w-2/3 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-base truncate text-light-gray">
                      {vendor.name}
                    </h4>
                    <Badge
                      variant="outline"
                      className="text-xs h-5 border-light-sky-blue text-light-sky-blue"
                    >
                      #{vendor.position}
                    </Badge>
                  </div>

                  <div className="flex items-center mb-2">
                    <Star className="h-3 w-3 text-soft-mint mr-1" />
                    <span className="text-xs font-medium">
                      {animatedStats[`rating-${vendor.id}`]?.toFixed(1) || 0}
                    </span>
                    <span className="text-xs text-light-gray/70 ml-1">
                      ({vendor.reviewCount})
                    </span>
                    <Badge
                      variant="secondary"
                      className="ml-2 text-xs h-5 bg-light-gray/10 backdrop-blur-sm text-light-gray border-none"
                    >
                      {vendor.category}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-light-gray/80">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span className="flex items-center">
                        <span>
                          {animatedStats[`bookingCount-${vendor.id}`] || 0}
                        </span>
                        <TrendingUp className="h-3 w-3 ml-1 text-soft-mint" />
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-light-sky-blue p-0 h-auto hover:text-light-gray hover:bg-transparent group-hover:scale-105 transition-all duration-300"
                    >
                      <span className="relative">
                        <span className="absolute -inset-1 bg-gradient-to-r from-deep-teal/30 to-light-sky-blue/30 rounded-full blur-sm group-hover:opacity-100 opacity-0 transition-opacity duration-300"></span>
                        <span className="relative">View</span>
                      </span>
                      <Zap className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedVendors;
