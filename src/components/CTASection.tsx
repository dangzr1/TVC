import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const CTASection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 bg-gradient-to-r from-purple to-pink relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-light-gray/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-light-pink/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Your Wedding Journey?
        </h2>
        <p className="text-xl text-white mb-10 max-w-2xl mx-auto">
          Join thousands of couples and wedding vendors already using
          TheVendorsConnect.
        </p>

        {!isAuthenticated && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-white text-purple hover:bg-light-gray px-6 py-3 text-lg"
              asChild
            >
              <Link to="/register">Create Account</Link>
            </Button>
            <Button
              className="bg-pink hover:bg-opacity-90 text-white px-6 py-3 text-lg"
              asChild
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        )}

        {isAuthenticated && (
          <Button
            className="bg-white text-purple hover:bg-light-gray px-8 py-3 text-lg"
            asChild
          >
            <Link to="/dashboard/vendor">Go to Dashboard</Link>
          </Button>
        )}

        <p className="text-sm text-white mt-6">
          Free for couples. Premium options available for vendors.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
