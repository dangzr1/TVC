import { supabase } from "./supabase";

export type UserRole = "client" | "vendor" | "admin";

export interface UserRegistrationData {
  username: string;
  password: string;
  pin: string;
  role: UserRole;
}

export interface UserLoginData {
  username: string;
  password: string;
}

export interface UserPinVerificationData {
  username: string;
  pin: string;
}

export interface PasswordResetData {
  username: string;
  pin: string;
  newPassword: string;
}

export interface UserProfile {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
  user_metadata?: {
    username?: string;
    role?: UserRole;
  };
}

// Register a new user
export const registerUser = async (data: UserRegistrationData) => {
  const { username, password, pin, role } = data;

  try {
    // For development, use direct Supabase auth instead of edge function
    // Create a fake email based on username - ensure it's valid
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, "");
    const email = `${sanitizedUsername}@example.com`;

    // Register with Supabase Auth directly
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (authError) throw authError;

    // Store PIN hash in a separate table (would normally be done by edge function)
    if (authData.user) {
      // For now, we'll skip PIN storage as we don't have a secure way to hash it
      // In production, this would be handled by the edge function
    }

    return {
      message: "User registered successfully",
      user_id: authData.user?.id,
      role: role,
    };
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Registration failed",
    );
  }
};

// Login a user
export const loginUser = async ({ username, password }: UserLoginData) => {
  try {
    // For development, use direct Supabase auth instead of edge function
    // Create a fake email based on username - ensure it's valid
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, "");
    const email = `${sanitizedUsername}@example.com`;

    // Sign in with Supabase Auth directly
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get the role from user metadata
    const role = data.user?.user_metadata?.role || "client";

    return {
      user: {
        role: role,
      },
      session: data.session,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error instanceof Error ? error.message : "Login failed");
  }
};

// Verify PIN (for 2FA or password reset)
export const verifyPin = async ({ username, pin }: UserPinVerificationData) => {
  try {
    // For development, we'll use a simple PIN verification
    // In production, this would verify against a securely stored PIN hash

    // Get the user by username (using the fake email pattern)
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, "");
    const email = `${sanitizedUsername}@example.com`;
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (userError || !userData) {
      throw new Error("Invalid username");
    }

    // For now, we'll accept any 4-digit PIN for the user
    // In a real implementation, we would verify against a stored PIN hash
    if (!/^\d{4}$/.test(pin)) {
      throw new Error("PIN must be exactly 4 digits");
    }

    // Get the user's role
    const { data: authUser } = await supabase.auth.getUser();
    const role = authUser?.user?.user_metadata?.role || "client";

    return {
      message: "PIN verified",
      role: role,
    };
  } catch (error) {
    console.error("PIN verification error:", error);
    throw new Error(
      error instanceof Error ? error.message : "PIN verification failed",
    );
  }
};

// Reset password
export const resetPassword = async ({
  username,
  pin,
  newPassword,
}: PasswordResetData) => {
  try {
    // For development, we'll implement a simple password reset
    // In production, this would verify the PIN against a stored hash

    // Verify PIN format
    if (!/^\d{4}$/.test(pin)) {
      throw new Error("PIN must be exactly 4 digits");
    }

    // Verify password length
    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Get the user by username (using the fake email pattern)
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, "");
    const email = `${sanitizedUsername}@example.com`;

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw updateError;
    }

    return {
      message: "Password reset successfully",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Password reset failed",
    );
  }
};

// Logout the current user
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;

  return { success: true };
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

// Setup auth state change listener
export const setupAuthListener = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
};
