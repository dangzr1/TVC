#!/bin/bash

# Deploy the auth function
supabase functions deploy auth --project-ref $SUPABASE_PROJECT_ID

# Set the service role key for the function
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY --project-ref $SUPABASE_PROJECT_ID

# Set the URL for the function
supabase secrets set SUPABASE_URL=$SUPABASE_URL --project-ref $SUPABASE_PROJECT_ID

echo "Deployed auth function successfully!"
