import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

// GET /api/admin/tenants - Get all tenant organizations with health and performance metrics
router.get('/tenants', (_req: Request, res: Response) => {
  const tenants = db.getTenants();
  res.json({
    data: tenants,
    total: tenants.length,
    activeNodes: tenants.filter((t) => t.healthStatus === 'OK').length
  });
});

// GET /api/admin/audit-logs - Get SEC-18 immutable compliance audit trail
router.get('/audit-logs', (_req: Request, res: Response) => {
  const logs = db.getAuditLogs();
  res.json({
    data: logs,
    total: logs.length,
    complianceStandard: 'SEC-18 / HIPAA Title II Section 164'
  });
});

export default router;
