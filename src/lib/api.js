/**
 * Centralized resilient API fetcher with cold-start tolerance and fallback URLs
 */

export const RENDER_BACKEND_URL = 'https://life-rpg-xc6g.onrender.com';

// Cache server wake state
let isServerAwake = false;
let wakePromise = null;

/**
 * Silently wake up the Render backend container if sleeping
 */
export const wakeUpServer = () => {
  if (isServerAwake || wakePromise) return wakePromise;

  wakePromise = (async () => {
    try {
      // 1. Try local/proxy health
      const localRes = await fetch('/api/health', { method: 'GET' }).catch(() => null);
      if (localRes && localRes.ok) {
        isServerAwake = true;
        return true;
      }
      // 2. Direct Render health ping
      const renderRes = await fetch(`${RENDER_BACKEND_URL}/api/health`, { method: 'GET' }).catch(() => null);
      if (renderRes && renderRes.ok) {
        isServerAwake = true;
        return true;
      }
    } catch (_) {}
    return false;
  })();

  return wakePromise;
};

/**
 * Resilient API fetcher:
 * Tries local relative route first, and if failed with network error or 504,
 * falls back to direct Render URL.
 */
export const resilientFetch = async (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // 1. First attempt: relative path (/api/...)
  try {
    const res = await fetch(cleanEndpoint, options);
    // If Vercel proxy returns 504 Gateway Timeout or 502 Bad Gateway
    if (res.status === 504 || res.status === 502) {
      throw new Error('PROXY_TIMEOUT');
    }
    return res;
  } catch (err) {
    // If running already on Render or if not a network failure, don't retry same URL
    if (window.location.origin === RENDER_BACKEND_URL) {
      throw formatFetchError(err);
    }

    // 2. Fallback attempt: Direct to Render backend URL
    try {
      const directUrl = `${RENDER_BACKEND_URL}${cleanEndpoint}`;
      const directRes = await fetch(directUrl, options);
      return directRes;
    } catch (fallbackErr) {
      throw formatFetchError(fallbackErr);
    }
  }
};

/**
 * Format raw network errors into clear, friendly guidance
 */
export const formatFetchError = (err) => {
  const msg = err?.message || '';
  if (
    msg.includes('Failed to fetch') ||
    msg.includes('NetworkError') ||
    msg.includes('Load failed') ||
    msg.includes('PROXY_TIMEOUT') ||
    msg.includes('fetch failed')
  ) {
    const friendly = new Error(
      'Server connection waking up (Render free tier). Please wait 10-15 seconds and try again.'
    );
    friendly.isNetworkError = true;
    return friendly;
  }
  return err;
};
