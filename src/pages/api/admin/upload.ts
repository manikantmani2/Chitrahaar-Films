import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { hasAdminAccess } from '@/lib/adminAuth';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime'];

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_UPLOAD_URL = CLOUDINARY_CLOUD_NAME ? `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload` : undefined;

function sanitizeFilename(name: string) {
  return path.basename(name).replace(/[^a-zA-Z0-9._\- ()]/g, '_');
}

function signCloudinaryParams(params: Record<string, string | number>) {
  const sortedKeys = Object.keys(params).sort();
  const toSign = sortedKeys.map((key) => `${key}=${params[key]}`).join('&');
  return crypto.createHash('sha1').update(`${toSign}${CLOUDINARY_API_SECRET}`).digest('hex');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await hasAdminAccess(req, res))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, folder, data } = req.body as { filename?: string; folder?: string; data?: string };
    if (!filename || !folder || !data) {
      return res.status(400).json({ error: 'Missing filename, folder or data' });
    }

    // Extract and validate MIME type from data URL
    let mimeType = 'application/octet-stream';
    const match = typeof data === 'string' ? data.match(/^data:(.+);base64,(.*)$/) : null;
    if (match) {
      mimeType = match[1];
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return res.status(400).json({ error: `File type not allowed. Supported types: images and videos only. Got: ${mimeType}` });
    }

    const base64 = match ? match[2] : data;
    const buffer = Buffer.from(base64, 'base64');

    // Validate file size
    if (buffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ error: `File size exceeds limit. Maximum: ${MAX_FILE_SIZE / (1024 * 1024)}MB, Got: ${Math.round(buffer.length / (1024 * 1024))}MB` });
    }

    const safeName = sanitizeFilename(filename);
    const folderName = folder.replace(/\s+/g, '_');

    if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET && CLOUDINARY_UPLOAD_URL) {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = signCloudinaryParams({ folder: folderName, resource_type: 'auto', timestamp });
      const formData = new FormData();
      formData.append('file', `data:${mimeType};base64,${base64}`);
      formData.append('api_key', CLOUDINARY_API_KEY);
      formData.append('timestamp', timestamp.toString());
      formData.append('folder', folderName);
      formData.append('resource_type', 'auto');
      formData.append('signature', signature);

      const cloudRes = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!cloudRes.ok) {
        const json = await cloudRes.json().catch(() => null);
        const errorMessage = json?.error?.message || `Cloudinary upload failed with status ${cloudRes.status}`;
        return res.status(500).json({ error: errorMessage });
      }

      const json = await cloudRes.json();
      const publicPath = json.secure_url || json.url;
      return res.status(200).json({ path: publicPath, cloudinary: true });
    }

    const targetDir = path.join(process.cwd(), 'public', folder);
    await fs.mkdir(targetDir, { recursive: true });

    const targetPath = path.join(targetDir, safeName);
    await fs.writeFile(targetPath, buffer);

    const publicPath = `/${folder}/${safeName}`.replace(/\\+/g, '/');
    return res.status(200).json({ path: publicPath });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to save file' });
  }
}
