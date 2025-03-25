import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Link
              to={`/dashboard/${user?.role || "client"}`}
              className="flex items-center gap-2"
              aria-label="TheVendorsConnect - Go to Dashboard"
            >
              <div
                className="w-8 h-8 bg-purple rounded-md flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-white font-bold">TVC</span>
              </div>
              <span className="text-xl font-bold text-purple">
                TheVendorsConnect
              </span>
            </Link>
          ) : (
            <Link
              to="/"
              className="flex items-center gap-2"
              aria-label="TheVendorsConnect - Go to Home"
            >
              <div
                className="w-8 h-8 bg-purple rounded-md flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-white font-bold">TVC</span>
              </div>
              <span className="text-xl font-bold text-purple">
                TheVendorsConnect
              </span>
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link
                to={`/dashboard/${user?.role || "client"}`}
                className="text-dark-gray hover:text-purple transition-all duration-200 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/faq"
                className="text-dark-gray hover:text-purple transition-all duration-200 font-medium"
              >
                FAQ
              </Link>

              <Link
                to="/terms"
                className="text-dark-gray hover:text-purple transition-all duration-200 font-medium"
              >
                Terms
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="text-dark-gray hover:text-purple transition-all duration-200 font-medium"
              >
                Home
              </Link>
              <Link
                to="/faq"
                className="text-dark-gray hover:text-purple transition-all duration-200 font-medium"
              >
                FAQ
              </Link>
              <Link
                to="/terms"
                className="text-dark-gray hover:text-purple transition-all duration-200 font-medium"
              >
                Terms
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {user?.role === "admin" ? (
                <Button
                  variant="ghost"
                  className="text-dark-gray hover:text-purple transition-all duration-200 hidden md:inline-block"
                  onClick={() => (window.location.href = "/admin")}
                >
                  Admin Dashboard
                </Button>
              ) : (
                <Link
                  to={`/dashboard/${user?.role || "client"}`}
                  className="text-dark-gray hover:text-purple transition-all duration-200 hidden md:inline-block"
                >
                  Dashboard
                </Link>
              )}
              <Button
                onClick={logout}
                variant="outline"
                className="border-purple text-purple hover:bg-purple hover:text-white transition-all duration-200"
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button
                className="bg-purple text-white hover:bg-lavender transition-all duration-200"
                asChild
              >
                <Link to="/login">Sign in</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
