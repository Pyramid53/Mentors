import { AppUser, UserRole } from '../types';

const CURRENT_USER_KEY = 'mentors_marine_active_user_v1';
const REGISTERED_USERS_KEY = 'mentors_marine_users_db_v1';

interface StoredUserRecord extends AppUser {
  passwordHash?: string;
}

// Default demo client (admin credentials are NEVER stored on client-side, only authenticated via database/API)
const DEFAULT_USERS: StoredUserRecord[] = [
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
    createdAt: '2025-04-02T12:00:00Z'
  }
];

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

    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
      });

      const data = await resp.json();

      if (resp.ok && data.success && data.user) {
        const safeUser: AppUser = data.user;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
        notifyAuthListeners(safeUser);
        return {
          success: true,
          user: safeUser
        };
      }

      return {
        success: false,
        error: data.error || 'Authentication rejected. Please verify your credentials.'
      };
    } catch (err: any) {
      console.error('Auth request exception:', err);
      return {
        success: false,
        error: 'Unable to connect to authorization server. Please try again.'
      };
    }
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

    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          email: cleanEmail,
          password: data.password.trim(),
          company: data.company.trim(),
          phone: data.phone?.trim() || '',
          role: 'client' // strictly client role for self-registration
        })
      });

      const resData = await resp.json();

      if (resp.ok && resData.success && resData.user) {
        const safeUser: AppUser = {
          id: resData.user.id,
          name: resData.user.name,
          email: resData.user.email,
          company: resData.user.company,
          role: 'client',
          phone: resData.user.phone,
          avatarInitials: resData.user.avatar_initials || 'MM',
          createdAt: resData.user.created_at || new Date().toISOString()
        };

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
        notifyAuthListeners(safeUser);
        return {
          success: true,
          user: safeUser
        };
      }

      return {
        success: false,
        error: resData.error || 'Registration failed.'
      };
    } catch (err: any) {
      console.error('Registration exception:', err);
      return {
        success: false,
        error: 'Registration service unavailable. Please check connectivity.'
      };
    }
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    notifyAuthListeners(null);
  },

  loginAsDemoClient(): AppUser {
    const client = DEFAULT_USERS[0];
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
