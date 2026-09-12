// functions/api/_auth.js
// Cloudflare Pages Functions - Authentication & Session Helper
// Strictly restricts administrative access to @fatahilah-mr

export const ALLOWED_ADMIN = 'fatahilah-mr';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

// Helper to get secret key buffer
async function getCryptoKey(secret) {
  if (!secret) {
    throw new Error('AUTH_SECRET is required but missing.');
  }
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

// Convert ArrayBuffer to hex string
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert hex string to Uint8Array
function hexToUint8Array(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Create signed session token: username:expiry:signature
export async function createSessionToken(username, secret) {
  if (!secret) throw new Error('AUTH_SECRET is required to sign session token.');
  const expiry = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `${username.toLowerCase()}:${expiry}`;
  const key = await getCryptoKey(secret);
  const sigBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const sigHex = bufferToHex(sigBuffer);
  return `${payload}:${sigHex}`;
}

// Verify session token
export async function verifySessionToken(token, secret) {
  if (!token || typeof token !== 'string' || !secret) return null;
  const parts = token.split(':');
  if (parts.length !== 3) return null;

  const [username, expiryStr, sigHex] = parts;
  const expiry = parseInt(expiryStr, 10);
  const now = Math.floor(Date.now() / 1000);

  if (isNaN(expiry) || now > expiry) return null;
  if (username.toLowerCase() !== ALLOWED_ADMIN.toLowerCase()) return null;

  try {
    const key = await getCryptoKey(secret);
    const payload = `${username.toLowerCase()}:${expiry}`;
    const sigBytes = hexToUint8Array(sigHex);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      new TextEncoder().encode(payload)
    );

    if (!isValid) return null;
    return { username, expiry };
  } catch (err) {
    console.error('Session verification error:', err);
    return null;
  }
}

// Extract and verify session from Request cookies
export async function getAdminSession(request, env) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );

  const token = cookies['admin_session'];
  if (!token) return null;

  const secret = env.AUTH_SECRET;
  return await verifySessionToken(token, secret);
}

// Build Set-Cookie header string
export function buildSessionCookie(token, maxAge = SESSION_MAX_AGE) {
  return `admin_session=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

// Build Clear-Cookie header string
export function buildClearCookie() {
  return `admin_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

// OAuth State Cookie Helpers for CSRF Protection (RFC 6749 Section 10.12)
export function buildOAuthStateCookie(state) {
  return `oauth_state=${state}; Path=/api/auth; Max-Age=300; HttpOnly; Secure; SameSite=Lax`;
}

export function buildClearOAuthStateCookie() {
  return `oauth_state=; Path=/api/auth; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
