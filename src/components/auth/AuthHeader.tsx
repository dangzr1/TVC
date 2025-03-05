import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogIn, Menu, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthHeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

const AuthHeader = ({
  isLoggedIn: propIsLoggedIn,
  userName: propUserName,
  userAvatar: propUserAvatar,
  onLogout: propOnLogout,
}: AuthHeaderProps) => {
  const { isAuthenticated, user, logout } = useAuth();

  // Use props if provided, otherwise use context values
  const isLoggedIn =
    propIsLoggedIn !== undefined ? propIsLoggedIn : isAuthenticated;
  const userName =
    propUserName ||
    (user ? `${user.firstName} ${user.lastName}` : "Guest User");
  const userAvatar =
    propUserAvatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName.replace(" ", "")}`;
  const onLogout = propOnLogout || logout;
  const userRole = user?.role || "client";

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 px-4 md:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-indigo-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold">TVC</span>
          </div>
          <span className="text-xl font-bold hidden md:inline-block bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600">
            TheVendorsConnect
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback>
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{userName}</span>
                  <span className="text-xs text-gray-500 capitalize">
                    {userRole}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  to={`/dashboard/${userRole}`}
                  className="flex items-center w-full"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <span className="text-destructive">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default AuthHeader;
