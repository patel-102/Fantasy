/**
 * KING - Supabase Configuration & Initialization
 */

const SUPABASE_URL = 'https://bqqrqwihewcpirhtqqde.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcXJxd2loZXdjcGlyaHRxcWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1Njk0MzEsImV4cCI6MjA4NzE0NTQzMX0.XuuUAyyNqCUQWDXB5ejovNahVScB9j4jWw6l9Hjb3ic';

// Load CDN if missing
if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  document.head.appendChild(script);
}

const initSupabase = () => {
  try {
    const { createClient } = window.supabase;
    const options = {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    };

    // Create the global instance
    window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, options);
    
    // Dispatch a "KingReady" event so pages know they can start auth checks
    window.dispatchEvent(new CustomEvent('KingReady'));
    
    console.log("👑 KING: Connection Secured");
  } catch (error) {
    console.error("👑 KING: Connection Error", error);
  }
};

const checkLibrary = setInterval(() => {
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    initSupabase();
    clearInterval(checkLibrary);
  }
}, 50);

