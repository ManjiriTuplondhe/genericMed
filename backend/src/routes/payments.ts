import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const paymentsRouter = Router();

// POST /api/payments/process
paymentsRouter.post('/process', (req: Request, res: Response) => {
  try {
    const { orderId, amount, paymentMethod, cardLast4 } = req.body;
    if (!orderId || amount === undefined || !paymentMethod) {
      return res.status(400).json({ error: 'orderId, amount, and paymentMethod are required' });
    }

    const payment = db.processPayment(orderId, Number(amount), paymentMethod, cardLast4);
    res.status(201).json({
      success: true,
      message: 'Payment processed and held in escrow pending pharmacist dispatch verification',
      payment
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Payment processing failed' });
  }
});

// GET /api/payments/receipt/:orderId
paymentsRouter.get('/receipt/:orderId', (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const receipt = db.getReceipt(orderId);
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found for specified orderId' });
    }
    res.json(receipt);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Receipt retrieval failed' });
  }
});

// POST /api/payments/refund
paymentsRouter.post('/refund', (req: Request, res: Response) => {
  try {
    const { orderId, reason } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required for refund' });
    }
    const result = db.processRefund(orderId, reason || 'Patient requested order cancellation before dispensing');
    if (!result.success) {
      return res.status(404).json({ error: result.message });
    }
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Refund processing failed' });
  }
});
