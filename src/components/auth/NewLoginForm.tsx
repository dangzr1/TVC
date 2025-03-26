import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/NewAuthContext";
import { Link } from "react-router-dom";

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
}

const NewLoginForm = ({
  onSubmit,
  isLoading: externalLoading,
}: LoginFormProps) => {
  const { login, isLoading: authLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPinVerification, setShowPinVerification] = useState(false);
  const [pin, setPin] = useState("");

  // Use either the external loading state or the auth loading state
  const isLoading =
    externalLoading !== undefined ? externalLoading : authLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    try {
      // If we're not using 2FA, just login directly
      if (!showPinVerification) {
        await login({ username, password });
        if (onSubmit) onSubmit({ username, password });
      } else {
        // Handle 2FA flow here if implemented
        // For now, we'll just login directly
        await login({ username, password });
        if (onSubmit) onSubmit({ username, password });
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {showPinVerification && (
            <div className="space-y-2">
              <Label htmlFor="pin">4-Digit PIN</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter your 4-digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                disabled={isLoading}
                maxLength={4}
                pattern="[0-9]{4}"
                inputMode="numeric"
                required={showPinVerification}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-purple hover:bg-purple/90 text-black font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-purple hover:underline"
            >
              Forgot your password? Use your PIN to reset
            </Link>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 px-0">
        <div className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple hover:underline font-medium"
          >
            Create an account
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewLoginForm;
