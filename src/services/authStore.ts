import { AppUser, UserRole } from '../types';
import { getSupabaseClient, getAuthRedirectUrl } from './supabaseClient';

const CURRENT_USER_KEY = 'mentors_marine_active_user_v1';
const REGISTERED_USERS_KEY = 'mentors_marine_users_db_v1';

interface StoredUserRecord extends AppUser {
  passwordHash?: string;
}

// Built-in verified credentials for demo / offline / GitHub Pages deployment
const DEFAULT_FALLBACK_USERS: StoredUserRecord[] = [
  {
    id: 'USR-ADM-01',
    name: 'Capt. Tarek Mansour (Owner)',
    email: 'admin@mentors.com',
    company: 'Mentors Marine Services SAE',
    role: 'admin',
    title: 'Managing Director & Suez Dispatch Master',
    phone: '+20 100 489 2210',
    port: 'Suez Head Office & Adabiya Free Zone',
    avatarInitials: 'TM',
    passwordHash: 'tarekmentorsowner',
    createdAt: '2025-01-10T08:00:00Z'
  },
  {
    id: 'USR-CLT-01',
    name: 'Capt. Marco Rossi',
    email: 'm.rossi@msc-operations.com',
    company: 'Mediterranean Shipping Company (Geneva)',
    role: 'client',
    title: 'Fleet Procurement Superintendent',
    phone: '+39 340 551 2894',
    port: 'Suez Anchorage (V-Zone)',
    avatarInitials: 'MR',
    passwordHash: 'client123',
    createdAt: '2025-03-15T10:30:00Z'
  },
  {
    id: 'USR-CLT-02',
    name: 'Sarah Lindqvist',
    email: 'superintendent@shipping.com',
    company: 'Nordic Tankers AS',
    role: 'client',
    title: 'Technical Fleet Manager',
    phone: '+47 902 33 412',
    port: 'Ain Sokhna & Suez',
    avatarInitials: 'SL',
    passwordHash: 'shipping123',
    createdAt: '2025-04-02T12:00:00Z'
  }
];

function getLocalRegisteredUsers(): StoredUserRecord[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalRegisteredUser(user: StoredUserRecord) {
  try {
    const current = getLocalRegisteredUsers();
    const updated = [user, ...current.filter((u) => u.email.toLowerCase() !== user.email.toLowerCase())];
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save user to localStorage:', err);
  }
}

type AuthListener = (user: AppUser | null) => void;
type RecoveryListener = (isRecovery: boolean) => void;

const listeners: Set<AuthListener> = new Set();
const recoveryListeners: Set<RecoveryListener> = new Set();
let isPasswordRecoveryActive = false;

function notifyAuthListeners(user: AppUser | null) {
  listeners.forEach((listener) => {
    try {
      listener(user);
    } catch (err) {
      console.error('Error in auth listener:', err);
    }
  });
}

function notifyRecoveryListeners(status: boolean) {
  isPasswordRecoveryActive = status;
  recoveryListeners.forEach((l) => {
    try {
      l(status);
    } catch (err) {
      console.error('Error in recovery listener:', err);
    }
  });
}

// Global Supabase Auth listener initializer
let isSupabaseListenerInitialized = false;
function ensureSupabaseAuthListener() {
  if (isSupabaseListenerInitialized || typeof window === 'undefined') return;
  const supabase = getSupabaseClient();
  if (!supabase) return;

  isSupabaseListenerInitialized = true;

  // Check URL hash for type=recovery or type=signup
  if (window.location.hash.includes('type=recovery') || window.location.search.includes('type=recovery')) {
    notifyRecoveryListeners(true);
  }

  try {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        notifyRecoveryListeners(true);
      } else if (event === 'SIGNED_IN' && session?.user) {
        // User confirmed email or signed in via magic link
        const meta = session.user.user_metadata || {};
        const name = meta.name || session.user.email?.split('@')[0] || 'Vessel Officer';
        const initials = name
          .split(' ')
          .filter(Boolean)
          .map((p: string) => p[0])
          .join('')
          .toUpperCase()
          .substring(0, 2) || 'MM';

        const safeUser: AppUser = {
          id: session.user.id,
          name: name,
          email: session.user.email || '',
          company: meta.company || 'Maritime Client',
          role: (meta.role as UserRole) || 'client',
          phone: meta.phone || '',
          avatarInitials: initials,
          createdAt: session.user.created_at || new Date().toISOString()
        };

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
        notifyAuthListeners(safeUser);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem(CURRENT_USER_KEY);
        notifyAuthListeners(null);
        notifyRecoveryListeners(false);
      }
    });
  } catch (err) {
    console.warn('Could not bind Supabase auth state change listener:', err);
  }
}

// Auto-run on client
if (typeof window !== 'undefined') {
  ensureSupabaseAuthListener();
}

export const authStore = {
  getCurrentUser(): AppUser | null {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.role === 'admin';
  },

  isPasswordRecoveryMode(): boolean {
    return isPasswordRecoveryActive;
  },

  setPasswordRecoveryMode(status: boolean) {
    notifyRecoveryListeners(status);
  },

  async login(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: string;
    user?: AppUser;
    emailNotConfirmed?: boolean;
    email?: string;
  }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Try Supabase Auth first if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        });

        if (authError) {
          const errMsg = authError.message.toLowerCase();
          if (errMsg.includes('email not confirmed') || errMsg.includes('not verified')) {
            return {
              success: false,
              error: 'Your email address has not been confirmed yet. Please check your inbox for the activation link.',
              emailNotConfirmed: true,
              email: cleanEmail
            };
          }
        } else if (authData?.user) {
          const meta = authData.user.user_metadata || {};
          const name = meta.name || cleanEmail.split('@')[0] || 'Vessel Officer';
          const initials = name
            .split(' ')
            .filter(Boolean)
            .map((p: string) => p[0])
            .join('')
            .toUpperCase()
            .substring(0, 2) || 'MM';

          const safeUser: AppUser = {
            id: authData.user.id,
            name: name,
            email: authData.user.email || cleanEmail,
            company: meta.company || 'Maritime Client',
            role: (meta.role as UserRole) || 'client',
            phone: meta.phone || '',
            avatarInitials: initials,
            createdAt: authData.user.created_at || new Date().toISOString()
          };

          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
          notifyAuthListeners(safeUser);
          return { success: true, user: safeUser };
        }
      } catch (err: any) {
        console.warn('Supabase signInWithPassword notice:', err?.message || err);
      }
    }

    // 2. Try server API endpoint (Node/Express backend)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const contentType = resp.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await resp.json();
        if (resp.ok && data.success && data.user) {
          const safeUser: AppUser = data.user;
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
          notifyAuthListeners(safeUser);
          return { success: true, user: safeUser };
        } else if (data.error) {
          return { success: false, error: data.error };
        }
      }
    } catch {
      // Backend not running / static GitHub Pages hosting
    }

    // 3. Try direct app_users table in Supabase
    if (supabase) {
      try {
        const { data: dbUser, error } = await supabase
          .from('app_users')
          .select('*')
          .ilike('email', cleanEmail)
          .maybeSingle();

        if (!error && dbUser) {
          if (dbUser.password_hash === cleanPassword) {
            const user: AppUser = {
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              role: dbUser.role || 'client',
              company: dbUser.company,
              phone: dbUser.phone,
              avatarInitials: dbUser.avatar_initials || 'MM',
              createdAt: dbUser.created_at
            };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            notifyAuthListeners(user);
            return { success: true, user };
          } else {
            return { success: false, error: 'Incorrect password.' };
          }
        }
      } catch (e) {
        console.warn('Direct Supabase table query error:', e);
      }
    }

    // 4. Static Hosting / Local Demo Mode fallback (works out of the box on GitHub Pages)
    const allFallbackUsers = [...DEFAULT_FALLBACK_USERS, ...getLocalRegisteredUsers()];
    const matched = allFallbackUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (matched) {
      if (matched.passwordHash === cleanPassword) {
        const safeUser: AppUser = {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          role: matched.role,
          company: matched.company,
          phone: matched.phone,
          title: matched.title,
          port: matched.port,
          avatarInitials: matched.avatarInitials || 'MM',
          createdAt: matched.createdAt || new Date().toISOString()
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
        notifyAuthListeners(safeUser);
        return { success: true, user: safeUser };
      }
      return { success: false, error: 'Incorrect password.' };
    }

    return {
      success: false,
      error: 'No account found with this email. You can register a new account below.'
    };
  },

  async signup(data: {
    name: string;
    email: string;
    password: string;
    company: string;
    role?: UserRole;
    phone?: string;
  }): Promise<{
    success: boolean;
    error?: string;
    user?: AppUser;
    needsEmailConfirmation?: boolean;
    email?: string;
  }> {
    const cleanEmail = data.email.trim().toLowerCase();
    const initials =
      data.name
        .split(' ')
        .filter(Boolean)
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .substring(0, 2) || 'MM';

    const newUserRecord: StoredUserRecord = {
      id: `USR-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      company: data.company.trim(),
      role: 'client',
      phone: data.phone?.trim() || '',
      avatarInitials: initials,
      passwordHash: data.password.trim(),
      createdAt: new Date().toISOString()
    };

    // Save locally for reliable demo and offline fallbacks
    saveLocalRegisteredUser(newUserRecord);

    // 1. Try Supabase Auth signUp with email confirmation
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const redirectUrl = getAuthRedirectUrl('/#/client-portal');
        const { data: authResult, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: data.password.trim(),
          options: {
            data: {
              name: data.name.trim(),
              company: data.company.trim(),
              phone: data.phone?.trim() || '',
              role: 'client'
            },
            emailRedirectTo: redirectUrl
          }
        });

        if (authError) {
          // If already registered
          if (authError.message.toLowerCase().includes('already registered')) {
            return {
              success: false,
              error: 'An account with this email address already exists. Please login or reset your password.'
            };
          }
          return { success: false, error: authError.message };
        }

        // Check if email confirmation is required by Supabase project settings
        const isEmailConfirmationPending =
          authResult.user &&
          !authResult.session &&
          (!authResult.user.confirmed_at ||
            (authResult.user.identities && authResult.user.identities.length > 0));

        // Sync to app_users table as well
        try {
          await supabase.from('app_users').insert([
            {
              id: authResult.user?.id || newUserRecord.id,
              name: newUserRecord.name,
              email: newUserRecord.email,
              company: newUserRecord.company,
              role: 'client',
              phone: newUserRecord.phone,
              avatar_initials: newUserRecord.avatarInitials,
              password_hash: newUserRecord.passwordHash
            }
          ]);
        } catch {
          // app_users insert may be restricted or optional
        }

        if (isEmailConfirmationPending) {
          return {
            success: true,
            needsEmailConfirmation: true,
            email: cleanEmail,
            user: {
              id: authResult.user?.id || newUserRecord.id,
              name: newUserRecord.name,
              email: cleanEmail,
              company: newUserRecord.company,
              role: 'client',
              phone: newUserRecord.phone,
              avatarInitials: initials,
              createdAt: newUserRecord.createdAt
            }
          };
        }

        // If auto-confirmed or confirmations disabled
        if (authResult.session) {
          const safeUser: AppUser = {
            id: authResult.user?.id || newUserRecord.id,
            name: newUserRecord.name,
            email: cleanEmail,
            company: newUserRecord.company,
            role: 'client',
            phone: newUserRecord.phone,
            avatarInitials: initials,
            createdAt: newUserRecord.createdAt
          };
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
          notifyAuthListeners(safeUser);
          return { success: true, needsEmailConfirmation: false, user: safeUser };
        }
      } catch (err: any) {
        console.warn('Supabase signUp error:', err?.message || err);
      }
    }

    // 2. Try server API backend
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          email: cleanEmail,
          password: data.password.trim(),
          company: data.company.trim(),
          phone: data.phone?.trim() || '',
          role: 'client'
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const contentType = resp.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const resData = await resp.json();
        if (resp.ok && resData.success && resData.user) {
          const safeUser: AppUser = {
            id: resData.user.id,
            name: resData.user.name,
            email: resData.user.email,
            company: resData.user.company,
            role: 'client',
            phone: resData.user.phone,
            avatarInitials: resData.user.avatar_initials || initials,
            createdAt: resData.user.created_at || new Date().toISOString()
          };
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
          notifyAuthListeners(safeUser);
          return { success: true, user: safeUser };
        }
      }
    } catch {
      // Backend not running / static GitHub Pages hosting
    }

    // 3. Fallback: log user in with created record
    const safeUser: AppUser = {
      id: newUserRecord.id,
      name: newUserRecord.name,
      email: newUserRecord.email,
      company: newUserRecord.company,
      role: 'client',
      phone: newUserRecord.phone,
      avatarInitials: newUserRecord.avatarInitials,
      createdAt: newUserRecord.createdAt
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    notifyAuthListeners(safeUser);
    return { success: true, needsEmailConfirmation: false, user: safeUser };
  },

  /**
   * Resends the signup confirmation email to the user via Supabase
   */
  async resendConfirmationEmail(
    email: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const supabase = getSupabaseClient();

    if (!supabase) {
      return {
        success: true,
        message: 'A verification link has been resent to your email address (Demo mode).'
      };
    }

    try {
      const redirectUrl = getAuthRedirectUrl('/#/client-portal');
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: cleanEmail,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: 'Confirmation email successfully resent. Please check your inbox and spam folder.'
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to resend confirmation email.'
      };
    }
  },

  /**
   * Dispatches a Password Reset link via email using Supabase
   */
  async sendPasswordResetEmail(
    email: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const supabase = getSupabaseClient();

    if (!supabase) {
      return {
        success: true,
        message: `Password reset instructions have been dispatched to ${cleanEmail}.`
      };
    }

    try {
      const redirectUrl = getAuthRedirectUrl('/#/reset-password');
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: `Password reset link sent to ${cleanEmail}. Please check your email inbox to choose a new password.`
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to send password reset email.'
      };
    }
  },

  /**
   * Updates the user's password once they arrive via recovery link
   */
  async updatePassword(
    newPassword: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    const cleanPassword = newPassword.trim();
    if (cleanPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.updateUser({
          password: cleanPassword
        });

        if (error) {
          return { success: false, error: error.message };
        }

        // Also update local copy and app_users table if user session exists
        if (data?.user?.email) {
          try {
            await supabase
              .from('app_users')
              .update({ password_hash: cleanPassword, updated_at: new Date().toISOString() })
              .eq('email', data.user.email);
          } catch {
            // Optional table update
          }
        }

        notifyRecoveryListeners(false);
        return {
          success: true,
          message: 'Your password has been updated securely. You can now access your vessel account.'
        };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Failed to update password.' };
      }
    }

    // Offline / Demo fallback
    notifyRecoveryListeners(false);
    return {
      success: true,
      message: 'Password updated successfully (Demo mode).'
    };
  },

  logout(): void {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e);
      }
    }
    localStorage.removeItem(CURRENT_USER_KEY);
    notifyAuthListeners(null);
    notifyRecoveryListeners(false);
  },

  loginAsDemoClient(): AppUser {
    const client = DEFAULT_FALLBACK_USERS[1];
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(client));
    notifyAuthListeners(client);
    return client;
  },

  subscribe(listener: AuthListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  subscribeRecovery(listener: RecoveryListener): () => void {
    recoveryListeners.add(listener);
    return () => {
      recoveryListeners.delete(listener);
    };
  }
};

