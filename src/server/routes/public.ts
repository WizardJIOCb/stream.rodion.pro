import { Router } from 'express';
import { getDb } from '../db/connection.js';
import { siteSettings, games, formats, rewardCache, featuredClips, siteFeedEvents } from '../db/schema.js';
import { eq, and, desc, asc } from 'drizzle-orm';

const router = Router();

// GET /api/public/state
router.get('/state', async (_req, res) => {
  const db = getDb();
  const [settings] = await db.select().from(siteSettings).limit(1);
  if (!settings) {
    res.json({ data: null });
    return;
  }

  let currentGame = null;
  if (settings.currentGameSlug) {
    const [game] = await db
      .select({ slug: games.slug, title: games.title, shortDescription: games.shortDescription })
      .from(games)
      .where(eq(games.slug, settings.currentGameSlug))
      .limit(1);
    currentGame = game || null;
  }

  let currentFormat = null;
  if (settings.currentFormatSlug) {
    const [format] = await db
      .select({ slug: formats.slug, title: formats.title })
      .from(formats)
      .where(eq(formats.slug, settings.currentFormatSlug))
      .limit(1);
    currentFormat = format || null;
  }

  res.json({
    data: {
      siteTitle: settings.siteTitle,
      siteSubtitle: settings.siteSubtitle,
      primaryCtaText: settings.primaryCtaText,
      secondaryCtaText: settings.secondaryCtaText,
      currentStatusMode: settings.currentStatusMode,
      statusSource: settings.statusSource,
      lastKickSyncAt: settings.lastKickSyncAt?.toISOString() || null,
      manualOverrideActive: settings.manualOverrideActive,
      currentHookTitle: settings.currentHookTitle,
      currentHookDescription: settings.currentHookDescription,
      currentAnnouncement: settings.currentAnnouncement,
      currentGame,
      currentFormat,
      updatedAt: settings.updatedAt.toISOString(),
    },
  });
});

// GET /api/public/rewards
router.get('/rewards', async (_req, res) => {
  const db = getDb();
  const rewards = await db
    .select()
    .from(rewardCache)
    .where(eq(rewardCache.isEnabled, true))
    .orderBy(asc(rewardCache.sortOrder));
  res.json({ data: rewards });
});

// GET /api/public/clips
router.get('/clips', async (_req, res) => {
  const db = getDb();
  const clips = await db
    .select()
    .from(featuredClips)
    .where(eq(featuredClips.isFeatured, true))
    .orderBy(asc(featuredClips.sortOrder));
  res.json({ data: clips });
});

// GET /api/public/feed
router.get('/feed', async (_req, res) => {
  const db = getDb();
  const events = await db
    .select()
    .from(siteFeedEvents)
    .where(eq(siteFeedEvents.isPublic, true))
    .orderBy(desc(siteFeedEvents.createdAt))
    .limit(20);
  res.json({ data: events });
});

// GET /api/public/formats
router.get('/formats', async (_req, res) => {
  const db = getDb();
  const allFormats = await db
    .select()
    .from(formats)
    .where(eq(formats.isActive, true))
    .orderBy(asc(formats.sortOrder));
  res.json({ data: allFormats });
});

// GET /api/public/games/:slug
router.get('/games/:slug', async (req, res) => {
  const db = getDb();
  const { slug } = req.params;

  const [game] = await db.select().from(games).where(eq(games.slug, slug)).limit(1);
  if (!game) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Game not found' } });
    return;
  }

  const relatedFormats = await db
    .select()
    .from(formats)
    .where(eq(formats.isActive, true))
    .orderBy(asc(formats.sortOrder));

  const relatedClips = await db
    .select()
    .from(featuredClips)
    .where(and(eq(featuredClips.gameSlug, slug), eq(featuredClips.isFeatured, true)))
    .orderBy(asc(featuredClips.sortOrder));

  res.json({
    data: {
      ...game,
      createdAt: game.createdAt.toISOString(),
      updatedAt: game.updatedAt.toISOString(),
      relatedFormats,
      relatedClips,
    },
  });
});

export default router;
