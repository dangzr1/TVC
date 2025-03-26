import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  loginUser,
  loginWithProvider,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  setupAuthListener,
  updateUserMetadata,
  UserLoginData,
  UserProfile,
  UserRegistrationData,
  verifyEmail,
} from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: UserLoginData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  register: (data: UserRegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  verifyUserEmail: (token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export all components and hooks at the end of the file

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  // Function to handle user redirection based on role
  const redirectUserBasedOnRole = (role: string) => {
    console.log(`Redirecting user with role: ${role}`);
    if (role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = `/dashboard/${role}`;
    }
  };

  // Function to update user metadata with role
  const updateUserRole = async (
    userId: string,
    role: string,
    email?: string,
  ) => {
    try {
      console.log(`Updating user ${userId} with role: ${role}`);
      // Check if this is the admin email
      if (email === "dangzr1@gmail.com") {
        console.log("Setting admin role for dangzr1@gmail.com");
        await updateUserMetadata(userId, { role: "admin" });
        return true;
      }
      await updateUserMetadata(userId, { role });
      return true;
    } catch (error) {
      console.error("Error updating user role:", error);
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for session first to ensure we have the latest auth state
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUser =
          sessionData.session?.user || (await getCurrentUser());

        if (currentUser) {
          console.log("Current user found:", currentUser);

          // Ensure user exists in the users table for persistence
          if (currentUser.email) {
            const { error: userUpsertError } = await supabase
              .from("users")
              .upsert(
                {
                  id: currentUser.id,
                  email: currentUser.email,
                  role: currentUser.user_metadata?.role || null,
                  last_sign_in: new Date().toISOString(),
                },
                { onConflict: "id" },
              );

            if (userUpsertError) {
              console.error("Error updating user record:", userUpsertError);
            }
          }

          // Transform the user data to match our UserProfile interface
          const userProfile: UserProfile = {
            id: currentUser.id,
            email: currentUser.email || "",
            firstName: currentUser.user_metadata?.first_name || "",
            lastName: currentUser.user_metadata?.last_name || "",
            role: currentUser.user_metadata?.role || "client",
            companyName: currentUser.user_metadata?.company_name,
            isVerified: true, // Google auth users are always verified
            createdAt: currentUser.created_at,
          };
          setUser(userProfile);

          // Check if user is admin
          setIsAdmin(currentUser.user_metadata?.role === "admin");

          // Only redirect if we're not already on a dashboard page
          const currentPath = window.location.pathname;
          if (
            !currentPath.includes("/dashboard") &&
            !currentPath.includes("/admin") &&
            !currentPath.includes("/role-selection")
          ) {
            // Check if user has a role
            if (!currentUser.user_metadata?.role) {
              // Get the selected account type from localStorage
              const selectedType =
                localStorage.getItem("selectedAccountType") || "client";
              console.log(
                `No role found, using selected type: ${selectedType}`,
              );

              // Update user metadata with the selected role
              const updated = await updateUserRole(
                currentUser.id,
                selectedType,
                currentUser.email,
              );
              if (updated) {
                // Redirect based on the newly set role
                redirectUserBasedOnRole(selectedType);
              } else {
                // Fallback to role selection if update fails
                window.location.href = "/role-selection";
              }
            } else {
              // Redirect based on user role
              const role = currentUser.user_metadata?.role;
              console.log(`Role found: ${role}, redirecting to dashboard`);
              redirectUserBasedOnRole(role);
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: authListener } = setupAuthListener((authUser) => {
      if (authUser) {
        console.log("Auth state changed - user logged in:", authUser);
        // Transform the user data to match our UserProfile interface
        const userProfile: UserProfile = {
          id: authUser.id,
          email: authUser.email || "",
          firstName: authUser.user_metadata?.first_name || "",
          lastName: authUser.user_metadata?.last_name || "",
          role: authUser.user_metadata?.role || "client",
          companyName: authUser.user_metadata?.company_name,
          isVerified: true, // Google auth users are always verified
          createdAt: authUser.created_at,
        };
        setUser(userProfile);

        // Check if user is admin
        setIsAdmin(authUser.user_metadata?.role === "admin");

        // Only redirect if we're not already on a dashboard page
        const currentPath = window.location.pathname;
        if (
          !currentPath.includes("/dashboard") &&
          !currentPath.includes("/admin") &&
          !currentPath.includes("/role-selection")
        ) {
          // Check if user has a role
          if (!authUser.user_metadata?.role) {
            // Get the selected account type from localStorage
            const selectedType =
              localStorage.getItem("selectedAccountType") || "client";
            console.log(
              `No role found in auth listener, using selected type: ${selectedType}`,
            );

            // Update user metadata with the selected role
            updateUserRole(authUser.id, selectedType, authUser.email).then(
              (updated) => {
                if (updated) {
                  // Redirect based on the newly set role
                  redirectUserBasedOnRole(selectedType);
                } else {
                  // Fallback to role selection if update fails
                  window.location.href = "/role-selection";
                }
              },
            );
          } else {
            // Redirect based on user role
            const role = authUser.user_metadata?.role;
            console.log(
              `Role found in auth listener: ${role}, redirecting to dashboard`,
            );
            redirectUserBasedOnRole(role);
          }
        }
      } else {
        console.log("Auth state changed - user logged out");
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    // Handle OAuth callback
    const handleOAuthCallback = async () => {
      // Check if this is a callback from OAuth provider
      const { data, error } = await supabase.auth.getSession();

      // Check if we're on the auth callback route or a dashboard route with hash
      const isAuthCallback = window.location.pathname === "/auth/callback";
      const isDashboardUrl = window.location.pathname.includes("/dashboard/");
      const hasHash = window.location.hash && window.location.hash.length > 0;

      // Check if we have an access token in the URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token") || "";

      // If we're on a dashboard URL with a hash token, redirect to auth callback
      if (isDashboardUrl && accessToken) {
        console.log(
          "Detected dashboard URL with access token, redirecting to auth callback",
        );
        window.location.href = `/auth/callback${window.location.hash}`;
        return;
      }

      // If we have an access token in the URL hash, use it to set the session
      if (accessToken && (!data.session || isAuthCallback)) {
        console.log("Access token found in URL hash, setting session");
        try {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

          if (sessionError) {
            console.error(
              "Error setting session from hash token:",
              sessionError,
            );
          } else if (sessionData.session) {
            console.log("Session set successfully from hash token");
            // Continue with the updated session data
            data.session = sessionData.session;

            // Store session info in localStorage as backup
            localStorage.setItem(
              "supabase.auth.token",
              JSON.stringify({
                access_token: accessToken,
                refresh_token: refreshToken,
              }),
            );
          }
        } catch (err) {
          console.error("Error setting session from hash token:", err);
        }
      }

      if (data.session) {
        console.log("Session detected on page load", data.session);

        // Check if this is a new user (no role set yet)
        const currentUser = data.session.user;
        if (currentUser) {
          console.log("Current user metadata:", currentUser.user_metadata);

          // Check if user has a role already set
          const existingRole = currentUser.user_metadata?.role;

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
            redirectUserBasedOnRole(existingRole);
          } else {
            // Get the selected account type from localStorage
            const selectedType =
              localStorage.getItem("selectedAccountType") || "client";
            console.log(
              `New user detected, using selected type: ${selectedType}`,
            );

            // Update user metadata with the selected role
            updateUserRole(
              currentUser.id,
              selectedType,
              currentUser.email,
            ).then((updated) => {
              if (updated) {
                // Redirect based on the newly set role
                redirectUserBasedOnRole(selectedType);
              } else {
                // Fallback to role selection if update fails
                window.location.href = "/role-selection";
              }
            });
          }
        }
      } else if (error) {
        console.error("Error getting session:", error);
        // If we're on the auth callback route but have no session, redirect to login
        if (isAuthCallback) {
          window.location.href = "/login";
        }
      }
    };

    handleOAuthCallback();
    initAuth();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (data: UserLoginData) => {
    setIsLoading(true);
    try {
      await loginUser(data);
      // The auth state listener will update the user state
      // Redirect based on user role
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const role = currentUser.user_metadata?.role || "client";
        redirectUserBasedOnRole(role);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: UserRegistrationData) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      // After registration, redirect to verification page
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Clear any stored auth data in localStorage
      localStorage.removeItem("pendingOAuthRole");
      localStorage.removeItem("selectedAccountType");
      localStorage.removeItem("dummyUser");

      // Force clear session from Supabase
      await supabase.auth.signOut({ scope: "global" });

      // Clear user state immediately
      setUser(null);
      setIsAdmin(false);

      // Hard redirect to login page to ensure complete session reset
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, force redirect to login
      window.location.href = "/login";
    } finally {
      setIsLoading(false);
    }
  };

  // For Google auth, we don't need email verification as Google accounts are already verified
  const verifyUserEmail = async (token: string) => {
    // This is a no-op for Google auth, but we keep it for API compatibility
    navigate("/login");
  };

  const resendVerification = async (email: string) => {
    // This is a no-op for Google auth, but we keep it for API compatibility
    console.log("Email verification not needed for Google auth");
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      console.log("Starting Google login process");
      // Store the selected account type before redirecting
      const selectedType =
        localStorage.getItem("selectedAccountType") || "client";
      console.log(`Storing selected account type: ${selectedType}`);

      // Initiate the OAuth flow
      const { data, error } = await loginWithProvider("google");
      if (error) throw error;

      console.log("Google login initiated, waiting for redirect");

      // The OAuth flow will handle the redirect
    } catch (error) {
      console.error("Google login error:", error);
      setIsLoading(false); // Only set loading to false on error
      throw error;
    }
    // Don't set isLoading to false here as the page will redirect
  };

  const loginWithApple = async () => {
    setIsLoading(true);
    try {
      console.log("Starting Apple login process");
      await loginWithProvider("apple");
      // The redirect will happen automatically
    } catch (error) {
      console.error("Apple login error:", error);
      setIsLoading(false); // Only set loading to false on error
      throw error;
    }
    // Don't set isLoading to false here as the page will redirect
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    login,
    loginWithGoogle,
    loginWithApple,
    register,
    logout,
    verifyUserEmail,
    resendVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export all components and hooks consistently
export { AuthProvider, useAuth };
