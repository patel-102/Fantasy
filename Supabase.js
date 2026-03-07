/**
 * KING HUB - Supabase Infrastructure
 * Logic: Initializes connection and manages global auth state.
 */

const SUPABASE_URL = 'https://usclxowxelrwbymhxdsk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2x4b3d4ZWxyd2J5bWh4ZHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Nzk4MDIsImV4cCI6MjA4ODM1NTgwMn0.uGqNEmZMo3zJJRUNZUpXVnDZy_YysVK9M6NJtmGDv_M';

// 2. INITIALIZE CLIENT
// The 'supabase' variable becomes globally available to all your HTML pages
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * 3. BOOTSTRAP SYSTEM
 * This block ensures the session is loaded and the profile is active
 * before the rest of the app (Friend Hub / Profile) starts rendering.
 */
(async function bootstrapKingHub() {
    try {
        // Fetch current session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.error("Auth Initialization Error:", error.message);
        }

        // 4. HEARTBEAT LOGIC
        // Every time a user loads a page, we silently update their presence
        if (session?.user) {
            await supabase
                .from('profiles')
                .update({ last_active: new Date().toISOString() })
                .eq('id', session.user.id);
        }

        // 5. EMIT GLOBAL EVENT
        // This triggers the 'KingReady' event used in your pages
        const readyEvent = new CustomEvent('KingReady', {
            detail: { 
                session: session,
                user: session?.user || null
            }
        });
        
        window.dispatchEvent(readyEvent);
        console.log("👑 KING HUB: System Ready");

    } catch (err) {
        console.error("Critical System Failure:", err);
    }
})();

/**
 * 6. GLOBAL AUTH LISTENER
 * If a user logs out in one tab, this ensures all tabs respond.
 */
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        window.location.href = "login.html";
    }
});
