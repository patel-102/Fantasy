/* =========================================================
   🟣 SUPABASE IMPORT
   ========================================================= */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

/* =========================================================
   🟣 SUPABASE CONFIG
   ========================================================= */
const SUPABASE_URL = "https://bqqrqwihewcpirhtqqde.supabase.co";
const SUPABASE_ANON_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcXJxd2loZXdjcGlyaHRxcWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1Njk0MzEsImV4cCI6MjA4NzE0NTQzMX0.XuuUAyyNqCUQWDXB5ejovNahVScB9j4jWw6l9Hjb3ic";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/* =========================================================
   🟣 STORAGE BUCKET (CASE-SENSITIVE)
   ========================================================= */
const BUCKET_NAME = "king";

/* =========================================================
   🚀 UPLOAD WITH REAL PROGRESS (CORS SAFE)
   ========================================================= */
export function uploadWithProgress(path, file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!file || !path) {
      reject("File or path missing");
      return;
    }

    const xhr = new XMLHttpRequest();

    const uploadUrl =
      `${SUPABASE_URL}/storage/v1/object/${king}/${path}`;

    /* ---------- OPEN REQUEST ---------- */
    xhr.open("PUT", uploadUrl, true);

    /* ---------- REQUIRED HEADERS ---------- */
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.setRequestHeader("apikey", SUPABASE_ANON_KEY);
    xhr.setRequestHeader("Authorization", `Bearer ${SUPABASE_ANON_KEY}`);
    xhr.setRequestHeader("x-upsert", "true");

    /* ---------- PROGRESS ---------- */
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === "function") {
        const percent = Math.round(
          (event.loaded / event.total) * 100
        );
        onProgress(percent);
      }
    };

    /* ---------- SUCCESS / ERROR ---------- */
    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        resolve({
          success: true,
          path,
          bucket: king,
        });
      } else {
        reject({
          success: false,
          status: xhr.status,
          response: xhr.responseText,
        });
      }
    };

    xhr.onerror = () => {
      reject({
        success: false,
        error: "Network error",
      });
    };

    /* ---------- SEND FILE ---------- */
    xhr.send(file);
  });
}
