// === Supabase Public Config (SAFE TO HOST) ===

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Your Supabase Project URL
const SUPABASE_URL = "https://chqtivbtyixwtsqwezqb.supabase.co";

// Your Public Anon Key (safe to expose)
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNocXRpdmJ0eWl4d3RzcXdlenFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODUwMzQsImV4cCI6MjA4MDc2MTAzNH0.D0f49ElnV894qvnQDPWlSC81g6r3sZ1zJ4DaFhhUyzw";

// Create the Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// === Optional Quick Helpers (You can use or delete) ===

// Auth helper
export const auth = supabase.auth;

// Storage helper
export const storage = supabase.storage;

// Database helper
export const db = supabase.from.bind(supabase);
