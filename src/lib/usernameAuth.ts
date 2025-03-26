import { supabase } from "./supabase";

export interface UsernameAuthResponse {
  user: any;
  session: any;
  error?: string;
}

export async function loginWithUsername(
  username: string,
  password: string,
): Promise<UsernameAuthResponse> {
  try {
    // First try to find if this is the admin account
    if (username === "walkaway" && password === "Dn249118++") {
      // Check if admin user already exists in Supabase
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", "walkaway@example.com")
        .maybeSingle();

      if (!existingUser) {
        // Create a real admin user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: "walkaway@example.com",
            password: "Dn249118++",
            options: {
              data: {
                first_name: "Admin",
                last_name: "User",
                role: "admin",
                username: "walkaway",
              },
            },
          },
        );

        if (authError) {
          console.error("Error creating admin user:", authError);
          return { user: null, session: null, error: authError.message };
        }

        // Create the user record in the users table
        if (authData.user) {
          const { error: userError } = await supabase.from("users").insert({
            id: authData.user.id,
            email: "walkaway@example.com",
            role: "admin",
            first_name: "Admin",
            last_name: "User",
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
        email: "walkaway@example.com",
        password: "Dn249118++",
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      return { user: data.user, session: data.session };
    }

    // If not the special admin account, try regular email login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username.includes("@") ? username : `${username}@example.com`,
      password,
    });

    if (error) {
      return { user: null, session: null, error: error.message };
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    return { user: null, session: null, error: error.message };
  }
}
