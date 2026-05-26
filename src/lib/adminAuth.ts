import crypto from 'crypto';
import type { NextApiRequest } from 'next';
import type { NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './nextAuth';

const COOKIE_NAME = 'chitrahaar_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'chitrahaar-admin-session-secret';
}

export function createAdminSessionCookie() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(expiresAt);
  const signature = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
  const value = `${payload}.${signature}`;

  const parts = [
    `${COOKIE_NAME}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ];

  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }

  return parts.join('; ');
}

export function clearAdminSessionCookie() {
  return [
    `${COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=0',
  ].join('; ');
}

function readCookieValue(req: NextApiRequest, name: string) {
  const cookieHeader = req.headers.cookie || '';
  const entries = cookieHeader.split(';').map((entry) => entry.trim());
  const match = entries.find((entry) => entry.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function readCookieValueFromHeader(cookieHeader: string | undefined, name: string) {
  const entries = (cookieHeader || '').split(';').map((entry) => entry.trim());
  const match = entries.find((entry) => entry.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

export function isAdminSessionValid(req: NextApiRequest) {
  const raw = readCookieValue(req, COOKIE_NAME);
  return isSignedAdminSessionValid(raw);
}

export function isAdminSessionValidFromCookieHeader(cookieHeader: string | undefined) {
  const raw = readCookieValueFromHeader(cookieHeader, COOKIE_NAME);
  return isSignedAdminSessionValid(raw);
}

export async function hasAdminAccess(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (session?.user?.email) {
    return true;
  }

  return isAdminSessionValid(req);
}

function isSignedAdminSessionValid(raw: string | null) {
  if (!raw) {
    return false;
  }

  const [expiresAt, signature] = raw.split('.');
  if (!expiresAt || !signature) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  const expiry = Number(expiresAt);
  if (!Number.isFinite(expiry) || expiry < now) {
    return false;
  }

  const expectedSignature = crypto.createHmac('sha256', getSecret()).update(expiresAt).digest('hex');
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}
