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

// GET /api/admin/analytics - Platform performance and financial time-series analytics
router.get('/analytics', (req: Request, res: Response) => {
  try {
    const timeframe = (req.query.timeframe as '7d' | '30d' | '90d') || '30d';
    const analytics = db.getPlatformAnalytics(timeframe);
    res.json({
      success: true,
      data: analytics
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate analytics' });
  }
});

// POST /api/admin/tenants/onboard - Self-serve pharmacy tenant onboarding
router.post('/tenants/onboard', (req: Request, res: Response) => {
  try {
    const {
      organizationName,
      dbaName,
      stateLicenseNumber,
      deaRegistrationNumber,
      primaryContactName,
      primaryContactEmail,
      primaryContactPhone,
      pharmacistInChargeNpi,
      tier,
      deliveryRadiusMiles,
      expressSlaMinutes,
      webhookNotificationUrl
    } = req.body;

    if (!organizationName || !stateLicenseNumber || !deaRegistrationNumber || !pharmacistInChargeNpi) {
      return res.status(400).json({
        error: 'Missing required credentials. Organization Name, State License, DEA #, and Pharmacist NPI are required.'
      });
    }

    const result = db.onboardTenant({
      organizationName,
      dbaName,
      stateLicenseNumber,
      deaRegistrationNumber,
      primaryContactName: primaryContactName || 'Primary Pharmacist',
      primaryContactEmail: primaryContactEmail || 'admin@pharmacy.com',
      primaryContactPhone: primaryContactPhone || '(555) 000-0000',
      pharmacistInChargeNpi,
      tier: tier || 'Standard Partner',
      deliveryRadiusMiles: Number(deliveryRadiusMiles) || 10,
      expressSlaMinutes: Number(expressSlaMinutes) || 120,
      webhookNotificationUrl
    });

    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Tenant onboarding failed' });
  }
});

export default router;
