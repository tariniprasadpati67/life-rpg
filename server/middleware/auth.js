import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token missing or invalid format.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Special handling for local demo / guest users
    if (token.startsWith('demo-') || token === 'guest-token' || !isSupabaseConfigured) {
      const demoId = token.startsWith('demo-') ? token : (token.startsWith('token-') ? token.replace('token-', '') : 'demo-user-123');
      req.user = {
        id: demoId,
        email: 'runner@cyber.net',
        username: 'CyberRunner',
        display_name: 'Cyber Runner',
        user_metadata: {
          username: 'CyberRunner',
          display_name: 'Cyber Runner'
        },
        isGuest: true
      };
      return next();
    }

    // Support backend token format: token-<UUID> or direct UUID
    if (token.startsWith('token-') || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
      const userId = token.startsWith('token-') ? token.replace('token-', '') : token;
      const { data, error: idErr } = await supabase.auth.admin.getUserById(userId);
      if (data?.user) {
        req.user = data.user;
        return next();
      }
    }

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (user) {
      req.user = user;
      return next();
    }

    // Fallback for expired JWT tokens: decode JWT payload to extract user ID
    if (token.includes('.')) {
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        if (payload?.sub) {
          const { data: adminUser } = await supabase.auth.admin.getUserById(payload.sub);
          if (adminUser?.user) {
            req.user = adminUser.user;
            return next();
          }
        }
      } catch (jwtErr) {}
    }

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired authentication session.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('🔒 [Auth Middleware] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server authorization error.'
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) return next();

    // Special handling for local demo / guest users
    if (token.startsWith('demo-') || token === 'guest-token' || !isSupabaseConfigured) {
      const demoId = token.startsWith('demo-') ? token : (token.startsWith('token-') ? token.replace('token-', '') : 'demo-user-123');
      req.user = {
        id: demoId,
        email: 'runner@cyber.net',
        username: 'CyberRunner',
        display_name: 'Cyber Runner',
        user_metadata: {
          username: 'CyberRunner',
          display_name: 'Cyber Runner'
        },
        isGuest: true
      };
      return next();
    }

    // Support backend token format: token-<UUID> or direct UUID
    if (token.startsWith('token-') || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
      const userId = token.startsWith('token-') ? token.replace('token-', '') : token;
      const { data } = await supabase.auth.admin.getUserById(userId);
      if (data?.user) {
        req.user = data.user;
        return next();
      }
    }

    // Verify token with Supabase Auth
    const { data: { user } } = await supabase.auth.getUser(token);
    if (user) {
      req.user = user;
      return next();
    }

    // Fallback for expired JWT tokens
    if (token.includes('.')) {
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        if (payload?.sub) {
          const { data: adminUser } = await supabase.auth.admin.getUserById(payload.sub);
          if (adminUser?.user) {
            req.user = adminUser.user;
            return next();
          }
        }
      } catch (jwtErr) {}
    }

    next();
  } catch (err) {
    next();
  }
};
