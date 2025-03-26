import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface RegistrationFormProps {
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
}

const NewRegistrationForm = ({
  onSubmit,
  isLoading: externalLoading,
}: RegistrationFormProps) => {
  const { register, isLoading: authLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pin, setPin] = useState("");
  const [role, setRole] = useState<"vendor" | "client">("client");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Use either the external loading state or the auth loading state
  const isLoading =
    externalLoading !== undefined ? externalLoading : authLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!username.trim() || !password.trim() || !pin.trim()) {
      setError("All fields are required");
      return;
    }

    // Validate username format (3-12 alphanumeric characters, no special characters)
    if (!/^[a-zA-Z0-9]{3,12}$/.test(username)) {
      setError("Username must be 3-12 alphanumeric characters");
      return;
    }

    // We already check for alphanumeric characters above, so this check is redundant

    // Validate password (min 6 chars)
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Validate PIN (exactly 4 digits)
    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register({
        username,
        password,
        pin,
        role,
      });

      if (onSubmit) {
        onSubmit({
          username,
          password,
          pin,
          role,
        });
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white border-0 shadow-none">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username (3-12 characters)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Choose a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showPassword"
              checked={showPassword}
              onCheckedChange={() => setShowPassword(!showPassword)}
            />
            <Label htmlFor="showPassword" className="text-sm cursor-pointer">
              Show password
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pin">4-Digit PIN</Label>
            <Input
              id="pin"
              type="password"
              placeholder="Choose a 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              disabled={isLoading}
              maxLength={4}
              pattern="[0-9]{4}"
              inputMode="numeric"
              required
            />
            <p className="text-xs text-gray-500">
              This PIN will be used for account recovery and verification.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Account Type</Label>
            <RadioGroup
              value={role}
              onValueChange={(value) => setRole(value as "vendor" | "client")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="client" id="client" />
                <Label htmlFor="client" className="cursor-pointer">
                  Client - Post jobs & hire vendors
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vendor" id="vendor" />
                <Label htmlFor="vendor" className="cursor-pointer">
                  Vendor - Offer services & find jobs
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-gray-500 font-semibold">
              Important: Your role cannot be changed after registration.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple hover:bg-purple/90 text-black font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 px-0">
        <div className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewRegistrationForm;
