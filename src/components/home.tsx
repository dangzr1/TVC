import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import CTASection from "./CTASection";
import Footer from "./Footer";
import CommunityChat from "./CommunityChat";
import SitewideDashboard from "./SitewideDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-light-gray text-dark-gray">
      <header>
        <title>TheVendorsConnect - Wedding Professionals Community</title>
        <meta
          name="description"
          content="Find and connect with wedding professionals in our community. TheVendorsConnect helps you discover the perfect vendors for your special day."
        />
      </header>
      <Navbar />
      {isAuthenticated ? (
        <div className="container mx-auto py-8 px-4 mt-16">
          <h1 className="text-3xl font-bold mb-6">
            Welcome to TheVendorsConnect
          </h1>
          {user?.role === "admin" ? (
            <SitewideDashboard />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Welcome back!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Go to your dashboard to manage your account.
              </p>
              <Button
                className="bg-purple hover:bg-purple/90"
                onClick={() =>
                  (window.location.href = `/dashboard/${user?.role || "client"}`)
                }
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mt-16">
            <HeroSection />
            <CommunityChat />
          </div>
        </>
      )}
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;
