import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClientInstance: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const rawUrl =
    (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
    '';

  const supabaseKey =
    (typeof process !== 'undefined' && (process.env?.SUPABASE_SERVICE_ROLE_KEY || process.env?.SUPABASE_ANON_KEY)) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
    '';

  return Boolean(rawUrl && supabaseKey);
}

/**
 * Calculates the dynamic redirect URL for Supabase Auth flows
 * Works on GitHub Pages (https://pyramid53.github.io/Mentors/#/client-portal)
 * and local/production custom domains.
 */
export function getAuthRedirectUrl(subpath: string = '/#/client-portal'): string {
  if (typeof window === 'undefined') {
    return `https://pyramid53.github.io/Mentors${subpath}`;
  }
  const origin = window.location.origin;
  const basePath = window.location.pathname.replace(/\/+$/, '');
  return `${origin}${basePath}${subpath}`;
}

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

    const isBrowser = typeof window !== 'undefined';

    supabaseClientInstance = createClient(cleanUrl, supabaseKey.trim(), {
      auth: {
        persistSession: isBrowser,
        autoRefreshToken: isBrowser,
        detectSessionInUrl: isBrowser,
        storageKey: 'mentors_supabase_auth_token_v1'
      }
    });
    return supabaseClientInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

