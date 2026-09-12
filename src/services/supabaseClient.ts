import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClientInstance) {
    return supabaseClientInstance;
  }

  // Check server-side or client-side env variables
  const rawUrl =
    (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
    '';

  const supabaseKey =
    (typeof process !== 'undefined' && (process.env?.SUPABASE_SERVICE_ROLE_KEY || process.env?.SUPABASE_ANON_KEY)) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
    '';

  if (!rawUrl || !supabaseKey) {
    return null;
  }

  try {
    // Normalize URL to origin (handles trailing slashes, /rest/v1 copy-paste, etc.)
    let cleanUrl = rawUrl.trim();
    try {
      cleanUrl = new URL(cleanUrl).origin;
    } catch {
      cleanUrl = cleanUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
    }

    supabaseClientInstance = createClient(cleanUrl, supabaseKey.trim(), {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    return supabaseClientInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}
