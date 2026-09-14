import { AppUser, UserRole } from '../types';
import { getSupabaseClient } from './supabaseClient';

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
const listeners: Set<AuthListener> = new Set();

function notifyAuthListeners(user: AppUser | null) {
  listeners.forEach((listener) => {
    try {
      listener(user);
    } catch (err) {
      console.error('Error in auth listener:', err);
    }
  });
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

  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: AppUser }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Try server API endpoint (works in full-stack Node/Express container)
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
    } catch (err) {
      // Backend not running or static GitHub Pages hosting - proceed to client fallbacks
    }

    // 2. Try direct Supabase client if configured on client side
    const supabase = getSupabaseClient();
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
        console.warn('Direct Supabase login error:', e);
      }
    }

    // 3. Static Hosting / Local Demo Mode fallback (works out of the box on GitHub Pages)
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
  }): Promise<{ success: boolean; error?: string; user?: AppUser }> {
    const cleanEmail = data.email.trim().toLowerCase();
    const initials = data.name
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

    // Always save to local store so static GitHub Pages retains registered user
    saveLocalRegisteredUser(newUserRecord);

    // 1. Try server API
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

    // 2. Try direct Supabase if configured on client
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('app_users').insert([{
          id: newUserRecord.id,
          name: newUserRecord.name,
          email: newUserRecord.email,
          company: newUserRecord.company,
          role: 'client',
          phone: newUserRecord.phone,
          avatar_initials: newUserRecord.avatarInitials,
          password_hash: newUserRecord.passwordHash
        }]);
      } catch (err) {
        console.warn('Supabase direct insert warning:', err);
      }
    }

    // Fallback: log user in immediately with created record
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
    return { success: true, user: safeUser };
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    notifyAuthListeners(null);
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
  }
};
