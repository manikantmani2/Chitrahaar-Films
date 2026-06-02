import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { hasAdminAccess } from '@/lib/adminAuth';
import type { SiteContentData } from '@/types/content';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

const FALLBACK_CONTENT: SiteContentData = {
  featured: [],
  portfolio: [],
};

function stripBom(value: string): string {
  return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
}

async function ensureContentFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(CONTENT_FILE);
  } catch {
    await fs.writeFile(CONTENT_FILE, JSON.stringify(FALLBACK_CONTENT, null, 2), 'utf8');
  }
}

async function readContent(): Promise<SiteContentData> {
  await ensureContentFile();
  const raw = await fs.readFile(CONTENT_FILE, 'utf8');
  return JSON.parse(stripBom(raw) || '{}') as SiteContentData;
}

async function writeContent(content: SiteContentData) {
  await ensureContentFile();
  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SiteContentData | { error: string }>) {
  if (!(await hasAdminAccess(req, res))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const content = await readContent();
    return res.status(200).json(content);
  }

  if (req.method === 'PUT') {
    try {
      const nextContent = req.body as SiteContentData;
      await writeContent({
        featured: Array.isArray(nextContent?.featured) ? nextContent.featured : [],
        portfolio: Array.isArray(nextContent?.portfolio) ? nextContent.portfolio : [],
      });
      return res.status(200).json({ featured: nextContent.featured || [], portfolio: nextContent.portfolio || [] });
    } catch (error) {
      console.error('Update content error:', error);
      return res.status(500).json({ error: 'Failed to update content' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

