import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import type { SiteContentData } from '@/types/content';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

const FALLBACK_CONTENT: SiteContentData = {
  featured: [],
  portfolio: [],
};

async function readContent(): Promise<SiteContentData> {
  try {
    // Try root data/content.json first
    let raw: string | undefined;
    try {
      raw = await fs.readFile(CONTENT_FILE, 'utf8');
    } catch (err) {
      // Fallback: some deployments use the `chitrahaar-website` subfolder as project root
      const altPath = path.join(process.cwd(), 'chitrahaar-website', 'data', 'content.json');
      try {
        raw = await fs.readFile(altPath, 'utf8');
      } catch (err2) {
        raw = undefined;
      }
    }

    return JSON.parse(raw || '{}') as SiteContentData;
  } catch {
    return FALLBACK_CONTENT;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SiteContentData | { error: string }>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const content = await readContent();
  return res.status(200).json({
    featured: (content.featured || []).filter((item) => item.visible !== false),
    portfolio: (content.portfolio || []).filter((item) => item.visible !== false),
  });
}

