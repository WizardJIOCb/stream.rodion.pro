import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getEnv } from '../env.js';
import { getDb } from '../db/connection.js';
import { adminSessions } from '../db/schema.js';
import { eq, and, gt } from 'drizzle-orm';
import crypto from 'crypto';

export interface AdminRequest extends Request {
  adminSessionId?: number;
}

export async function requireAdmin(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.admin_token;
    if (!token) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'No auth token' } });
      return;
    }

    const env = getEnv();
    const payload = jwt.verify(token, env.JWT_SECRET) as { sessionId: number };

    const db = getDb();
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const sessions = await db
      .select()
      .from(adminSessions)
      .where(
        and(
          eq(adminSessions.id, payload.sessionId),
          eq(adminSessions.tokenHash, tokenHash),
          eq(adminSessions.isRevoked, false),
          gt(adminSessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (sessions.length === 0) {
      res.status(401).json({ error: { code: 'SESSION_EXPIRED', message: 'Session invalid or expired' } });
      return;
    }

    req.adminSessionId = payload.sessionId;
    next();
  } catch {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });
  }
}
