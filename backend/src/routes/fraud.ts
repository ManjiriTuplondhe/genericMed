import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

// GET /api/fraud/alerts - List active fraud detection and DEA velocity alerts
router.get('/alerts', (req: Request, res: Response) => {
  try {
    const alerts = db.getFraudAlerts();
    res.json({
      success: true,
      total: alerts.length,
      alerts
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch fraud alerts' });
  }
});

// POST /api/fraud/evaluate - Evaluate real-time checkout risk score and DEA velocity
router.post('/evaluate', (req: Request, res: Response) => {
  try {
    const { patientId, orderItems, shippingAddress, prescriberNpi } = req.body;
    if (!orderItems || !Array.isArray(orderItems)) {
      return res.status(400).json({ error: 'orderItems array is required' });
    }

    const evaluation = db.evaluateOrderRisk({
      patientId,
      orderItems,
      shippingAddress,
      prescriberNpi
    });

    res.json({
      success: true,
      ...evaluation
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
