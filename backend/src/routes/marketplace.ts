import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

// GET /api/marketplace/adapters - List all PMS integrations & status
router.get('/adapters', (req: Request, res: Response) => {
  try {
    const adapters = db.getMarketplaceAdapters();
    res.json({
      success: true,
      total: adapters.length,
      adapters
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch marketplace adapters' });
  }
});

// GET /api/marketplace/adapters/:id - Get single PMS adapter detail
router.get('/adapters/:id', (req: Request, res: Response) => {
  try {
    const adapter = db.getMarketplaceAdapter(req.params.id);
    if (!adapter) {
      return res.status(404).json({ error: `Adapter ${req.params.id} not found` });
    }
    res.json({ success: true, adapter });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/marketplace/adapters/:id/configure - Save PMS connection credentials
router.post('/adapters/:id/configure', (req: Request, res: Response) => {
  try {
    const { apiUrl, authMethod, autoSyncEnabled, syncIntervalMinutes } = req.body;
    const updated = db.configureMarketplaceAdapter(req.params.id, {
      apiUrl,
      authMethod,
      autoSyncEnabled,
      syncIntervalMinutes
    });
    res.json({
      success: true,
      message: `Adapter ${updated.name} successfully configured and connected.`,
      adapter: updated
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/marketplace/adapters/:id/sync - Trigger on-demand PMS inventory/dispensing sync
router.post('/adapters/:id/sync', (req: Request, res: Response) => {
  try {
    const result = db.syncMarketplaceAdapter(req.params.id);
    res.json({
      success: true,
      message: `Synchronized ${result.syncedItems} verified NDC stock records from ${result.adapter.vendor}.`,
      adapter: result.adapter,
      syncedItems: result.syncedItems
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
