import { AppUser, UserRole } from '../types';

const CURRENT_USER_KEY = 'mentors_marine_active_user_v1';
const REGISTERED_USERS_KEY = 'mentors_marine_users_db_v1';

interface StoredUserRecord extends AppUser {
  passwordHash: string;
}

const DEFAULT_USERS: StoredUserRecord[] = [
  {
    id: 'USR-ADM-01',
    name: 'Capt. Tarek Mansour',
    email: 'admin@mentors-marine.com',
    company: 'Mentors Marine Services SAE',
    role: 'admin',
    title: 'Chief Suez Operations Superintendent',
    phone: '+20 100 489 2210',
    port: 'Port of Suez & Canal Waiting Area',
    avatarInitials: 'TM',
    createdAt: '2025-01-10T08:00:00Z',
    passwordHash: 'admin123'
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
    createdAt: '2025-03-15T10:30:00Z',
    passwordHash: 'client123'
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
    createdAt: '2025-04-02T12:00:00Z',
    passwordHash: 'shipping123'
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

function getStoredUsers(): StoredUserRecord[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS;
  }
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

  login(email: string, password: string):{ success: boolean; error?: string; user?: AppUser } {
    const cleanEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const matched = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!matched) {
      return {
        success: false,
        error: 'No account registered with this email address. Please check your spelling or sign up.'
      };
    }

    if (matched.passwordHash !== password.trim()) {
      return {
        success: false,
        error: 'Incorrect password. Please try again or use the demo login buttons.'
      };
    }

    const { passwordHash: _, ...safeUser } = matched;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    notifyAuthListeners(safeUser);

    return {
      success: true,
      user: safeUser
    };
  },

  signup(data: {
    name: string;
    email: string;
    password: string;
    company: string;
    role: UserRole;
    phone?: string;
    staffCode?: string;
  }): { success: boolean; error?: string; user?: AppUser } {
    const cleanEmail = data.email.trim().toLowerCase();
    const users = getStoredUsers();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        error: 'An account already exists with this email. Please sign in.'
      };
    }

    // If attempting to register as admin, require staff security code or pass verification
    if (data.role === 'admin') {
      const staffCode = data.staffCode?.trim().toUpperCase();
      if (staffCode !== 'MENTORS2026' && staffCode !== 'SUEZADMIN') {
        return {
          success: false,
          error: 'Invalid Mentors Marine staff security verification code. Only authorized dispatch officers may register as Admin.'
        };
      }
    }

    const initials = data.name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'MM';

    const newUser: StoredUserRecord = {
      id: `USR-${data.role.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name.trim(),
      email: cleanEmail,
      company: data.company.trim(),
      role: data.role,
      title: data.role === 'admin' ? 'Operations Dispatch Officer' : 'Vessel Superintendent',
      phone: data.phone?.trim() || '',
      avatarInitials: initials,
      createdAt: new Date().toISOString(),
      passwordHash: data.password.trim()
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers));

    // Sync to Supabase via backend API
    try {
      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: cleanEmail,
          password: data.password,
          company: data.company,
          phone: data.phone,
          role: data.role
        })
      }).catch((err) => console.log('User sync skipped/offline:', err.message));
    } catch (err) {
      // safe fallback
    }

    const { passwordHash: _, ...safeUser } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    notifyAuthListeners(safeUser);

    return {
      success: true,
      user: safeUser
    };
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    notifyAuthListeners(null);
  },

  loginAsDemoAdmin(): AppUser {
    const admin = DEFAULT_USERS[0];
    const { passwordHash: _, ...safeUser } = admin;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    notifyAuthListeners(safeUser);
    return safeUser;
  },

  loginAsDemoClient(): AppUser {
    const client = DEFAULT_USERS[1];
    const { passwordHash: _, ...safeUser } = client;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    notifyAuthListeners(safeUser);
    return safeUser;
  },

  subscribe(listener: AuthListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }
};
