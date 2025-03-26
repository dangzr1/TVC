import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/NewAuthContext";

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

interface ForgotPasswordFormProps {
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
}

const ForgotPasswordForm = ({
  onSubmit,
  isLoading: externalLoading,
}: ForgotPasswordFormProps) => {
  const { resetUserPassword, isLoading: authLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Use either the external loading state or the auth loading state
  const isLoading =
    externalLoading !== undefined ? externalLoading : authLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (
      !username.trim() ||
      !pin.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      setError("All fields are required");
      return;
    }

    // Validate PIN (exactly 4 digits)
    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    // Validate password (min 6 chars)
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetUserPassword({
        username,
        pin,
        newPassword,
      });

      setSuccess(true);

      if (onSubmit) {
        onSubmit({
          username,
          pin,
          newPassword,
        });
      }
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(
        err.message || "Password reset failed. Please check your information.",
      );
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold text-center">
            Password Reset Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your password has been reset successfully.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <Link to="/login">
              <Button className="bg-purple hover:bg-purple/90">
                Return to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold text-center">
          Reset Your Password
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
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-purple hover:bg-purple/90"
            disabled={isLoading}
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 px-0">
        <div className="text-center text-sm mt-4">
          Remember your password?{" "}
          <Link to="/login" className="text-purple hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordForm;
