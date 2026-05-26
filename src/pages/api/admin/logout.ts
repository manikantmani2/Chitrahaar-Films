import type { NextApiRequest, NextApiResponse } from 'next';
import { clearAdminSessionCookie } from '@/lib/adminAuth';

type ResponseData = { success: true } | { error: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Set-Cookie', clearAdminSessionCookie());
  return res.status(200).json({ success: true });
}
