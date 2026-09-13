import { isSupabaseConfigured, supabase } from '../config/supabase.js';
import { localStore } from '../data/store.js';

export const getSystemStatus = (req, res) => {
  return res.json({
    success: true,
    supabaseConnected: isSupabaseConfigured,
    mode: isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Local Fallback Engine',
    timestamp: new Date().toISOString()
  });
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const cleanUsername = (username || email.split('@')[0]).trim();

    if (isSupabaseConfigured && supabase) {
      // 1. Check if username is already taken by another user
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (existingProfile) {
        return res.status(400).json({
          success: false,
          error: `Username "${cleanUsername}" is already taken. Please choose another username (e.g. ${cleanUsername}1).`
        });
      }

      // 2. Create user with email auto-confirmed so they aren't blocked
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          username: cleanUsername,
          display_name: cleanUsername
        }
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          return res.status(400).json({
            success: false,
            error: 'An account with this email already exists. Please log in directly.'
          });
        }
        return res.status(400).json({ success: false, error: error.message });
      }

      const user = data.user;

      // Ensure profile exists in profiles table
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!prof) {
        await supabase.from('profiles').insert({
          id: user.id,
          username: cleanUsername,
          display_name: cleanUsername
        });
      }

      return res.json({
        success: true,
        user,
        token: `token-${user.id}`
      });
    }

    // Local fallback
    const fallbackUser = {
      id: `user-${Date.now()}`,
      email,
      user_metadata: { username: cleanUsername, display_name: cleanUsername }
    };
    return res.json({
      success: true,
      user: fallbackUser,
      token: `token-${fallbackUser.id}`
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Registration failed.' });
  }
};

export const loginGuest = (req, res) => {
  const demoUserId = 'demo-user-123';
  const profile = localStore.getProfile(demoUserId);
  const username = profile.username || 'CyberRunner';
  const displayName = profile.display_name || 'Cyber Runner';

  return res.json({
    success: true,
    token: demoUserId,
    user: {
      id: demoUserId,
      email: 'runner@cyber.net',
      username: username,
      display_name: displayName,
      user_metadata: {
        username: username,
        display_name: displayName
      },
      isGuest: true
    },
    profile
  });
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    if (isSupabaseConfigured && supabase && userId) {
      const { data, error } = await supabase.auth.admin.updateUserById(userId, {
        password: newPassword
      });

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.json({
        success: true,
        message: 'Password updated successfully in database.'
      });
    }

    return res.json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to update password.'
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long.'
      });
    }

    if (isSupabaseConfigured && supabase) {
      const { data: userList, error: listErr } = await supabase.auth.admin.listUsers();
      if (listErr) throw listErr;

      const user = userList?.users?.find(
        u => u.email?.toLowerCase() === email.trim().toLowerCase() ||
             u.user_metadata?.username?.toLowerCase() === email.trim().toLowerCase()
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          error: `No account found for "${email.trim()}".`
        });
      }

      const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
        password: newPassword
      });

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.json({
        success: true,
        message: `Password for ${user.email} has been reset successfully! You can now log in.`
      });
    }

    return res.json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Password reset failed.'
    });
  }
};

export const resolveEmail = async (req, res) => {
  try {
    const { identifier } = req.query;
    if (!identifier) {
      return res.status(400).json({ success: false, error: 'Identifier required.' });
    }

    const clean = identifier.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data: userList } = await supabase.auth.admin.listUsers();
      const user = userList?.users?.find(
        u => u.email?.toLowerCase() === clean ||
             u.user_metadata?.username?.toLowerCase() === clean ||
             u.email?.split('@')[0]?.toLowerCase() === clean
      );

      if (user) {
        return res.json({ success: true, email: user.email });
      }
    }

    return res.status(404).json({ success: false, error: 'User not found.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
