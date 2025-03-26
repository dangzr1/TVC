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
  pin?: string;
}

// In-memory user storage for demo purposes
const userStore = new Map();

// Register a new user
export const registerUser = async (data: UserRegistrationData) => {
  const { username, password, pin, role } = data;

  try {
    // Check if username already exists
    const allUsers = JSON.parse(localStorage.getItem("all_users") || "{}");
    if (allUsers[username]) {
      throw new Error(
        "Username already taken. Please choose a different username.",
      );
    }

    // Generate a unique user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Store user data in memory
    const userData = {
      id: userId,
      username,
      password, // In a real app, this would be hashed
      pin,
      role,
      createdAt: new Date().toISOString(),
    };

    userStore.set(username, userData);

    // Store user data in localStorage for persistence
    localStorage.setItem("auth_user_id", userId);
    localStorage.setItem("auth_role", role);
    localStorage.setItem("auth_username", username);
    localStorage.setItem(
      "auth_expires_at",
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    );

    // Also store all users in localStorage for demo persistence
    allUsers[username] = userData;
    localStorage.setItem("all_users", JSON.stringify(allUsers));

    return {
      message: "User registered successfully",
      user_id: userId,
      role: role,
    };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Login a user
export const loginUser = async ({ username, password }: UserLoginData) => {
  try {
    // Load all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem("all_users") || "{}");
    const userData = allUsers[username];

    // Check if user exists and password matches
    if (!userData || userData.password !== password) {
      throw new Error("Invalid username or password");
    }

    // Store user data in localStorage for the session
    localStorage.setItem("auth_user_id", userData.id);
    localStorage.setItem("auth_role", userData.role);
    localStorage.setItem("auth_username", username);
    localStorage.setItem(
      "auth_expires_at",
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    );

    return {
      user: {
        id: userData.id,
        username: userData.username,
        role: userData.role,
        createdAt: userData.createdAt,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Verify PIN (for 2FA or password reset)
export const verifyPin = async ({ username, pin }: UserPinVerificationData) => {
  try {
    // Load all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem("all_users") || "{}");
    const userData = allUsers[username];

    if (!userData) {
      throw new Error("User not found");
    }

    if (userData.pin !== pin) {
      throw new Error("Invalid PIN");
    }

    return {
      message: "PIN verified",
      role: userData.role,
    };
  } catch (error) {
    console.error("PIN verification error:", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async ({
  username,
  pin,
  newPassword,
}: PasswordResetData) => {
  try {
    // Verify PIN format
    if (!/^\d{4}$/.test(pin)) {
      throw new Error("PIN must be exactly 4 digits");
    }

    // Verify password length
    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Load all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem("all_users") || "{}");
    const userData = allUsers[username];

    if (!userData) {
      throw new Error("User not found");
    }

    if (userData.pin !== pin) {
      throw new Error("Invalid PIN");
    }

    // Update password
    userData.password = newPassword;
    allUsers[username] = userData;
    localStorage.setItem("all_users", JSON.stringify(allUsers));

    return {
      message: "Password reset successfully",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

// Logout the current user
export const logoutUser = async () => {
  try {
    // Clear all auth data from localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_expires_at");
    localStorage.removeItem("auth_user_id");
    localStorage.removeItem("auth_role");
    localStorage.removeItem("auth_username");

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear local storage even if the API call fails
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_expires_at");
    localStorage.removeItem("auth_user_id");
    localStorage.removeItem("auth_role");
    localStorage.removeItem("auth_username");
    return { success: true };
  }
};

// Get the current user
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  const userId = localStorage.getItem("auth_user_id");
  const username = localStorage.getItem("auth_username");
  const role = localStorage.getItem("auth_role");
  const expiresAt = localStorage.getItem("auth_expires_at");

  if (!userId || !username || !role || !expiresAt) {
    return null;
  }

  // Check if the session has expired
  if (new Date(expiresAt) < new Date()) {
    // Clear expired session
    await logoutUser();
    return null;
  }

  // Get the user's PIN from localStorage
  const allUsers = JSON.parse(localStorage.getItem("all_users") || "{}");
  const userData = allUsers[username] || {};

  return {
    id: userId,
    username,
    role: role as UserRole,
    createdAt: new Date().toISOString(),
    pin: userData.pin,
  };
};

// Setup auth state change listener
export const setupAuthListener = (
  callback: (user: UserProfile | null) => void,
) => {
  // Initial check
  getCurrentUser().then((user) => callback(user));

  // We don't have real-time updates with this custom auth system,
  // so we'll just return a dummy unsubscribe function
  return {
    subscription: {
      unsubscribe: () => {},
    },
  };
};
