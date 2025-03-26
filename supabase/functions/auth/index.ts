import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

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

  // Validate username format (3-50 alphanumeric characters)
  if (!/^[a-zA-Z0-9]{3,50}$/.test(username)) {
    return new Response(
      JSON.stringify({
        error: "Username must be 3-50 alphanumeric characters",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Validate password (min 8 chars, at least 1 letter and 1 number)
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
    return new Response(
      JSON.stringify({
        error:
          "Password must be at least 8 characters with at least 1 letter and 1 number",
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
    .from("user_credentials")
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

  // Hash the PIN
  const pinHash = await bcrypt.hash(pin);

  // Create user with Supabase Auth
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: `${username}@example.com`, // Generate a fake email since Supabase requires one
      password,
      user_metadata: {
        username,
        role: role.toLowerCase(),
      },
      email_confirm: true,
    });

  if (authError) {
    console.error("Error creating user:", authError);
    return new Response(JSON.stringify({ error: "Error creating user" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Store user credentials in the user_credentials table
  const { error: credentialsError } = await supabase
    .from("user_credentials")
    .insert({
      id: authData.user.id,
      username,
      pin_hash: pinHash,
    });

  if (credentialsError) {
    console.error("Error storing user credentials:", credentialsError);
    // Try to delete the auth user since we couldn't complete registration
    await supabase.auth.admin.deleteUser(authData.user.id);
    return new Response(
      JSON.stringify({ error: "Error storing user credentials" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Store user in the users table
  const { error: userError } = await supabase.from("users").insert({
    id: authData.user.id,
    username,
    role: role.toLowerCase(),
    created_at: new Date().toISOString(),
    last_sign_in: new Date().toISOString(),
  });

  if (userError) {
    console.error("Error storing user data:", userError);
    // Continue anyway as the auth user and credentials were created successfully
  }

  return new Response(
    JSON.stringify({
      message: "User registered successfully",
      user_id: authData.user.id,
      role: role.toLowerCase(),
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
    .from("user_credentials")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (userError || !userData) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Get user from auth
  const { data: authUser, error: authError } =
    await supabase.auth.admin.getUserById(userData.id);

  if (authError || !authUser) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Sign in with Supabase Auth
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: authUser.user.email || `${username}@example.com`,
      password,
    });

  if (signInError) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Get user role
  const role = authUser.user.user_metadata?.role || "client";

  // Update last sign-in time
  await supabase
    .from("users")
    .update({ last_sign_in: new Date().toISOString() })
    .eq("id", authUser.user.id);

  return new Response(
    JSON.stringify({
      message: "Login successful",
      token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
      role,
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
    .from("user_credentials")
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

  // Get user from auth
  const { data: authUser, error: authError } =
    await supabase.auth.admin.getUserById(userData.id);

  if (authError || !authUser) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Get user role
  const role = authUser.user.user_metadata?.role || "client";

  return new Response(
    JSON.stringify({
      message: "PIN verified",
      role,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}

async function handleResetPassword(supabase, body, corsHeaders) {
  const { username, pin, new_password } = body;

  // Validate inputs
  if (!username || !pin || !new_password) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Validate new password
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(new_password)) {
    return new Response(
      JSON.stringify({
        error:
          "Password must be at least 8 characters with at least 1 letter and 1 number",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Find user by username
  const { data: userData, error: userError } = await supabase
    .from("user_credentials")
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

  // Update password
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    userData.id,
    { password: new_password },
  );

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
