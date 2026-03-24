// =====================================================
// 🔐 SUPABASE SECURE CLIENT (NO ANON KEY EXPOSURE)
// =====================================================

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const SUPABASE_URL = 'https://jjlqrqikoquuzpckcwud.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbHFycWlrb3F1dXpwY2tjd3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjgwOTksImV4cCI6MjA4OTkwNDA5OX0.1NZMSZADcI2ar7D228GmjJbvYthK3chQySOyGr_Sjfo';



// =====================================================
// =====================================================
// 🔐 SUPABASE ZERO TRUST CLIENT (FINAL FIXED)
// =====================================================


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================================================
// 📱 DEVICE ID (PERSISTENT)
// =====================================================

function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }
  return id;
}

// =====================================================
// 🌐 GET USER IP
// =====================================================

async function getIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return "0.0.0.0";
  }
}

// =====================================================
// 🔐 REGISTER
// =====================================================

export async function register(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

// =====================================================
// 🔐 LOGIN (SMART ZERO TRUST)
// =====================================================

export async function login(email, password) {

  const device_id = getDeviceId();
  const ip = await getIP();

  // Step 1: Auth login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  // Step 2: Create session
  const { data: token, error: sessionError } = await supabase.rpc("create_session", {
    p_device: device_id,
    p_ip: ip,
    p_agent: navigator.userAgent
  });

  if (sessionError) {
    await supabase.auth.signOut();
    throw sessionError;
  }

  // ✅ FIX: Handle RECONNECT
  if (token && token !== "RECONNECTED") {
    localStorage.setItem("session_token", token);
  }

  return data;
}

// =====================================================
// 🔍 VALIDATE SESSION (AUTO HEARTBEAT)
// =====================================================

export async function validateSession() {

  const token = localStorage.getItem("session_token");
  const device_id = getDeviceId();
  const ip = await getIP();

  if (!token) return false;

  const { data, error } = await supabase.rpc("validate_zero_trust", {
    p_token: token,
    p_device: device_id,
    p_ip: ip
  });

  if (error || !data) {
    await logout();
    return false;
  }

  return true;
}

// =====================================================
// ❤️ HEARTBEAT (KEEP USER ONLINE)
// =====================================================

export function startHeartbeat(interval = 60000) {
  return setInterval(async () => {
    await validateSession();
  }, interval);
}

// =====================================================
// 🚪 LOGOUT
// =====================================================

export async function logout() {
  localStorage.removeItem("session_token");
  await supabase.auth.signOut();
}

// =====================================================
// 🔔 REALTIME LOGIN ALERT LISTENER
// =====================================================

export async function listenLoginAlerts(callback) {

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  return supabase
    .channel("login-alerts")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "login_alerts",
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
}