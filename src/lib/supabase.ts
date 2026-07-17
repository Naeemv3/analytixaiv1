import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export const isRealSupabase = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' &&
  supabaseUrl.trim() !== ''
);

// Define User types for uniform auth usage
export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    business_name?: string;
    business_type?: string;
    company_size?: string;
    industry?: string;
    country?: string;
    currency?: string;
    fy_start_month?: string;
    is_onboarded?: boolean;
  };
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
}

// ----------------------------------------------------
// LOCAL SUPABASE EMULATION LAYER
// ----------------------------------------------------
class LocalSupabaseEmulator {
  private listeners: Array<(event: string, session: AuthSession | null) => void> = [];

  constructor() {
    // Listen for storage changes to sync across tabs if needed
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'analytixai_session') {
          this.triggerListeners('SIGNED_IN', this.getSessionSync());
        }
      });
    }
  }

  private getUsers(): any[] {
    const data = localStorage.getItem('analytixai_users');
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: any[]) {
    localStorage.setItem('analytixai_users', JSON.stringify(users));
  }

  private getSessionSync(): AuthSession | null {
    const data = localStorage.getItem('analytixai_session');
    return data ? JSON.parse(data) : null;
  }

  private setSessionSync(session: AuthSession | null) {
    if (session) {
      localStorage.setItem('analytixai_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('analytixai_session');
    }
  }

  private triggerListeners(event: string, session: AuthSession | null) {
    this.listeners.forEach((listener) => {
      try {
        listener(event, session);
      } catch (e) {
        console.error('Auth listener error:', e);
      }
    });
  }

  // API Client Interface matching @supabase/supabase-js
  auth = {
    getUser: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const session = this.getSessionSync();
      return { data: { user: session ? session.user : null }, error: null };
    },

    getSession: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { data: { session: this.getSessionSync() }, error: null };
    },

    signUp: async ({ email, password, options }: { email: string; password?: string; options?: any }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const users = this.getUsers();
      
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { data: { user: null }, error: { message: 'User already exists.' } };
      }

      const newUser: AuthUser = {
        id: 'user_dev_' + Math.random().toString(36).substr(2, 9),
        email,
        user_metadata: {
          full_name: options?.data?.full_name || '',
          business_name: options?.data?.business_name || '',
          business_type: options?.data?.business_type || '',
          company_size: options?.data?.company_size || '',
          is_onboarded: false,
        },
      };

      users.push({ ...newUser, password });
      this.saveUsers(users);

      // Instantly sign in user for convenient preview testing
      const session: AuthSession = {
        user: newUser,
        access_token: 'emu_token_' + Date.now(),
      };
      this.setSessionSync(session);
      this.triggerListeners('SIGNED_IN', session);

      return { data: { user: newUser, session }, error: null };
    },

    signInWithPassword: async ({ email, password }: { email: string; password?: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const users = this.getUsers();
      const matched = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!matched) {
        // For standard demo ease: if a brand new email is tried, let's create & log them in!
        // This is extremely convenient for first-time playtesters.
        if (email.includes('@') && password && password.length >= 6) {
          const newUser: AuthUser = {
            id: 'user_dev_' + Math.random().toString(36).substr(2, 9),
            email,
            user_metadata: {
              full_name: email.split('@')[0],
              business_name: 'My Enterprise',
              is_onboarded: false,
            },
          };
          users.push({ ...newUser, password });
          this.saveUsers(users);

          const session: AuthSession = {
            user: newUser,
            access_token: 'emu_token_' + Date.now(),
          };
          this.setSessionSync(session);
          this.triggerListeners('SIGNED_IN', session);
          return { data: { user: newUser, session }, error: null };
        }
        return { data: { user: null }, error: { message: 'Invalid login credentials. Enter any valid email and 6+ character password to instantly register/login.' } };
      }

      const session: AuthSession = {
        user: { id: matched.id, email: matched.email, user_metadata: matched.user_metadata },
        access_token: 'emu_token_' + Date.now(),
      };
      this.setSessionSync(session);
      this.triggerListeners('SIGNED_IN', session);

      return { data: { user: session.user, session }, error: null };
    },

    signInWithOAuth: async ({ provider }: { provider: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Construct dummy provider user
      const email = `partner_${provider}@analytixai.com`;
      const newUser: AuthUser = {
        id: `user_oauth_${provider}_` + Date.now(),
        email,
        user_metadata: {
          full_name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Enterprise Partner`,
          business_name: 'Global Ventures',
          is_onboarded: false,
        },
      };

      const session: AuthSession = {
        user: newUser,
        access_token: 'emu_oauth_token_' + Date.now(),
      };
      this.setSessionSync(session);
      this.triggerListeners('SIGNED_IN', session);

      return { data: { provider, url: '#' }, error: null };
    },

    signOut: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.setSessionSync(null);
      this.triggerListeners('SIGNED_OUT', null);
      return { error: null };
    },

    onAuthStateChange: (callback: (event: string, session: AuthSession | null) => void) => {
      this.listeners.push(callback);
      const current = this.getSessionSync();
      // Invoke callback initially with current state
      callback(current ? 'INITIAL_SESSION' : 'SIGNED_OUT', current);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              this.listeners = this.listeners.filter((l) => l !== callback);
            },
          },
        },
      };
    },

    updateUser: async ({ data }: { data: any }) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const session = this.getSessionSync();
      if (!session) {
        return { data: { user: null }, error: { message: 'No active session.' } };
      }

      session.user.user_metadata = {
        ...session.user.user_metadata,
        ...data,
      };

      // Also update in registered list
      const users = this.getUsers();
      const updatedUsers = users.map((u) => {
        if (u.id === session.user.id) {
          return {
            ...u,
            user_metadata: {
              ...u.user_metadata,
              ...data,
            },
          };
        }
        return u;
      });
      this.saveUsers(updatedUsers);

      this.setSessionSync(session);
      this.triggerListeners('USER_UPDATED', session);

      return { data: { user: session.user }, error: null };
    },

    resetPasswordForEmail: async (email: string) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const users = this.getUsers();
      const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!matched && !email.includes('@')) {
        return { error: { message: 'Please enter a valid email address.' } };
      }
      return { data: {}, error: null };
    },
  };
}

// Export actual or emulated client based on environment config and user selection
const emulatorInstance = new LocalSupabaseEmulator() as any;
const realClientInstance = isRealSupabase ? createClient(supabaseUrl!, supabaseAnonKey!) : null;

export const getUseSandbox = (): boolean => {
  if (typeof window === 'undefined') return true;
  if (!isRealSupabase) return true;
  const stored = localStorage.getItem('analytixai_use_sandbox');
  return stored !== 'false'; // Default to sandbox (true) for bulletproof previewing unless explicitly set to false
};

export const setUseSandbox = (value: boolean) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('analytixai_use_sandbox', value ? 'true' : 'false');
    window.location.reload();
  }
};

export const supabase = {
  get auth() {
    if (getUseSandbox()) {
      return emulatorInstance.auth;
    }
    return realClientInstance!.auth;
  },
  from(table: string) {
    if (getUseSandbox()) {
      return {
        select: (columns?: string) => ({
          eq: (column: string, value: any) => ({
            single: async () => {
              await new Promise((resolve) => setTimeout(resolve, 300));
              const storedProfile = localStorage.getItem(`analytixai_profile_${value}`);
              if (storedProfile) {
                return { data: JSON.parse(storedProfile), error: null };
              }
              // Fallback to active session user_metadata
              const sessionData = localStorage.getItem('analytixai_session');
              const session = sessionData ? JSON.parse(sessionData) : null;
              const meta = session?.user?.user_metadata || {};
              const defaultProfile = {
                id: value,
                full_name: meta.full_name || 'Demo Executive',
                email: session?.user?.email || 'demo.user@analytixai.com',
                company: meta.business_name || 'Acme Analytics Corp',
                role: meta.role || 'Executive',
              };
              return { data: defaultProfile, error: null };
            }
          })
        }),
        update: (values: any) => ({
          eq: (column: string, value: any) => {
            return {
              then: async (resolve: any) => {
                await new Promise((res) => setTimeout(res, 500));
                const storedProfile = localStorage.getItem(`analytixai_profile_${value}`) || '{}';
                const current = JSON.parse(storedProfile);
                const updated = { ...current, ...values, id: value };
                localStorage.setItem(`analytixai_profile_${value}`, JSON.stringify(updated));
                
                // Sync with auth user_metadata as well
                const sessionData = localStorage.getItem('analytixai_session');
                if (sessionData) {
                  const session = JSON.parse(sessionData);
                  if (session?.user?.id === value) {
                    session.user.user_metadata = {
                      ...session.user.user_metadata,
                      full_name: values.full_name || session.user.user_metadata.full_name,
                      business_name: values.company || session.user.user_metadata.business_name,
                      role: values.role || session.user.user_metadata.role,
                    };
                    localStorage.setItem('analytixai_session', JSON.stringify(session));
                  }
                }
                resolve({ data: updated, error: null });
              }
            };
          }
        }),
        insert: (values: any) => Promise.resolve({ data: values, error: null })
      };
    }
    return realClientInstance!.from(table);
  }
} as any;
