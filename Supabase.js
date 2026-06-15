// 🦋 KING Supabase Engine v3.3 - Presence & SQL v2.0 Optimized
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const SUPABASE_URL = 'https://bcmxkkdysegmluolvjup.supabase.co';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjbXhra2R5c2VnbWx1b2x2anVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDYwNTYsImV4cCI6MjA5NzA4MjA1Nn0.z5-TlBzzOWoBzwH3YxUa0Lhbz2nTlMuRsOP93qzkVqE';
// Supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
// Create Client
export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);

// Make available globally
window.supabase = supabase;

// ----------------------------
// Authentication
// ----------------------------

export async function login(email, password) {
    return await supabase.auth.signInWithPassword({
        email,
        password
    });
}

export async function logout() {
    return await supabase.auth.signOut();
}

export async function getUser() {
    const {
        data: { user }
    } = await supabase.auth.getUser();

    return user;
}

// ----------------------------
// Upload APK
// ----------------------------

export async function uploadApp(file) {

    const filePath =
        "apps/" +
        Date.now() +
        "_" +
        file.name;

    const { error } =
        await supabase.storage
        .from(APP_BUCKET)
        .upload(filePath, file);

    if (error) throw error;

    return filePath;
}

// ----------------------------
// Save App Details
// ----------------------------

export async function saveApp(
    appName,
    version,
    changelog,
    filePath
) {

    return await supabase
        .from("apps")
        .insert({
            app_name: appName,
            version,
            changelog,
            file_path: filePath
        });

}

// ----------------------------
// Get Latest App
// ----------------------------

export async function latestApp() {

    const { data, error } =
        await supabase
        .from("apps")
        .select("*")
        .order("uploaded_at", {
            ascending: false
        })
        .limit(1)
        .single();

    if (error) throw error;

    return data;

}

// ----------------------------
// Download URL
// ----------------------------

export async function getDownloadUrl(path) {

    const { data, error } =
        await supabase.storage
        .from(APP_BUCKET)
        .createSignedUrl(path, 300);

    if (error) throw error;

    return data.signedUrl;

        }
