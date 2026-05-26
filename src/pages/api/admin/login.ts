import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminSessionCookie } from '@/lib/adminAuth';

type ResponseData = { success: true } | { error: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD is not configured' });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  res.setHeader('Set-Cookie', createAdminSessionCookie());
  return res.status(200).json({ success: true });
}
