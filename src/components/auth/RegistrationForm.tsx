import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface RegistrationFormProps {
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
  accountType?: "client" | "vendor";
}

const RegistrationForm = ({
  onSubmit,
  isLoading: externalLoading,
  accountType = "client",
}: RegistrationFormProps) => {
  const { loginWithGoogle, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Use either the external loading state or the auth loading state
  const isLoading =
    externalLoading !== undefined ? externalLoading : authLoading;

  const handleGoogleSignup = async () => {
    setError(null);
    try {
      // Use the account type passed as prop, but if not available, use the one from localStorage
      const selectedType =
        accountType ||
        (localStorage.getItem("selectedAccountType") as "client" | "vendor") ||
        "client";
      localStorage.setItem("selectedAccountType", selectedType);
      console.log(
        `Registration: Setting account type to ${selectedType} before Google login`,
      );
      await loginWithGoogle();
      // The redirect will happen automatically through the auth context
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message || "Google login failed. Please try again.");
    }
  };

  const handleUsernameSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate username
    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // For now, just show a message that username registration is coming soon
    setError(
      "Username registration will be available soon. Please use Google sign-in for now.",
    );
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-none border-0">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold text-center">
          Create your account
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div className="text-center text-gray-600 mb-4">
            <p>
              Join our platform to connect with couples planning their wedding
            </p>
          </div>

          <form onSubmit={handleUsernameSignup} className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple hover:bg-purple/90 text-black font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 mb-4">
              Or create your account with:
            </p>

            <Button
              variant="default"
              type="button"
              className="w-full flex items-center justify-center gap-2 h-10 bg-purple hover:bg-purple/90"
              onClick={handleGoogleSignup}
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 0 24 24"
                width="20"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              <span className="text-black font-medium">
                Sign up with Google
              </span>
            </Button>

            <p className="text-xs text-gray-500 mt-4">
              By signing up, you agree to our{" "}
              <a href="/terms" className="text-purple hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-purple hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center px-0">
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegistrationForm;
