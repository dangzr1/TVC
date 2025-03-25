import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Briefcase, User } from "lucide-react";

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // Not authenticated, redirect to login
        console.log("No session found in role selection, redirecting to login");
        window.location.href = "/login";
        return;
      }

      // If user already has a role, redirect to their dashboard
      if (data.session.user.user_metadata?.role) {
        const role = data.session.user.user_metadata.role;
        console.log(`User already has role: ${role}, redirecting to dashboard`);
        window.location.href = `/dashboard/${role}`;
      }
    };
    checkAuth();
  }, [navigate]);

  const selectRole = async (role: "client" | "vendor") => {
    setIsLoading(true);
    setError(null);
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not found");
      }

      // Update user metadata with selected role
      const { data, error } = await supabase.auth.updateUser({
        data: { role },
      });

      if (error) {
        throw error;
      }

      console.log(`Role selected: ${role}`);

      // Store user in the public.users table to ensure persistence
      const { error: userInsertError } = await supabase.from("users").upsert(
        {
          id: userData.user.id,
          email: userData.user.email,
          role: role,
          created_at: new Date().toISOString(),
          last_sign_in: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

      if (userInsertError) {
        console.error("Error storing user data:", userInsertError);
        // Continue anyway as the auth metadata is updated
      }

      // Store role in localStorage as backup
      localStorage.setItem("userRole", role);

      // Redirect to appropriate dashboard
      console.log(`Role selected: ${role}, redirecting to dashboard`);
      window.location.href = `/dashboard/${role}`;
    } catch (err: any) {
      console.error("Error setting role:", err);
      setError(err.message || "Failed to set role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-gray p-4">
      <header>
        <title>Select Your Role - TheVendorsConnect</title>
        <meta
          name="description"
          content="Select your role as a client or vendor on TheVendorsConnect platform."
        />
      </header>

      <Card className="w-full max-w-md bg-white shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Select Your Role</CardTitle>
          <p className="text-gray-600 mt-2">
            Choose how you want to use TheVendorsConnect
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button
              onClick={() => selectRole("client")}
              className="h-32 flex flex-col items-center justify-center gap-2 bg-purple hover:bg-purple/90"
              disabled={isLoading}
            >
              <User className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Client</span>
              <span className="text-xs text-center">
                Post jobs & hire vendors
              </span>
            </Button>

            <Button
              onClick={() => selectRole("vendor")}
              className="h-32 flex flex-col items-center justify-center gap-2 bg-purple hover:bg-purple/90"
              disabled={isLoading}
            >
              <Briefcase className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Vendor</span>
              <span className="text-xs text-center">
                Offer services & find jobs
              </span>
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-6 text-center">
            You'll only need to select your role once. This choice will be saved
            for future logins.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelectionPage;
