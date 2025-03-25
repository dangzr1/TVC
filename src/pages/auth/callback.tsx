import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // The AuthContext will handle the OAuth callback logic
    // This component just provides a route for the callback URL

    // Manual handling to ensure redirection works
    const handleCallback = async () => {
      try {
        // First check if we're on a dashboard URL with a hash token
        const isDashboardUrl = window.location.pathname.includes("/dashboard/");
        const fullHash = window.location.hash;

        // Check if we have an access token in the URL hash
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token") || "";

        console.log("Callback processing with path:", window.location.pathname);
        console.log("Has access token:", !!accessToken);

        if (accessToken) {
          console.log("Access token found in URL hash, setting session");

          // Set the session using the access token
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

          if (sessionError) {
            console.error("Error setting session:", sessionError);
            window.location.href = "/login";
            return;
          }

          if (sessionData.session) {
            console.log("Session set successfully", sessionData.session);

            // Check if user has a role already set
            const existingRole = sessionData.session.user.user_metadata?.role;

            // Ensure user exists in the users table for persistence
            const currentUser = sessionData.session.user;
            if (currentUser.email) {
              const { error: userUpsertError } = await supabase
                .from("users")
                .upsert(
                  {
                    id: currentUser.id,
                    email: currentUser.email,
                    role: existingRole || null,
                    first_name: currentUser.user_metadata?.first_name || null,
                    last_name: currentUser.user_metadata?.last_name || null,
                    company_name:
                      currentUser.user_metadata?.company_name || null,
                    created_at:
                      currentUser.created_at || new Date().toISOString(),
                    last_sign_in: new Date().toISOString(),
                  },
                  { onConflict: "id" },
                );

              if (userUpsertError) {
                console.error("Error storing user data:", userUpsertError);
                // Continue anyway as we can still use auth metadata
              }
            }

            if (existingRole) {
              // User already has a role, redirect to appropriate dashboard
              console.log("User has existing role:", existingRole);

              // Store the role in localStorage for backup
              localStorage.setItem("userRole", existingRole);

              // Clear any temporary role storage
              localStorage.removeItem("pendingOAuthRole");
              localStorage.removeItem("selectedAccountType");

              // Redirect to appropriate dashboard
              console.log(`Redirecting to dashboard for role: ${existingRole}`);
              window.location.href =
                existingRole === "admin"
                  ? "/admin"
                  : `/dashboard/${existingRole}`;
            } else {
              // New user without a role, redirect to role selection page
              console.log("New user detected, redirecting to role selection");
              window.location.href = "/role-selection";
            }
            return;
          }
        }

        // If no access token in hash, try getting the session normally
        const { data, error } = await supabase.auth.getSession();

        if (data.session) {
          console.log("Session found in callback page", data.session);

          // Ensure user exists in the users table for persistence
          const currentUser = data.session.user;
          if (currentUser.email) {
            const { error: userUpsertError } = await supabase
              .from("users")
              .upsert(
                {
                  id: currentUser.id,
                  email: currentUser.email,
                  role: currentUser.user_metadata?.role || null,
                  first_name: currentUser.user_metadata?.first_name || null,
                  last_name: currentUser.user_metadata?.last_name || null,
                  company_name: currentUser.user_metadata?.company_name || null,
                  created_at:
                    currentUser.created_at || new Date().toISOString(),
                  last_sign_in: new Date().toISOString(),
                },
                { onConflict: "id" },
              );

            if (userUpsertError) {
              console.error("Error storing user data:", userUpsertError);
              // Continue anyway as we can still use auth metadata
            }
          }

          // Check if user has a role already set
          const existingRole = data.session.user.user_metadata?.role;

          if (existingRole) {
            // User already has a role, redirect to appropriate dashboard
            console.log("User has existing role:", existingRole);

            // Store the role in localStorage for backup
            localStorage.setItem("userRole", existingRole);

            // Clear any temporary role storage
            localStorage.removeItem("pendingOAuthRole");
            localStorage.removeItem("selectedAccountType");

            // Redirect to appropriate dashboard
            console.log(`Redirecting to dashboard for role: ${existingRole}`);
            window.location.href =
              existingRole === "admin"
                ? "/admin"
                : `/dashboard/${existingRole}`;
          } else {
            // New user without a role, redirect to role selection page
            console.log("New user detected, redirecting to role selection");
            window.location.href = "/role-selection";
          }
        } else if (error || (!isLoading && !isAuthenticated)) {
          // If something went wrong, redirect to login
          console.error("Error or not authenticated:", error);
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Error in callback handling:", err);
        window.location.href = "/login";
      }
    };

    handleCallback();
  }, [isAuthenticated, isLoading, navigate, location.hash]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 border-4 border-t-purple border-gray-200 rounded-full animate-spin"></div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Completing Sign In
          </h2>
          <p className="text-gray-600 text-center">
            Please wait while we complete your authentication...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
