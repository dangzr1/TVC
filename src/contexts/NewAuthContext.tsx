import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  setupAuthListener,
  verifyPin,
  UserLoginData,
  UserProfile,
  UserRegistrationData,
  UserPinVerificationData,
  PasswordResetData,
} from "@/lib/customAuth";
// No need for supabase import with custom auth

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: UserLoginData) => Promise<void>;
  register: (data: UserRegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  verifyUserPin: (data: UserPinVerificationData) => Promise<void>;
  resetUserPassword: (data: PasswordResetData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Function to handle user redirection based on role
  const redirectUserBasedOnRole = (role: string) => {
    console.log(`Redirecting user with role: ${role}`);
    if (role === "vendor") {
      window.location.href = "/vendor-dashboard";
    } else if (role === "client") {
      window.location.href = "/client-dashboard";
    } else {
      // Default fallback
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (currentUser) {
          console.log("Current user found:", currentUser);
          setUser(currentUser);

          // Only redirect if we're not already on a dashboard page
          const currentPath = window.location.pathname;
          if (
            !currentPath.includes("/vendor-dashboard") &&
            !currentPath.includes("/client-dashboard")
          ) {
            // Redirect based on user role
            if (currentUser.role) {
              console.log(
                `Role found: ${currentUser.role}, redirecting to dashboard`,
              );
              redirectUserBasedOnRole(currentUser.role);
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
    const authListener = setupAuthListener((authUser) => {
      if (authUser) {
        console.log("Auth state changed - user logged in:", authUser);
        setUser(authUser);

        // Only redirect if we're not already on a dashboard page
        const currentPath = window.location.pathname;
        if (
          !currentPath.includes("/vendor-dashboard") &&
          !currentPath.includes("/client-dashboard")
        ) {
          // Redirect based on user role
          if (authUser.role) {
            console.log(
              `Role found: ${authUser.role}, redirecting to dashboard`,
            );
            redirectUserBasedOnRole(authUser.role);
          }
        }
      } else {
        console.log("Auth state changed - user logged out");
        setUser(null);
      }
      setIsLoading(false);
    });

    initAuth();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (data: UserLoginData) => {
    setIsLoading(true);
    try {
      const result = await loginUser(data);
      // The auth state listener will update the user state
      // Redirect based on user role
      if (result.user) {
        redirectUserBasedOnRole(result.user.role);
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
      const result = await registerUser(data);
      // After successful registration, redirect to login page
      // Add a small delay to ensure the registration is complete
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return result;
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
      await logoutUser();
      // Clear user state immediately
      setUser(null);
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

  const verifyUserPin = async (data: UserPinVerificationData) => {
    setIsLoading(true);
    try {
      return await verifyPin(data);
    } catch (error) {
      console.error("PIN verification error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetUserPassword = async (data: PasswordResetData) => {
    setIsLoading(true);
    try {
      return await resetPassword(data);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    verifyUserPin,
    resetUserPassword,
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

export { AuthProvider, useAuth };
