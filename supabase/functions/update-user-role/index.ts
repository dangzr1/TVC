import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // In Edge Functions, we can access these variables directly from Deno.env
    // These are automatically set by Supabase when the function is deployed
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        "Missing Supabase credentials. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.",
      );
    }

    // Initialize Supabase client with service key for admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // First, get the user by email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: `User with email ${email} not found` }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        },
      );
    }

    // Update the user's role in auth metadata
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userData.id,
      { user_metadata: { role: "admin" } },
    );

    if (authError) {
      return new Response(
        JSON.stringify({
          error: `Error updating auth metadata: ${authError.message}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Update the user's role in the users table
    const { error: updateError } = await supabase
      .from("users")
      .update({ role: "admin" })
      .eq("id", userData.id);

    if (updateError) {
      return new Response(
        JSON.stringify({
          error: `Error updating users table: ${updateError.message}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `User ${email} has been upgraded to admin`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
