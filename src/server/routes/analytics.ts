import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { getDb } from '../db/connection.js';
import { analyticsEvents } from '../db/schema.js';
import { analyticsLimiter } from '../middleware/rate-limit.js';

const router = Router();

const eventSchema = z.object({
  eventType: z.string().min(1).max(50),
  eventMeta: z.record(z.unknown()).optional(),
});

// POST /api/analytics/event
router.post('/event', analyticsLimiter, async (req, res) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'Invalid event' } });
    return;
  }

  const ipHash = req.ip
    ? crypto.createHash('sha256').update(req.ip).digest('hex').slice(0, 16)
    : null;

  const db = getDb();
  await db.insert(analyticsEvents).values({
    eventType: parsed.data.eventType,
    eventMeta: parsed.data.eventMeta || {},
    ipHash,
  });

  res.json({ data: { ok: true } });
});

export default router;
