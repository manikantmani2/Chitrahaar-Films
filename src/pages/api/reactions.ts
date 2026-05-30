import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

type ReactionsStore = {
  items: Record<string, { users: string[] }>;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const REACTIONS_FILE = path.join(DATA_DIR, 'reactions.json');

const DEFAULT_STORE: ReactionsStore = { items: {} };

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(REACTIONS_FILE);
  } catch {
    await fs.writeFile(REACTIONS_FILE, JSON.stringify(DEFAULT_STORE, null, 2), 'utf8');
  }
}

async function readStore(): Promise<ReactionsStore> {
  await ensureFile();
  const raw = await fs.readFile(REACTIONS_FILE, 'utf8');
  const parsed = JSON.parse(raw || '{}') as ReactionsStore;
  return {
    items: parsed?.items && typeof parsed.items === 'object' ? parsed.items : {},
  };
}

async function writeStore(store: ReactionsStore) {
  await ensureFile();
  await fs.writeFile(REACTIONS_FILE, JSON.stringify(store, null, 2), 'utf8');
}

function getCounts(store: ReactionsStore) {
  return Object.fromEntries(
    Object.entries(store.items).map(([itemId, item]) => [itemId, Array.isArray(item.users) ? item.users.length : 0]),
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const store = await readStore();
    return res.status(200).json({ counts: getCounts(store) });
  }

  if (req.method === 'POST') {
    try {
      const { itemId, clientId, liked } = req.body as {
        itemId?: string | number;
        clientId?: string;
        liked?: boolean;
      };

      if (itemId == null || !clientId) {
        return res.status(400).json({ error: 'itemId and clientId are required' });
      }

      const normalizedId = String(itemId);
      const store = await readStore();
      const users = Array.isArray(store.items[normalizedId]?.users)
        ? [...store.items[normalizedId].users]
        : [];

      const existingIndex = users.indexOf(clientId);
      if (liked && existingIndex === -1) users.push(clientId);
      if (!liked && existingIndex !== -1) users.splice(existingIndex, 1);

      store.items[normalizedId] = { users };
      await writeStore(store);

      return res.status(200).json({
        itemId: normalizedId,
        liked: users.includes(clientId),
        count: users.length,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update reactions' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
