import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="pt-32 pb-20 bg-gradient-to-r from-purple via-lavender to-pink relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-light-pink/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-white/15 rounded-full filter blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center">
            <span className="text-purple font-bold text-xl">TVC</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          TheVendorsConnect
        </h1>

        <p className="text-xl text-white mb-10 max-w-2xl mx-auto">
          Find and connect with wedding professionals in our community chat
          below
        </p>

        <div className="flex justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-white text-purple hover:bg-gray-100"
          >
            <Link to="/register">Join Our Community</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
