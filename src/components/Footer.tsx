import React from "react";
import { Link } from "react-router-dom";
import { Link as LucideLink } from "lucide-react";
import {
  Shield,
  Heart,
  Camera,
  Gift,
  Mail,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="bg-purple py-16 border-t border-lavender/20"
      aria-label="Site Footer"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-purple font-bold">TVC</span>
              </div>
              <span className="text-xl font-bold text-white">
                TheVendorsConnect
              </span>
            </div>
            <p className="text-lavender mb-4 max-w-md">
              Connecting couples with wedding vendors to create perfect
              celebrations in a secure and verified environment.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Couples</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard/client"
                  className="text-lavender hover:text-white transition-all duration-200"
                >
                  Wedding Planning Tools
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/vendor"
                  className="text-lavender hover:text-white transition-all duration-200"
                >
                  Find Vendors
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-lavender hover:text-white transition-all duration-200"
                >
                  Wedding Inspiration
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-lavender hover:text-white transition-all duration-200"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Vendors</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/login"
                  className="text-lavender hover:text-white transition-all duration-200"
                >
                  List Your Services
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/vendor"
                  className="text-lavender hover:text-white transition-all duration-200"
                >
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-lavender hover:text-white transition-all duration-200"
                >
                  Success Stories
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/client?tab=premium"
                  className="text-lavender hover:text-white transition-all duration-200"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/profile"
                  className="text-lavender hover:text-white transition-all duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/messages"
                  className="text-lavender hover:text-white transition-all duration-200"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-lavender hover:text-white transition-all duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-lavender hover:text-white transition-all duration-200"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-lavender/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-lavender text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} TheVendorsConnect. All rights
            reserved.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/privacy"
              className="text-lavender hover:text-white transition-all duration-200"
            >
              <Shield className="h-5 w-5" />
            </Link>
            <Link
              to="/favorites"
              className="text-lavender hover:text-white transition-all duration-200"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link
              to="/vendors/photography"
              className="text-lavender hover:text-white transition-all duration-200"
            >
              <Camera className="h-5 w-5" />
            </Link>
            <Link
              to="/registry"
              className="text-lavender hover:text-white transition-all duration-200"
            >
              <Gift className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
