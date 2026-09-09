import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

// GET /api/dev/credentials - List API keys
router.get('/credentials', (_req: Request, res: Response) => {
  const creds = db.getApiCredentials();
  res.json({
    data: creds,
    total: creds.length
  });
});

// POST /api/dev/credentials - Generate new API key
router.post('/credentials', (req: Request, res: Response) => {
  const { label, scopes, isSandbox } = req.body;

  if (!label || !Array.isArray(scopes) || scopes.length === 0) {
    res.status(400).json({
      error: 'Label and at least one scope are required to generate an API key.',
      code: 'INVALID_CREDENTIAL_DATA'
    });
    return;
  }

  const newCred = db.createApiCredential(label, scopes, Boolean(isSandbox));
  res.status(201).json({
    success: true,
    data: newCred
  });
});

// GET /api/dev/webhooks - List webhook dispatch history
router.get('/webhooks', (_req: Request, res: Response) => {
  const webhooks = db.getWebhookEvents();
  res.json({
    data: webhooks,
    total: webhooks.length
  });
});

export default router;
