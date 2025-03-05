import { supabase } from "./supabase";
import { dummyAccounts } from "./dummyAccounts";

export type UserRole = "client" | "vendor" | "admin";

export interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  accountType: UserRole;
  companyName?: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyName?: string;
  isVerified: boolean;
  createdAt: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    role?: UserRole;
    company_name?: string;
  };
}

// Register a new user
export const registerUser = async (data: UserRegistrationData) => {
  const { email, password, firstName, lastName, accountType, companyName } =
    data;

  // Register the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role: accountType,
        company_name: companyName || null,
      },
      emailRedirectTo: `${window.location.origin}/verify-email`,
    },
  });

  if (authError) throw authError;

  // Don't auto-login, just return the data
  return authData;
};

// Login a user
export const loginUser = async ({ email, password }: UserLoginData) => {
  // Check if this is a dummy account login
  if (
    (email === dummyAccounts.vendor.email &&
      password === dummyAccounts.vendor.password) ||
    (email === dummyAccounts.client.email &&
      password === dummyAccounts.client.password) ||
    (email === dummyAccounts.admin.email &&
      password === dummyAccounts.admin.password)
  ) {
    // Determine which dummy account is being used
    let dummyUser;
    if (email === dummyAccounts.vendor.email) {
      dummyUser = dummyAccounts.vendor;
    } else if (email === dummyAccounts.client.email) {
      dummyUser = dummyAccounts.client;
    } else {
      dummyUser = dummyAccounts.admin;
    }

    // Create a mock user session
    const mockUser = {
      id: `dummy-${dummyUser.role}-id`,
      email: dummyUser.email,
      user_metadata: {
        first_name: dummyUser.firstName,
        last_name: dummyUser.lastName,
        role: dummyUser.role,
        company_name: dummyUser.companyName || null,
      },
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    // Store the mock user in localStorage to persist the session
    localStorage.setItem("dummyUser", JSON.stringify(mockUser));

    // Return a mock session object
    return {
      user: mockUser,
      session: {
        access_token: "dummy-access-token",
        refresh_token: "dummy-refresh-token",
        expires_at: Date.now() + 3600 * 1000, // 1 hour from now
      },
    };
  }

  // If not a dummy account, proceed with normal Supabase auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
};

// Login with OAuth providers
export const loginWithProvider = async (provider: "google" | "apple") => {
  // For demo purposes, simulate a successful Google login with a dummy account
  if (provider === "google") {
    // Create a mock vendor user
    const mockUser = {
      id: `dummy-vendor-google-id`,
      email: "google-user@example.com",
      user_metadata: {
        first_name: "Google",
        last_name: "User",
        role: "vendor",
        company_name: "Google Photography",
      },
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    // Store the mock user in localStorage to persist the session
    localStorage.setItem("dummyUser", JSON.stringify(mockUser));

    // Redirect to dashboard
    window.location.href = "/dashboard/vendor";

    return { provider, url: "/dashboard/vendor" };
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/verify-email`,
      },
    });

    if (error) {
      console.error(`Error signing in with ${provider}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error in loginWithProvider (${provider}):`, error);
    throw new Error(
      `Google authentication is not enabled in your Supabase project. Please use email/password registration instead.`,
    );
  }
};

// Logout the current user
export const logoutUser = async () => {
  // Check if we have a dummy user to log out
  if (localStorage.getItem("dummyUser")) {
    localStorage.removeItem("dummyUser");
    window.location.href = "/login";
    return;
  }

  // Otherwise, sign out from Supabase
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Get the current user
export const getCurrentUser = async () => {
  // Check if we have a dummy user in localStorage
  const dummyUserJson = localStorage.getItem("dummyUser");
  if (dummyUserJson) {
    return JSON.parse(dummyUserJson);
  }

  // Otherwise, get the real user from Supabase
  const { data } = await supabase.auth.getUser();
  return data.user;
};

// Get the current user's session
export const getCurrentSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

// Verify email with token
export const verifyEmail = async (token: string) => {
  // In a real implementation, you would verify the token with your backend
  // For now, we'll just return a success response
  return { success: true };
};

// Resend verification email
export const resendVerificationEmail = async (email: string) => {
  // In Supabase, we can use the resetPasswordForEmail function to send a password reset email
  // which can be used as a verification email in this case
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/verify-email`,
  });

  if (error) throw error;

  return data;
};

// Setup auth state change listener
export const setupAuthListener = (callback: (user: any) => void) => {
  // Check for dummy user first
  const dummyUserJson = localStorage.getItem("dummyUser");
  if (dummyUserJson) {
    const dummyUser = JSON.parse(dummyUserJson);
    setTimeout(() => callback(dummyUser), 0);
  }

  // Set up the real listener for Supabase auth changes
  return supabase.auth.onAuthStateChange((event, session) => {
    // If we have a dummy user and the event is SIGNED_OUT, remove the dummy user
    if (event === "SIGNED_OUT" && localStorage.getItem("dummyUser")) {
      localStorage.removeItem("dummyUser");
    }

    // Check for dummy user again (in case it was just added)
    const updatedDummyUserJson = localStorage.getItem("dummyUser");
    if (updatedDummyUserJson) {
      callback(JSON.parse(updatedDummyUserJson));
    } else {
      callback(session?.user || null);
    }
  });
};
