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

  // Check if email already exists
  const { data: existingUsers, error: searchError } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (searchError) {
    console.error("Error checking for existing user:", searchError);
  }

  // If email exists, throw an error
  if (existingUsers) {
    throw new Error(
      "Email already in use. Please use a different email address.",
    );
  }

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

  // Create or update the user record in the users table
  if (authData.user) {
    const { error: userError } = await supabase.from("users").upsert({
      id: authData.user.id,
      email: email,
      role: accountType,
      first_name: firstName,
      last_name: lastName,
      company_name: companyName || null,
      created_at: new Date().toISOString(),
      last_sign_in: new Date().toISOString(),
    });

    if (userError) {
      console.error("Error creating user record:", userError);
    }
  }

  // Don't auto-login, just return the data
  return authData;
};

// Login a user
export const loginUser = async ({ email, password }: UserLoginData) => {
  // Check if this is the admin account login
  if (
    email === dummyAccounts.admin.email &&
    password === dummyAccounts.admin.password
  ) {
    // Check if admin user already exists in Supabase
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", dummyAccounts.admin.email)
      .maybeSingle();

    if (!existingUser) {
      // Create a real admin user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: dummyAccounts.admin.email,
        password: dummyAccounts.admin.password,
        options: {
          data: {
            first_name: dummyAccounts.admin.firstName,
            last_name: dummyAccounts.admin.lastName,
            role: dummyAccounts.admin.role,
            company_name: null,
          },
        },
      });

      if (authError) {
        console.error("Error creating admin user:", authError);
        throw authError;
      }

      // Create the user record in the users table
      if (authData.user) {
        const { error: userError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: dummyAccounts.admin.email,
          role: dummyAccounts.admin.role,
          first_name: dummyAccounts.admin.firstName,
          last_name: dummyAccounts.admin.lastName,
          created_at: new Date().toISOString(),
          last_sign_in: new Date().toISOString(),
        });

        if (userError) {
          console.error("Error creating admin user record:", userError);
        }
      }
    }

    // Now sign in with the admin credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dummyAccounts.admin.email,
      password: dummyAccounts.admin.password,
    });

    if (error) throw error;

    return { user: data.user, session: data.session };
  }

  // If not a dummy account, proceed with normal Supabase auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Update the user's last sign-in time
  if (data.user) {
    const { error: updateError } = await supabase.from("users").upsert(
      {
        id: data.user.id,
        email: data.user.email || email,
        role: data.user.user_metadata?.role || null,
        first_name: data.user.user_metadata?.first_name || null,
        last_name: data.user.user_metadata?.last_name || null,
        company_name: data.user.user_metadata?.company_name || null,
        last_sign_in: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (updateError) {
      console.error("Error updating user's last sign-in time:", updateError);
    }
  }

  return data;
};

// Login with OAuth providers
export const loginWithProvider = async (provider: "google" | "apple") => {
  try {
    // Get the current URL's origin (development or production)
    const currentOrigin = window.location.origin;
    console.log(`Current origin: ${currentOrigin}`);

    // Store the selected account type in localStorage before redirecting
    const selectedType =
      localStorage.getItem("selectedAccountType") || "client";
    console.log(`Storing selected account type before OAuth: ${selectedType}`);
    localStorage.setItem("pendingOAuthRole", selectedType);

    // For Google, we need to specify the correct redirectTo URL and scopes
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // Explicitly set redirectTo to our application URL
        redirectTo: `${currentOrigin}/auth/callback`,
        queryParams:
          provider === "google"
            ? {
                access_type: "offline",
                prompt: "consent",
              }
            : undefined,
        scopes: provider === "google" ? "email profile" : undefined,
      },
    });

    if (error) {
      console.error(`Error signing in with ${provider}:`, error);
      throw error;
    }

    console.log(
      `Successfully initiated ${provider} login, waiting for redirect`,
    );
    return data;
  } catch (error) {
    console.error(`Error in loginWithProvider (${provider}):`, error);
    throw new Error(
      `Authentication with ${provider} failed. Please try email/password login instead.`,
    );
  }
};

// Logout the current user
export const logoutUser = async () => {
  // Remove any dummy user data if it exists (for backward compatibility)
  if (localStorage.getItem("dummyUser")) {
    localStorage.removeItem("dummyUser");
  }

  // Otherwise, sign out from Supabase
  const { error } = await supabase.auth.signOut();
  if (error) throw error;

  // Always return success object for consistent handling
  return { success: true };
};

// Get the current user
export const getCurrentUser = async () => {
  // Check if we have a dummy user in localStorage (for backward compatibility)
  const dummyUserJson = localStorage.getItem("dummyUser");
  if (dummyUserJson) {
    localStorage.removeItem("dummyUser"); // Remove it as we're transitioning to real users
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
  // Check for dummy user (for backward compatibility)
  const dummyUserJson = localStorage.getItem("dummyUser");
  if (dummyUserJson) {
    localStorage.removeItem("dummyUser"); // Remove it as we're transitioning to real users
  }

  // Set up the real listener for Supabase auth changes
  return supabase.auth.onAuthStateChange((event, session) => {
    // If there's any dummy user data, remove it (for backward compatibility)
    if (localStorage.getItem("dummyUser")) {
      localStorage.removeItem("dummyUser");
    }

    // Always use the real session
    callback(session?.user || null);
  });
};

// Update user metadata
export const updateUserMetadata = async (metadata: Record<string, any>) => {
  const { data, error } = await supabase.auth.updateUser({
    data: metadata,
  });

  if (error) {
    throw error;
  }

  // Also update the users table
  if (data.user) {
    const { error: updateError } = await supabase.from("users").upsert(
      {
        id: data.user.id,
        ...metadata,
        last_sign_in: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (updateError) {
      console.error(
        "Error updating user metadata in users table:",
        updateError,
      );
    }
  }

  return data;
};

// Update user role to admin
export const updateUserToAdmin = async (email: string) => {
  try {
    // First, get the user by email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("email", email)
      .single();

    if (userError) {
      console.error("Error finding user:", userError);
      throw new Error(`User with email ${email} not found`);
    }

    if (!userData) {
      throw new Error(`User with email ${email} not found`);
    }

    // Update the user's role in auth metadata
    const { data: authData, error: authError } =
      await supabase.auth.admin.updateUserById(userData.id, {
        user_metadata: { role: "admin" },
      });

    if (authError) {
      console.error("Error updating user auth metadata:", authError);
      throw authError;
    }

    // Update the user's role in the users table
    const { error: updateError } = await supabase
      .from("users")
      .update({ role: "admin" })
      .eq("id", userData.id);

    if (updateError) {
      console.error("Error updating user role in users table:", updateError);
      throw updateError;
    }

    return {
      success: true,
      message: `User ${email} has been upgraded to admin`,
    };
  } catch (error) {
    console.error("Error in updateUserToAdmin:", error);
    throw error;
  }
};
