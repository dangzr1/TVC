import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { path, body } = await req.json();

    // Handle different API endpoints
    if (path === "/register") {
      return await handleRegister(supabase, body, corsHeaders);
    } else if (path === "/login") {
      return await handleLogin(supabase, body, corsHeaders);
    } else if (path === "/verify-pin") {
      return await handleVerifyPin(supabase, body, corsHeaders);
    } else if (path === "/reset-password") {
      return await handleResetPassword(supabase, body, corsHeaders);
    } else if (path === "/logout") {
      return await handleLogout(supabase, body, corsHeaders);
    }

    return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleRegister(supabase, body, corsHeaders) {
  const { username, password, pin, role } = body;

  // Validate inputs
  if (!username || !password || !pin || !role) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Validate username format (3-12 alphanumeric characters)
  if (!/^[a-zA-Z0-9]{3,12}$/.test(username)) {
    return new Response(
      JSON.stringify({
        error: "Username must be 3-12 alphanumeric characters",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Validate password (min 6 chars)
  if (password.length < 6) {
    return new Response(
      JSON.stringify({
        error: "Password must be at least 6 characters",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Validate PIN (exactly 4 digits)
  if (!/^\d{4}$/.test(pin)) {
    return new Response(
      JSON.stringify({ error: "PIN must be exactly 4 digits" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Validate role (must be 'vendor' or 'client')
  if (role.toLowerCase() !== "vendor" && role.toLowerCase() !== "client") {
    return new Response(
      JSON.stringify({ error: 'Role must be "vendor" or "client"' }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Check if username already exists
  const { data: existingUser, error: checkError } = await supabase
    .from("auth_custom.users")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking existing user:", checkError);
    return new Response(
      JSON.stringify({ error: "Error checking username availability" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  if (existingUser) {
    return new Response(JSON.stringify({ error: "Username already taken" }), {
      status: 409, // Conflict
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Hash the password and PIN
  const passwordHash = await bcrypt.hash(password);
  const pinHash = await bcrypt.hash(pin);
  const userId = uuidv4();

  // Create user in auth_custom.users table
  const { error: createError } = await supabase
    .from("auth_custom.users")
    .insert({
      id: userId,
      username,
      password_hash: passwordHash,
      pin_hash: pinHash,
      role: role.toLowerCase(),
      created_at: new Date().toISOString(),
    });

  if (createError) {
    console.error("Error creating user:", createError);
    return new Response(JSON.stringify({ error: "Error creating user" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Create user in public.users_custom table
  const { error: publicUserError } = await supabase
    .from("users_custom")
    .insert({
      id: userId,
      username,
      role: role.toLowerCase(),
      created_at: new Date().toISOString(),
    });

  if (publicUserError) {
    console.error("Error creating public user record:", publicUserError);
    // Try to delete the auth user since we couldn't complete registration
    await supabase.from("auth_custom.users").delete().eq("id", userId);
    return new Response(
      JSON.stringify({ error: "Error creating user record" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Create a session token
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  const { error: sessionError } = await supabase
    .from("auth_custom.sessions")
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
    });

  if (sessionError) {
    console.error("Error creating session:", sessionError);
    return new Response(JSON.stringify({ error: "Error creating session" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      message: "User registered successfully",
      user_id: userId,
      role: role.toLowerCase(),
      token,
      expires_at: expiresAt.toISOString(),
    }),
    {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}

async function handleLogin(supabase, body, corsHeaders) {
  const { username, password } = body;

  // Validate inputs
  if (!username || !password) {
    return new Response(
      JSON.stringify({ error: "Missing username or password" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Find user by username
  const { data: userData, error: userError } = await supabase
    .from("auth_custom.users")
    .select("id, username, password_hash, role")
    .eq("username", username)
    .maybeSingle();

  if (userError || !userData) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Verify password
  const passwordMatches = await bcrypt.compare(
    password,
    userData.password_hash,
  );
  if (!passwordMatches) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Create a session token
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  const { error: sessionError } = await supabase
    .from("auth_custom.sessions")
    .insert({
      user_id: userData.id,
      token,
      expires_at: expiresAt.toISOString(),
    });

  if (sessionError) {
    console.error("Error creating session:", sessionError);
    return new Response(JSON.stringify({ error: "Error creating session" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Update last login time
  await supabase
    .from("auth_custom.users")
    .update({ last_login: new Date().toISOString() })
    .eq("id", userData.id);

  await supabase
    .from("users_custom")
    .update({ last_sign_in: new Date().toISOString() })
    .eq("id", userData.id);

  return new Response(
    JSON.stringify({
      message: "Login successful",
      user_id: userData.id,
      username: userData.username,
      role: userData.role,
      token,
      expires_at: expiresAt.toISOString(),
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}

async function handleVerifyPin(supabase, body, corsHeaders) {
  const { username, pin } = body;

  // Validate inputs
  if (!username || !pin) {
    return new Response(JSON.stringify({ error: "Missing username or PIN" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Find user by username
  const { data: userData, error: userError } = await supabase
    .from("auth_custom.users")
    .select("id, pin_hash, role")
    .eq("username", username)
    .maybeSingle();

  if (userError || !userData) {
    return new Response(JSON.stringify({ error: "Invalid username" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Verify PIN
  const pinMatches = await bcrypt.compare(pin, userData.pin_hash);
  if (!pinMatches) {
    return new Response(JSON.stringify({ error: "Invalid PIN" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      message: "PIN verified",
      role: userData.role,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}

async function handleResetPassword(supabase, body, corsHeaders) {
  const { username, pin, newPassword } = body;

  // Validate inputs
  if (!username || !pin || !newPassword) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Validate new password
  if (newPassword.length < 6) {
    return new Response(
      JSON.stringify({
        error: "Password must be at least 6 characters",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Find user by username
  const { data: userData, error: userError } = await supabase
    .from("auth_custom.users")
    .select("id, pin_hash")
    .eq("username", username)
    .maybeSingle();

  if (userError || !userData) {
    return new Response(JSON.stringify({ error: "Invalid username" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Verify PIN
  const pinMatches = await bcrypt.compare(pin, userData.pin_hash);
  if (!pinMatches) {
    return new Response(JSON.stringify({ error: "Invalid PIN" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Hash the new password
  const passwordHash = await bcrypt.hash(newPassword);

  // Update password
  const { error: updateError } = await supabase
    .from("auth_custom.users")
    .update({ password_hash: passwordHash })
    .eq("id", userData.id);

  if (updateError) {
    console.error("Error updating password:", updateError);
    return new Response(JSON.stringify({ error: "Error updating password" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      message: "Password reset successfully",
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}

async function handleLogout(supabase, body, corsHeaders) {
  const { token } = body;

  if (!token) {
    return new Response(JSON.stringify({ error: "Missing token" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Delete the session
  const { error } = await supabase
    .from("auth_custom.sessions")
    .delete()
    .eq("token", token);

  if (error) {
    console.error("Error logging out:", error);
    return new Response(JSON.stringify({ error: "Error logging out" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      message: "Logged out successfully",
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}
