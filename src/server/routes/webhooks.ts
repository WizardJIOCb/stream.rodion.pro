import { Router } from 'express';

const router = Router();

// Stub for future Kick webhook processing
// POST /api/webhooks/kick
router.post('/kick', async (req, res) => {
  // TODO: Phase 3+ — implement signature validation and event processing
  // const signature = req.headers['kick-event-signature'];
  // const messageId = req.headers['kick-event-message-id'];
  res.status(200).json({ received: true });
});

export default router;
