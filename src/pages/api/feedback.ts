import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';
import { hasAdminAccess } from '@/lib/adminAuth';

type FeedbackItem = {
  id: string;
  name: string;
  email: string;
  rating?: number | null;
  eventType?: string | null;
  message: string;
  createdAt: string;
};

type FeedbackMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  averageRating: number;
  recentCount: number;
  latestSubmission: string | null;
  recentItems: FeedbackItem[];
};

type ResponseData =
  | { success: boolean; message?: string; items?: FeedbackItem[]; meta?: FeedbackMeta }
  | { error: string };

const DATA_DIR = path.join(process.cwd(), 'data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');

function toCsv(items: FeedbackItem[]) {
  const headers = ['id', 'createdAt', 'name', 'email', 'rating', 'eventType', 'message'];
  const escapeValue = (value: unknown) => {
    const normalized = String(value ?? '');
    return `"${normalized.replace(/"/g, '""')}"`;
  };

  const rows = items.map((item) =>
    [item.id, item.createdAt, item.name, item.email, item.rating ?? '', item.eventType ?? '', item.message]
      .map(escapeValue)
      .join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

function normalizeQuery(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

function applyQueryFilter(items: FeedbackItem[], query: string) {
  if (!query) {
    return items;
  }

  return items.filter((item) => {
    return [item.name, item.email, item.eventType, item.message]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(query));
  });
}

function buildMeta(items: FeedbackItem[], page: number, limit: number): FeedbackMeta {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const ratedItems = items.filter((item) => typeof item.rating === 'number');
  const averageRating = ratedItems.length
    ? Number((ratedItems.reduce((sum, item) => sum + Number(item.rating || 0), 0) / ratedItems.length).toFixed(1))
    : 0;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentCount = items.filter((item) => new Date(item.createdAt).getTime() >= weekAgo).length;
  const latestSubmission = items[0]?.createdAt || null;
  const recentItems = items.slice(0, 3);

  return {
    page,
    limit,
    total,
    totalPages,
    averageRating,
    recentCount,
    latestSubmission,
    recentItems,
  };
}

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(FEEDBACK_FILE);
    } catch {
      await fs.writeFile(FEEDBACK_FILE, '[]', 'utf8');
    }
  } catch (err) {
    console.error('Failed to ensure data file:', err);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await ensureDataFile();

  if (req.method === 'GET') {
    try {
      if (!(await hasAdminAccess(req, res))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const raw = await fs.readFile(FEEDBACK_FILE, 'utf8');
      const allItems = (JSON.parse(raw || '[]') as FeedbackItem[]).sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
      const searchQuery = normalizeQuery(req.query.query);
      const filteredItems = applyQueryFilter(allItems, searchQuery);
      const page = Math.max(1, Number(req.query.page || 1));
      const limit = Math.max(1, Math.min(50, Number(req.query.limit || 5)));
      const start = (page - 1) * limit;
      const paginatedItems = filteredItems.slice(start, start + limit);
      const meta = buildMeta(filteredItems, page, limit);

      if (req.query.export === 'csv') {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=feedback.csv');
        return res.status(200).send(toCsv(filteredItems));
      }

      return res.status(200).json({ success: true, items: paginatedItems, meta });
    } catch (err) {
      console.error('Read feedback error:', err);
      return res.status(500).json({ error: 'Failed to read feedback' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      if (!(await hasAdminAccess(req, res))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const id = typeof req.query.id === 'string' ? req.query.id : '';
      if (!id) {
        return res.status(400).json({ error: 'Missing feedback id' });
      }

      const raw = await fs.readFile(FEEDBACK_FILE, 'utf8');
      const items = JSON.parse(raw || '[]') as FeedbackItem[];
      const nextItems = items.filter((item) => item.id !== id);

      await fs.writeFile(FEEDBACK_FILE, JSON.stringify(nextItems, null, 2), 'utf8');

      return res.status(200).json({ success: true, message: 'Feedback deleted' });
    } catch (err) {
      console.error('Delete feedback error:', err);
      return res.status(500).json({ error: 'Failed to delete feedback' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, rating, eventType, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const timestamp = new Date().toISOString();
    const entry = { id: timestamp, name, email, rating: rating || null, eventType: eventType || null, message, createdAt: timestamp };

    // Persist feedback to file
    try {
      const raw = await fs.readFile(FEEDBACK_FILE, 'utf8');
      const items = JSON.parse(raw || '[]');
      items.unshift(entry);
      await fs.writeFile(FEEDBACK_FILE, JSON.stringify(items, null, 2), 'utf8');
    } catch (err) {
      console.error('Write feedback error:', err);
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send feedback to business email
    if (process.env.BUSINESS_EMAIL) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.BUSINESS_EMAIL,
        subject: `New Feedback from ${name} (${eventType || 'General'})`,
        html: `
        <h2>New Feedback</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Rating:</strong> ${rating || 'N/A'}</p>
        <p><strong>Event Type:</strong> ${eventType || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      });
    }

    // Optional confirmation email to user
    if (process.env.EMAIL_USER && email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thanks for your feedback - Chitrahaar Films',
        html: `
          <h2>Thank you for your feedback</h2>
          <p>Hi ${name},</p>
          <p>We appreciate you taking the time to share your thoughts. We'll review your feedback and get back to you if needed.</p>
          <p>Best,<br/>Chitrahaar Films Team</p>
        `,
      });
    }

    return res.status(200).json({ success: true, message: 'Feedback submitted' });
  } catch (error) {
    console.error('Feedback error:', error);
    return res.status(500).json({ error: 'Failed to submit feedback' });
  }
}
