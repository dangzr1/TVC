import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Settings,
  LogOut,
  Search,
  Menu,
  Clock,
  Home,
  Briefcase,
  User,
  BarChart2,
  MessageSquare,
  Edit,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LiveCounter from "./LiveCounter";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/contexts/PremiumContext";
import AvatarSelector from "@/components/AvatarSelector";

interface DashboardHeaderProps {
  userName?: string;
  userRole?: "client" | "vendor" | "admin";
  notificationCount?: number;
  avatarUrl?: string;
}

const DashboardHeader = ({
  userName = "John Doe",
  userRole = "client",
  notificationCount = 3,
  avatarUrl = "https://api.dicebear.com/7.x/shapes/svg?seed=John",
}: DashboardHeaderProps) => {
  const { logout, user } = useAuth();
  const { premiumStatus } = usePremium();
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const location = useLocation();
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState(avatarUrl);

  // Use user data if available
  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`
    : userName;

  // Track session time
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);

    // Log session start to localStorage
    const sessionLog = JSON.parse(localStorage.getItem("sessionLog") || "[]");
    sessionLog.push({
      startTime: new Date(sessionStartTime).toISOString(),
      userAgent: navigator.userAgent,
    });
    localStorage.setItem("sessionLog", JSON.stringify(sessionLog));

    return () => {
      clearInterval(timer);
      // Log session end when component unmounts
      const endSessionLog = JSON.parse(
        localStorage.getItem("sessionLog") || "[]",
      );
      if (endSessionLog.length > 0) {
        const lastSession = endSessionLog[endSessionLog.length - 1];
        lastSession.endTime = new Date().toISOString();
        lastSession.duration = Math.floor(
          (Date.now() - sessionStartTime) / 1000,
        );
        localStorage.setItem("sessionLog", JSON.stringify(endSessionLog));
      }
    };
  }, [sessionStartTime]);

  // Format session time as HH:MM:SS
  const formatSessionTime = () => {
    const hours = Math.floor(sessionTime / 3600);
    const minutes = Math.floor((sessionTime % 3600) / 60);
    const seconds = sessionTime % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <header
        className="bg-white border-b border-gray-200 py-0 px-6 shadow-sm h-10"
        aria-label="Dashboard Header"
      >
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple rounded-md flex items-center justify-center">
              <span className="text-white font-bold">TVC</span>
            </div>
            <span className="text-xl font-bold hidden md:inline-block">
              TheVendorsConnect
            </span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-6 flex-1 max-w-xl mx-4 lg:mx-8">
          <div className="w-full"></div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative group">
                <Button variant="ghost" className="p-0 h-10 w-10 rounded-md">
                  <Avatar className="bg-gradient-to-br from-purple to-pink rounded-md">
                    <AvatarImage
                      src={userAvatar}
                      alt={userName}
                      className="rounded-md"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple to-pink text-white rounded-md">
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
                <button
                  className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsAvatarSelectorOpen(true)}
                >
                  <Edit className="h-3 w-3 text-gray-600" />
                </button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{displayName || userName}</span>
                  <span className="text-xs text-gray-500 capitalize">
                    {userRole}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="flex items-center w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button
                  onClick={logout}
                  className="flex items-center w-full text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Global Navigation Bar */}
      <nav
        className="bg-white border-b border-gray-200 shadow-sm sticky top-10 z-10"
        aria-label="Dashboard Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-12">
            <div className="flex space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === "/" ? "border-purple text-purple" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>

              <Link
                to={`/dashboard/${userRole}`}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname.includes("/dashboard") ? "border-purple text-purple" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                Dashboard
              </Link>

              {userRole === "vendor" && (
                <Link
                  to="/dashboard/vendor?tab=applications"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname.includes("/applications") || location.search.includes("applications") ? "border-purple text-purple" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Applications
                </Link>
              )}

              {userRole === "client" && (
                <Link
                  to="/dashboard/client?tab=jobs"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname.includes("/jobs") || location.search.includes("jobs") ? "border-purple text-purple" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Job Postings
                </Link>
              )}

              <Link
                to="/profile"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname.includes("/profile") ? "border-purple text-purple" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Avatar Selector Modal */}
      <AvatarSelector
        isOpen={isAvatarSelectorOpen}
        onClose={() => setIsAvatarSelectorOpen(false)}
        onSelect={(newAvatar) => {
          setUserAvatar(newAvatar);
          // In a real app, this would update the user's avatar in the database
          localStorage.setItem("userAvatar", newAvatar);

          // Show success message
          const message = document.createElement("div");
          message.className =
            "fixed top-4 right-4 p-4 rounded-md bg-green-100 text-green-800 border border-green-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
          message.innerHTML = `<div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>Avatar updated successfully!</span>
          </div>`;
          document.body.appendChild(message);

          setTimeout(() => {
            message.classList.add(
              "animate-out",
              "fade-out",
              "slide-out-to-top-5",
            );
            setTimeout(() => document.body.removeChild(message), 300);
          }, 3000);
        }}
        currentAvatar={userAvatar}
      />
    </>
  );
};

export default DashboardHeader;
