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
  UserLoginData,
  UserProfile,
  UserRegistrationData,
  verifyEmail,
} from "@/lib/auth";

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          // Transform the user data to match our UserProfile interface
          const userProfile: UserProfile = {
            id: currentUser.id,
            email: currentUser.email || "",
            firstName: currentUser.user_metadata?.first_name || "",
            lastName: currentUser.user_metadata?.last_name || "",
            role: currentUser.user_metadata?.role || "client",
            companyName: currentUser.user_metadata?.company_name,
            isVerified: currentUser.email_confirmed_at !== null,
            createdAt: currentUser.created_at,
          };
          setUser(userProfile);

          // Check if user is admin
          setIsAdmin(currentUser.user_metadata?.role === "admin");
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
        // Transform the user data to match our UserProfile interface
        const userProfile: UserProfile = {
          id: authUser.id,
          email: authUser.email || "",
          firstName: authUser.user_metadata?.first_name || "",
          lastName: authUser.user_metadata?.last_name || "",
          role: authUser.user_metadata?.role || "client",
          companyName: authUser.user_metadata?.company_name,
          isVerified: authUser.email_confirmed_at !== null,
          createdAt: authUser.created_at,
        };
        setUser(userProfile);

        // Check if user is admin
        setIsAdmin(authUser.user_metadata?.role === "admin");
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    initAuth();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (data: UserLoginData) => {
    setIsLoading(true);
    try {
      await loginUser(data);
      // The auth state listener will update the user state
      // Redirect based on user role
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const role = currentUser.user_metadata?.role || "client";
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate(`/dashboard/${role}`);
        }
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
      await logoutUser();
      // The auth state listener will update the user state
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyUserEmail = async (token: string) => {
    setIsLoading(true);
    try {
      await verifyEmail(token);
      // After verification, redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async (email: string) => {
    setIsLoading(true);
    try {
      await resendVerificationEmail(email);
    } catch (error) {
      console.error("Resend verification error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await loginWithProvider("google");
      // The redirect will happen automatically
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithApple = async () => {
    setIsLoading(true);
    try {
      await loginWithProvider("apple");
      // The redirect will happen automatically
    } catch (error) {
      console.error("Apple login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
