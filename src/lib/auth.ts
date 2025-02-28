import { supabase } from "./supabase";

export type UserRole = "client" | "vendor";

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

  return authData;
};

// Login a user
export const loginUser = async ({ email, password }: UserLoginData) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
};

// Login with OAuth providers
export const loginWithProvider = async (provider: "google" | "apple") => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/dashboard/client`,
    },
  });

  if (error) throw error;

  return data;
};

// Logout the current user
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Get the current user
export const getCurrentUser = async () => {
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
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
};
