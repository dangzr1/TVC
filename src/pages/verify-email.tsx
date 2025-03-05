import React, { useState, useEffect } from "react";
import {
  Link,
  useSearchParams,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import VerificationStatus from "@/components/auth/VerificationStatus";
import { useAuth } from "@/contexts/AuthContext";

// Looking at the previously generated code, AuthHeader is a dummy component
// Let's create a simple header component inline
const SimpleHeader = () => {
  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 px-4 md:px-6 lg:px-8 flex items-center">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple rounded-md flex items-center justify-center">
            <span className="text-white font-bold">TVC</span>
          </div>
          <span className="text-xl font-bold text-purple">
            TheVendorsConnect
          </span>
        </Link>
      </div>
    </header>
  );
};

const VerifyEmailPage = () => {
  const { isAuthenticated, user, verifyUserEmail, resendVerification } =
    useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "user@example.com";
  const [token, setToken] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate expiry time (12 hours from now)
  const expiryTime = new Date(Date.now() + 12 * 60 * 60 * 1000);

  // If user is already authenticated and verified, redirect to dashboard
  if (isAuthenticated && user && user.isVerified) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  useEffect(() => {
    // Extract token from hash fragment
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    if (accessToken) {
      setToken(accessToken);
      handleVerification(accessToken);

      // Fix the localhost redirect issue by replacing the URL
      if (location.hash.includes("localhost")) {
        const currentUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, currentUrl);
      }
    }
  }, [location]);

  // Check if the URL contains a type=recovery or type=signup parameter
  // This is how Supabase redirects back after email verification
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "signup" || type === "recovery") {
      setIsVerified(true);

      // Automatically redirect to dashboard after verification
      setTimeout(() => {
        navigate("/dashboard/vendor");
      }, 3000);
    }
  }, [searchParams, navigate]);

  const handleVerification = async (accessToken: string) => {
    setIsVerifying(true);
    try {
      await verifyUserEmail(accessToken);
      setIsVerified(true);

      // Automatically redirect to dashboard after verification
      setTimeout(() => {
        navigate("/dashboard/vendor");
      }, 3000);
    } catch (error: any) {
      console.error("Email verification failed:", error);
      setError(error.message || "Failed to verify email. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    setIsVerifying(true);
    try {
      await resendVerification(email);
    } catch (error) {
      console.error("Failed to resend verification email:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SimpleHeader />

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl">
          <div className="mb-8">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              asChild
            >
              <Link to="/login">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </Button>
          </div>

          <VerificationStatus
            email={email}
            isVerified={isVerified}
            isVerifying={isVerifying}
            error={error}
            token={token}
            expiryTime={expiryTime}
            resendVerification={handleResendVerification}
          />

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              If you're having trouble with the verification process, please{" "}
              <a href="/contact" className="text-primary hover:underline">
                contact our support team
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        <p>
          © {new Date().getFullYear()} TheVendorsConnect. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default VerifyEmailPage;
