import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { loginWithUsername } from "@/lib/usernameAuth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onSubmit?: (values: any) => void;
  isLoading?: boolean;
  accountType?: "client" | "vendor";
}

const LoginForm = ({
  onSubmit,
  isLoading: externalLoading,
  accountType = "client",
}: LoginFormProps) => {
  const { loginWithGoogle, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Use either the external loading state or the auth loading state
  const isLoading =
    externalLoading !== undefined ? externalLoading : authLoading;

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      // Use the account type passed as prop, but if not available, use the one from localStorage
      const selectedType =
        accountType ||
        (localStorage.getItem("selectedAccountType") as "client" | "vendor") ||
        "client";
      localStorage.setItem("selectedAccountType", selectedType);
      console.log(`Login: Using account type ${selectedType} for Google login`);
      await loginWithGoogle();
      // The redirect will happen automatically through the auth context
      console.log("Google login initiated, waiting for redirect");
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message || "Google login failed. Please try again.");
    }
  };

  const handleUsernameLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const {
        user,
        session,
        error: loginError,
      } = await loginWithUsername(username, password);

      if (loginError) {
        setError(loginError);
        return;
      }

      if (!user) {
        setError("Invalid username or password");
        return;
      }

      // If we have a successful login, redirect to the appropriate dashboard
      const role = user.user_metadata?.role || "client";
      if (role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = `/dashboard/${role}`;
      }
    } catch (err: any) {
      console.error("Username login error:", err);
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold text-center">
          Sign in to your account
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

        <form onSubmit={handleUsernameLogin} className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username or Email</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs text-purple hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple hover:bg-purple/90"
            disabled={isLoading}
          >
            <span className="text-black font-medium">
              {isLoading ? "Signing in..." : "Sign in"}
            </span>
          </Button>
        </form>

        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-center text-gray-600">Or sign in with</p>

          <Button
            variant="default"
            type="button"
            className="w-full flex items-center justify-center gap-2 h-10 bg-purple hover:bg-purple/90"
            onClick={handleGoogleLogin}
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
            <span className="font-bold text-black">Sign in with Google</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 px-0">
        <div className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple hover:underline">
            Sign up
          </Link>
        </div>
        <div className="text-center text-sm">
          By signing in, you agree to our{" "}
          <Button variant="link" className="p-0" type="button" asChild>
            <Link to="/terms">Terms of Service</Link>
          </Button>{" "}
          and{" "}
          <Button variant="link" className="p-0" type="button" asChild>
            <Link to="/privacy">Privacy Policy</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
