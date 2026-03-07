/**
 * KING ENGINE v5.0
 * Centralized Supabase Storage + Profile + Message Control
 */

const SUPABASE_URL = 'https://usclxowxelrwbymhxdsk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2x4b3d4ZWxyd2J5bWh4ZHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Nzk4MDIsImV4cCI6MjA4ODM1NTgwMn0.uGqNEmZMo3zJJRUNZUpXVnDZy_YysVK9M6NJtmGDv_M';

if (!window.supabase) {
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  document.head.appendChild(script);
}

window.kingStorage = {

  bucket: "king",

  // =========================
  // FILE UPLOAD
  // =========================

  async upload(file, folder = "mail") {
    try {

      const { data:{user} } = await window.supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const ext = file.name.split(".").pop();

      const path =
        `${user.id}/${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await window.supabase
        .storage
        .from(this.bucket)
        .upload(path, file);

      if (error) throw error;

      const { data:{publicUrl} } =
        window.supabase.storage
        .from(this.bucket)
        .getPublicUrl(path);

      return {
        url: publicUrl,
        path: path
      };

    } catch(err) {

      console.error("Upload Error:",err.message);
      return null;

    }
  },


  // =========================
  // DELETE FILE
  // =========================

  async deleteFile(storagePath){

    if(!storagePath) return;

    try{

      await window.supabase
      .storage
      .from(this.bucket)
      .remove([storagePath]);

      return true;

    }catch(err){

      console.error("Delete Error:",err.message);
      return false;

    }

  },


  // =========================
  // DELETE MESSAGE (FOR EVERYONE)
  // =========================

  async shredMessage(messageId, storagePath=null){

    try{

      if(storagePath){
        await this.deleteFile(storagePath);
      }

      const {error} =
      await window.supabase
      .from("messages")
      .delete()
      .eq("id",messageId);

      if(error) throw error;

      return {success:true};

    }catch(err){

      console.error("Shred Error:",err.message);
      return {success:false};

    }

  },


  // =========================
  // UPDATE PROFILE
  // =========================

  async saveFullProfile(textData,mediaData){

    try{

      const {data:{user}} =
      await window.supabase.auth.getUser();

      const updateProfile =
      window.supabase
      .from("profiles")
      .update(textData)
      .eq("id",user.id);

      const updateMedia =
      window.supabase
      .from("profile_media")
      .update(mediaData)
      .eq("profile_id",user.id);

      const [res1,res2] =
      await Promise.all([updateProfile,updateMedia]);

      if(res1.error) throw res1.error;
      if(res2.error) throw res2.error;

      return {success:true};

    }catch(err){

      console.error("Profile Sync Error:",err.message);

      return {
        success:false,
        error:err.message
      };

    }

  },


  // =========================
  // FETCH PROFILE + MEDIA
  // =========================

  async getCombinedProfile(targetId){

    const {data,error} =
    await window.supabase
    .from("profiles")
    .select(`
      *,
      profile_media (
        avatar_url,
        gallery
      )
    `)
    .eq("id",targetId)
    .single();

    return {data,error};

  }

};



// =========================
// INITIALIZATION
// =========================

const initSupabase = () => {

  try{

    window.supabase =
    supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    window.dispatchEvent(
      new CustomEvent("KingReady")
    );

    console.log("👑 KING Engine v5 Online");

  }catch(err){

    console.error("Boot Error:",err);

  }

};



// Wait for CDN
const check = setInterval(()=>{

  if(window.supabase?.createClient){

    initSupabase();
    clearInterval(check);

  }

},50);