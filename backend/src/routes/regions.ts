import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

// GET /api/regions/status - Global multi-region replication status & cluster topology
router.get('/status', (req: Request, res: Response) => {
  try {
    const status = db.getMultiRegionStatus();
    res.json({
      success: true,
      ...status
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch regional cluster status' });
  }
});

// POST /api/regions/simulate-failover - Trigger automated disaster recovery failover
router.post('/simulate-failover', (req: Request, res: Response) => {
  try {
    const { targetRegionId } = req.body;
    if (!targetRegionId) {
      return res.status(400).json({ error: 'targetRegionId is required (e.g. us-west-2, us-central-1)' });
    }

    const result = db.simulateRegionFailover(targetRegionId);
    res.json({
      success: true,
      message: `Disaster recovery election successful. ${result.newLeader} promoted to Primary Leader in ${result.failoverDurationMs}ms.`,
      ...result
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
