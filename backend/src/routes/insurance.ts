import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const insuranceRouter = Router();

// POST /api/insurance/verify
insuranceRouter.post('/verify', (req: Request, res: Response) => {
  try {
    const { memberId, groupNumber, providerName } = req.body;
    if (!memberId) {
      return res.status(400).json({ error: 'memberId is required' });
    }
    const profile = db.verifyInsurance(memberId, groupNumber, providerName);
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Insurance verification failed' });
  }
});

// POST /api/insurance/copay-calculator
insuranceRouter.post('/copay-calculator', (req: Request, res: Response) => {
  try {
    const { medicineId, planType } = req.body;
    if (!medicineId) {
      return res.status(400).json({ error: 'medicineId is required' });
    }
    const calculation = db.calculateInsuranceCopay(medicineId, planType || 'Commercial PPO');
    res.json(calculation);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Copay calculation failed' });
  }
});
