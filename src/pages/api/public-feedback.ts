import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

type FeedbackItem = {
  id: string;
  name: string;
  email: string;
  rating?: number | null;
  eventType?: string | null;
  message: string;
  createdAt: string;
  status?: 'public' | 'hold';
};

const DATA_DIR = path.join(process.cwd(), 'data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');

async function ensureFeedbackFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FEEDBACK_FILE);
  } catch {
    await fs.writeFile(FEEDBACK_FILE, '[]', 'utf8');
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await ensureFeedbackFile();
    const raw = await fs.readFile(FEEDBACK_FILE, 'utf8');
    const items = (JSON.parse(raw || '[]') as FeedbackItem[])
      .filter((item) => item.status !== 'hold')
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
      .slice(0, 6)
      .map((item) => ({
        id: item.id,
        name: item.name,
        company: item.eventType || 'Client',
        quote: item.message,
        image: '/team/raj.png',
      }));

    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error('Public feedback error:', error);
    return res.status(500).json({ error: 'Failed to load testimonials' });
  }
}

