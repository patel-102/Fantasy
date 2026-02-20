/**
 * KING - Centralized Supabase & Multi-Table Storage Engine
 */

const SUPABASE_URL = 'https://bqqrqwihewcpirhtqqde.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcXJxd2loZXdjcGlyaHRxcWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1Njk0MzEsImV4cCI6MjA4NzE0NTQzMX0.XuuUAyyNqCUQWDXB5ejovNahVScB9j4jWw6l9Hjb3ic';

if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  document.head.appendChild(script);
}

window.kingStorage = {
  bucket: 'king',

  // 1. Storage Part: Handles physical file uploads
  async upload(file, folder = 'general') {
    try {
      const { data: { user } } = await window.supabase.auth.getUser();
      if (!user) throw new Error("Auth required.");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await window.supabase.storage
        .from(this.bucket)
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = window.supabase.storage
        .from(this.bucket)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      console.error("Storage Error:", err.message);
      return null;
    }
  },

  // 2. Multi-Table Sync: Saves text to 'profiles' and media to 'profile_media'
  async saveFullProfile(textData, mediaData) {
    try {
      const { data: { user } } = await window.supabase.auth.getUser();
      
      // Update Part 1: Profiles (Text/Docs)
      const p1 = window.supabase
        .from('profiles')
        .update(textData)
        .eq('id', user.id);

      // Update Part 2: Profile Media (Links)
      const p2 = window.supabase
        .from('profile_media')
        .update(mediaData)
        .eq('profile_id', user.id);

      const [res1, res2] = await Promise.all([p1, p2]);
      
      if (res1.error) throw res1.error;
      if (res2.error) throw res2.error;

      return { success: true };
    } catch (err) {
      console.error("Sync Error:", err.message);
      return { success: false, error: err.message };
    }
  },

  // Helper to fetch joined data
  async getCombinedProfile(targetId) {
    const { data, error } = await window.supabase
      .from('profiles')
      .select(`
        *,
        profile_media (avatar_url, gallery)
      `)
      .eq('id', targetId)
      .single();
    
    return { data, error };
  }
};

const initSupabase = () => {
  try {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.dispatchEvent(new CustomEvent('KingReady'));
    console.log("👑 KING Engine: Triple-Split Architecture Online");
  } catch (error) {
    console.error("Boot Error", error);
  }
};

const checkLibrary = setInterval(() => {
  if (window.supabase?.createClient) {
    initSupabase();
    clearInterval(checkLibrary);
  }
}, 50);

