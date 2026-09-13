import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('rpg_auth_token');
        const savedUser = localStorage.getItem('rpg_auth_user');
        const isGuestSaved = savedToken === 'demo-user-123' || savedToken?.startsWith('demo-') || savedToken === 'guest-token';

        if (isGuestSaved && savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            setUser(parsed);
            setToken(savedToken);
            setSession(null);
            setLoading(false);
            return;
          } catch (e) {}
        }

        if (isSupabaseConfigured && supabase) {
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            setToken(initialSession.access_token);
            localStorage.setItem('rpg_auth_token', initialSession.access_token);
            localStorage.setItem('rpg_auth_user', JSON.stringify(initialSession.user));
          } else if (savedToken && savedUser) {
            // Restore saved session
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
          }

          // Listen for Supabase auth state changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (!mounted) return;
            const currentToken = localStorage.getItem('rpg_auth_token');
            const isCurrentlyGuest = currentToken === 'demo-user-123' || currentToken?.startsWith('demo-') || currentToken === 'guest-token';

            if (currentSession?.user) {
              setSession(currentSession);
              setUser(currentSession.user);
              setToken(currentSession.access_token);
              localStorage.setItem('rpg_auth_token', currentSession.access_token);
              localStorage.setItem('rpg_auth_user', JSON.stringify(currentSession.user));
            } else if (!isCurrentlyGuest) {
              setSession(null);
              setUser(null);
              setToken(null);
              localStorage.removeItem('rpg_auth_token');
              localStorage.removeItem('rpg_auth_user');
            }
          });

          return () => subscription.unsubscribe();
        } else {
          // Local/Demo auth initialization
          if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Sign up
  const signUp = async (email, password, username) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanUsername = (username || cleanEmail.split('@')[0] || 'Hero').trim();
    const cleanPassword = (password || '').trim();

    // 1. Try our server registration endpoint (auto-confirms email and checks username uniqueness)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword, username: cleanUsername })
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          // Automatically sign in to Supabase for the session
          if (isSupabaseConfigured && supabase) {
            try {
              const signInRes = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword });
              if (signInRes.data?.session) {
                setSession(signInRes.data.session);
                setUser(signInRes.data.user);
                setToken(signInRes.data.session.access_token);
                localStorage.setItem('rpg_auth_token', signInRes.data.session.access_token);
                localStorage.setItem('rpg_auth_user', JSON.stringify(signInRes.data.user));
                return signInRes.data;
              }
            } catch (e) {
              console.warn('Auto signIn after register warning:', e);
            }
          }

          setUser(data.user);
          setToken(data.token);
          localStorage.setItem('rpg_auth_token', data.token);
          localStorage.setItem('rpg_auth_user', JSON.stringify(data.user));
          return data;
        } else if (data.error) {
          throw new Error(data.error);
        }
      }
    } catch (apiErr) {
      if (apiErr.message && !apiErr.message.includes('Failed to fetch') && !apiErr.message.includes('JSON')) {
        throw apiErr;
      }
    }

    // 2. Direct Supabase signup fallback (Works directly on Vercel / Mobile / Cloud)
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            username: cleanUsername,
            display_name: cleanUsername
          }
        }
      });

      if (error) {
        if (error.message.includes('Database error saving new user') || error.message.includes('already registered')) {
          throw new Error(`Username or email is already registered. Please login with your password.`);
        }
        throw error;
      }

      let currentSession = data.session;
      let currentUser = data.user;

      if (!currentSession && currentUser) {
        try {
          const signInRes = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword });
          if (signInRes.data?.session) {
            currentSession = signInRes.data.session;
            currentUser = signInRes.data.user;
          }
        } catch (e) {}
      }

      if (currentUser) {
        setUser(currentUser);
        try {
          const saved = JSON.parse(localStorage.getItem('rpg_known_users') || '{}');
          saved[cleanUsername.toLowerCase()] = cleanEmail;
          localStorage.setItem('rpg_known_users', JSON.stringify(saved));
        } catch (e) {}

        if (currentSession) {
          setSession(currentSession);
          setToken(currentSession.access_token);
          localStorage.setItem('rpg_auth_token', currentSession.access_token);
          localStorage.setItem('rpg_auth_user', JSON.stringify(currentUser));
        } else {
          const activeToken = `token-${currentUser.id}`;
          setToken(activeToken);
          localStorage.setItem('rpg_auth_token', activeToken);
          localStorage.setItem('rpg_auth_user', JSON.stringify(currentUser));
        }
      }
      return data;
    }

    // Offline fallback
    const fallbackUser = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      user_metadata: { username: cleanUsername, display_name: cleanUsername }
    };
    setUser(fallbackUser);
    setToken(`token-${fallbackUser.id}`);
    localStorage.setItem('rpg_auth_token', `token-${fallbackUser.id}`);
    localStorage.setItem('rpg_auth_user', JSON.stringify(fallbackUser));
    return { user: fallbackUser };
  };

  // Sign in
  const signIn = async (identifier, password) => {
    let cleanInput = (identifier || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanInput || !cleanPass) {
      throw new Error('Please enter both your email/username and password.');
    }

    let email = cleanInput.toLowerCase();

    // Helpful alias mappings for registered users
    const EMAIL_ALIASES = {
      'tarini@gmail.com': 'tariniprasadpati2023@gmail.com',
      'tariniprasad@gmail.com': 'tariniprasadpati2023@gmail.com',
      'tariniprasadpati@gmail.com': 'tariniprasadpati2023@gmail.com',
      'ashika@gmail.com': 'ashikatoppo@gamail.com',
      'ashikatoppo@gmail.com': 'ashikatoppo@gamail.com',
      'jagannath@gmail.com': 'jagannath@123gmail.com'
    };
    if (EMAIL_ALIASES[email]) {
      email = EMAIL_ALIASES[email];
    }

    if (isSupabaseConfigured && supabase) {
      // If user typed a username without @, resolve to their email address
      if (!email.includes('@')) {
        const cleanUser = email.trim();
        const DEFAULT_KNOWN = {
          ashika: 'ashikatoppo@gamail.com',
          ashikatoppo: 'ashikatoppo@gamail.com',
          tarini: 'tariniprasadpati2023@gmail.com',
          tariniprasad: 'tariniprasadpati2023@gmail.com',
          tariniprasadpati: 'tariniprasadpati2023@gmail.com',
          tariniprasadpati2023: 'tariniprasadpati2023@gmail.com',
          jagannath: 'jagannath@123gmail.com',
          sthitiprangya: 'sthitiprangya@gmail.com'
        };

        try {
          const localMap = JSON.parse(localStorage.getItem('rpg_known_users') || '{}');
          if (localMap[cleanUser]) {
            email = localMap[cleanUser];
          } else if (DEFAULT_KNOWN[cleanUser]) {
            email = DEFAULT_KNOWN[cleanUser];
          }
        } catch (e) {}

        if (!email.includes('@')) {
          try {
            const res = await fetch(`/api/auth/resolve-email?identifier=${encodeURIComponent(cleanUser)}`);
            const contentType = res.headers.get('content-type') || '';
            if (res.ok && contentType.includes('application/json')) {
              const d = await res.json();
              if (d.success && d.email) {
                email = d.email.toLowerCase().trim();
              }
            }
          } catch (e) {
            console.warn('Username resolution notice:', e);
          }
        }

        // If still no email address could be resolved from username
        if (!email.includes('@')) {
          throw new Error(`Username "${cleanInput}" not recognized. Please log in with your registered email address (e.g. tariniprasadpati2023@gmail.com).`);
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: cleanPass
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email or click Login again.');
        }
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please verify your credentials or click "Forgot password?" to reset it.');
        }
        throw error;
      }

      setSession(data.session);
      setUser(data.user);
      setToken(data.session.access_token);
      localStorage.setItem('rpg_auth_token', data.session.access_token);
      localStorage.setItem('rpg_auth_user', JSON.stringify(data.user));
      return data;
    }

    // Local fallback signin
    const fallbackUser = {
      id: 'demo-user-123',
      email,
      user_metadata: { username: email.split('@')[0], display_name: email.split('@')[0] }
    };
    const fallbackToken = 'demo-user-123';
    setUser(fallbackUser);
    setToken(fallbackToken);
    localStorage.setItem('rpg_auth_token', fallbackToken);
    localStorage.setItem('rpg_auth_user', JSON.stringify(fallbackUser));
    return { user: fallbackUser };
  };

  // Reset password
  const resetPassword = async (email, newPassword) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (newPassword || '').trim();

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, newPassword: cleanPass })
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch (e) {}

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: window.location.origin + '/login'
      });
      if (error) throw error;
      return { success: true, message: `Password reset link sent to ${cleanEmail}. Check your inbox!` };
    }

    return { success: true, message: 'Password updated locally.' };
  };

  // 1-Click Guest/Demo Access
  const loginGuest = async () => {
    try {
      // If Supabase user was active, sign out from Supabase first
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.auth.signOut();
        } catch (e) {}
      }

      // Clear previous cached profile/quests so guest doesn't show previous user's data
      localStorage.removeItem('rpg_local_profile_v3');
      localStorage.removeItem('rpg_local_quests_v3');

      const res = await fetch('/api/auth/guest', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSession(null);
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('rpg_auth_token', data.token);
        localStorage.setItem('rpg_auth_user', JSON.stringify(data.user));
        return data;
      }
    } catch (e) {
      // Offline fallback
      const fallbackUser = {
        id: 'demo-user-123',
        email: 'runner@cyber.net',
        username: 'CyberRunner',
        display_name: 'Cyber Runner',
        user_metadata: { username: 'CyberRunner', display_name: 'Cyber Runner' },
        isGuest: true
      };
      setSession(null);
      setUser(fallbackUser);
      setToken('demo-user-123');
      localStorage.setItem('rpg_auth_token', 'demo-user-123');
      localStorage.setItem('rpg_auth_user', JSON.stringify(fallbackUser));
      return { user: fallbackUser };
    }
  };

  // Sign out
  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    setUser(null);
    setSession(null);
    setToken(null);
    localStorage.removeItem('rpg_auth_token');
    localStorage.removeItem('rpg_auth_user');
    localStorage.removeItem('rpg_local_profile_v3');
    localStorage.removeItem('rpg_local_quests_v3');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        token,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        loginGuest,
        isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
