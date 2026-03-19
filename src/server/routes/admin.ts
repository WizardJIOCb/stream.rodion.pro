import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { getDb } from '../db/connection.js';
import { getEnv } from '../env.js';
import { requireAdmin } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rate-limit.js';
import {
  siteSettings,
  adminSessions,
  featuredClips,
  rewardCache,
  siteFeedEvents,
  games,
  analyticsEvents,
} from '../db/schema.js';
import { eq, desc, asc } from 'drizzle-orm';

const router = Router();

// POST /api/admin/login
router.post('/login', loginLimiter, async (req, res) => {
  const schema = z.object({ password: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'Password required' } });
    return;
  }

  const env = getEnv();
  const valid = await bcrypt.compare(parsed.data.password, env.ADMIN_PASSWORD_HASH);
  if (!valid) {
    // Log failed attempt
    const db = getDb();
    await db.insert(analyticsEvents).values({
      eventType: 'admin_login_failed',
      eventMeta: { ip: req.ip },
    });
    res.status(401).json({ error: { code: 'INVALID_PASSWORD', message: 'Wrong password' } });
    return;
  }

  const db = getDb();

  // Create session
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  const token = jwt.sign({ sessionId: 0 }, env.JWT_SECRET, { expiresIn: '24h' });
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const [session] = await db
    .insert(adminSessions)
    .values({ tokenHash, expiresAt })
    .returning({ id: adminSessions.id });

  // Re-sign with actual session ID
  const finalToken = jwt.sign({ sessionId: session.id }, env.JWT_SECRET, { expiresIn: '24h' });
  const finalHash = crypto.createHash('sha256').update(finalToken).digest('hex');
  await db.update(adminSessions).set({ tokenHash: finalHash }).where(eq(adminSessions.id, session.id));

  // Log success
  await db.insert(analyticsEvents).values({
    eventType: 'admin_login',
    eventMeta: {},
  });

  res.cookie('admin_token', finalToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  });

  res.json({ data: { success: true } });
});

// POST /api/admin/logout
router.post('/logout', requireAdmin, async (req: any, res) => {
  const db = getDb();
  if (req.adminSessionId) {
    await db
      .update(adminSessions)
      .set({ isRevoked: true })
      .where(eq(adminSessions.id, req.adminSessionId));
  }
  res.clearCookie('admin_token', { path: '/' });
  res.json({ data: { success: true } });
});

// GET /api/admin/check
router.get('/check', requireAdmin, async (_req, res) => {
  res.json({ data: { authenticated: true } });
});

// POST /api/admin/state
const stateSchema = z.object({
  currentStatusMode: z.string().optional(),
  statusSource: z.string().optional(),
  manualOverrideActive: z.boolean().optional(),
  currentHookTitle: z.string().nullable().optional(),
  currentHookDescription: z.string().nullable().optional(),
  currentAnnouncement: z.string().nullable().optional(),
  currentGameSlug: z.string().nullable().optional(),
  currentFormatSlug: z.string().nullable().optional(),
  primaryCtaText: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  siteTitle: z.string().optional(),
  siteSubtitle: z.string().nullable().optional(),
});

router.post('/state', requireAdmin, async (req, res) => {
  const parsed = stateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.message } });
    return;
  }

  const db = getDb();
  const [updated] = await db
    .update(siteSettings)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(siteSettings.id, 1))
    .returning();

  res.json({ data: updated });
});

// --- Clips CRUD ---
const clipSchema = z.object({
  url: z.string().min(1),
  title: z.string().min(1),
  gameSlug: z.string().nullable().optional(),
  durationSeconds: z.number().nullable().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  viewCountSnapshot: z.number().nullable().optional(),
  publishedLabel: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

router.get('/clips', requireAdmin, async (_req, res) => {
  const db = getDb();
  const clips = await db.select().from(featuredClips).orderBy(asc(featuredClips.sortOrder));
  res.json({ data: clips });
});

router.post('/clips', requireAdmin, async (req, res) => {
  const parsed = clipSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.message } });
    return;
  }
  const db = getDb();
  const [clip] = await db.insert(featuredClips).values(parsed.data).returning();
  res.json({ data: clip });
});

router.patch('/clips/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const parsed = clipSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.message } });
    return;
  }
  const db = getDb();
  const [clip] = await db
    .update(featuredClips)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(featuredClips.id, id))
    .returning();
  if (!clip) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Clip not found' } });
    return;
  }
  res.json({ data: clip });
});

router.delete('/clips/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const db = getDb();
  const [deleted] = await db.delete(featuredClips).where(eq(featuredClips.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Clip not found' } });
    return;
  }
  res.json({ data: { success: true } });
});

// --- Rewards CRUD ---
const rewardSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  cost: z.number().min(0),
  isEnabled: z.boolean().optional(),
  isPaused: z.boolean().optional(),
  isUserInputRequired: z.boolean().optional(),
  noteForSite: z.string().nullable().optional(),
  sortOrder: z.number().optional(),
  backgroundColor: z.string().nullable().optional(),
});

router.get('/rewards', requireAdmin, async (_req, res) => {
  const db = getDb();
  const rewards = await db.select().from(rewardCache).orderBy(asc(rewardCache.sortOrder));
  res.json({ data: rewards });
});

router.post('/rewards', requireAdmin, async (req, res) => {
  const parsed = rewardSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.message } });
    return;
  }
  const db = getDb();
  const [reward] = await db.insert(rewardCache).values(parsed.data).returning();
  res.json({ data: reward });
});

router.patch('/rewards/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const parsed = rewardSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.message } });
    return;
  }
  const db = getDb();
  const [reward] = await db
    .update(rewardCache)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(rewardCache.id, id))
    .returning();
  if (!reward) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Reward not found' } });
    return;
  }
  res.json({ data: reward });
});

router.delete('/rewards/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const db = getDb();
  const [deleted] = await db.delete(rewardCache).where(eq(rewardCache.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Reward not found' } });
    return;
  }
  res.json({ data: { success: true } });
});

// --- Feed Events CRUD ---
const feedEventSchema = z.object({
  sourceType: z.string().min(1),
  title: z.string().min(1),
  body: z.record(z.unknown()).nullable().optional(),
  isPublic: z.boolean().optional(),
  isPinned: z.boolean().optional(),
});

router.get('/feed-events', requireAdmin, async (_req, res) => {
  const db = getDb();
  const events = await db.select().from(siteFeedEvents).orderBy(desc(siteFeedEvents.createdAt)).limit(50);
  res.json({ data: events });
});

router.post('/feed-events', requireAdmin, async (req, res) => {
  const parsed = feedEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.message } });
    return;
  }
  const db = getDb();
  const [event] = await db.insert(siteFeedEvents).values(parsed.data).returning();
  res.json({ data: event });
});

router.patch('/feed-events/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const parsed = feedEventSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.message } });
    return;
  }
  const db = getDb();
  const [event] = await db
    .update(siteFeedEvents)
    .set(parsed.data)
    .where(eq(siteFeedEvents.id, id))
    .returning();
  if (!event) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Event not found' } });
    return;
  }
  res.json({ data: event });
});

router.delete('/feed-events/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const db = getDb();
  const [deleted] = await db.delete(siteFeedEvents).where(eq(siteFeedEvents.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Event not found' } });
    return;
  }
  res.json({ data: { success: true } });
});

// --- Predictions CRUD (jsonb on games table) ---
const predictionsSchema = z.object({
  gameSlug: z.string().min(1),
  predictionExamples: z.array(z.string()),
});

router.get('/predictions/:gameSlug', requireAdmin, async (req, res) => {
  const db = getDb();
  const [game] = await db
    .select({ predictionExamples: games.predictionExamples, slug: games.slug })
    .from(games)
    .where(eq(games.slug, req.params.gameSlug as string))
    .limit(1);
  if (!game) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Game not found' } });
    return;
  }
  res.json({ data: game.predictionExamples || [] });
});

router.put('/predictions', requireAdmin, async (req, res) => {
  const parsed = predictionsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.message } });
    return;
  }
  const db = getDb();
  const [game] = await db
    .update(games)
    .set({ predictionExamples: parsed.data.predictionExamples, updatedAt: new Date() })
    .where(eq(games.slug, parsed.data.gameSlug))
    .returning();
  if (!game) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Game not found' } });
    return;
  }
  res.json({ data: game.predictionExamples });
});

export default router;
