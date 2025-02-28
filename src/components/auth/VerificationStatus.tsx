import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Clock, Mail, RefreshCw } from "lucide-react";

interface VerificationStatusProps {
  email?: string;
  isVerified?: boolean;
  expiryTime?: Date;
  resendVerification?: () => void;
}

const VerificationStatus = ({
  email = "user@example.com",
  isVerified = false,
  expiryTime = new Date(Date.now() + 12 * 60 * 60 * 1000), // Default 12 hours from now
  resendVerification = () => console.log("Resend verification email"),
}: VerificationStatusProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    // Calculate time remaining in seconds
    const calculateTimeRemaining = () => {
      const now = new Date();
      const diffMs = expiryTime.getTime() - now.getTime();
      const diffSec = Math.max(0, Math.floor(diffMs / 1000));
      setTimeRemaining(diffSec);

      // Calculate progress percentage (from 100% to 0%)
      const totalDuration = 12 * 60 * 60; // 12 hours in seconds
      const elapsedDuration = totalDuration - diffSec;
      const progressPercentage = Math.max(
        0,
        100 - (elapsedDuration / totalDuration) * 100,
      );
      setProgress(progressPercentage);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  // Format time remaining as hours:minutes:seconds
  const formatTimeRemaining = () => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-[600px] max-w-full mx-auto bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {isVerified ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Email Verified
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-amber-600">
              <Clock className="h-6 w-6" />
              Verification Pending
            </div>
          )}
        </CardTitle>
        <CardDescription className="text-base mt-2">
          {isVerified
            ? "Your email has been successfully verified. You can now proceed to your dashboard."
            : `We've sent a verification link to ${email}. Please check your inbox and click the link to verify your account.`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {!isVerified && (
          <>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Important</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Your account will be automatically deleted if not verified
                    within 12 hours. Please verify your email to avoid account
                    deletion.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Time remaining</span>
                <span className="font-medium">{formatTimeRemaining()}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Didn't receive the email?
              </h4>
              <p className="text-sm text-gray-600 mt-1 mb-3">
                Check your spam folder or request a new verification link.
              </p>
              <Button
                onClick={resendVerification}
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Resend Verification Email
              </Button>
            </div>
          </>
        )}

        {isVerified && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">
                  Verification Complete
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  Your account has been successfully verified. You now have full
                  access to all features.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center">
        {isVerified ? (
          <Button className="w-full sm:w-auto" asChild>
            <Link to="/login">Go to Dashboard</Link>
          </Button>
        ) : (
          <Button variant="secondary" className="w-full sm:w-auto" asChild>
            <Link to="/login">Back to Login</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VerificationStatus;
