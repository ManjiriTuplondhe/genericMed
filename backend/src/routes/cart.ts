import { Router, Request, Response } from 'express';
import { db } from '../db';
import { CartItem } from '../types';
import { WebhookService } from '../services/webhook';

const router = Router();

// POST /api/cart/validate - Revalidate cart pricing against latest inventory and benchmark
router.post('/validate', (req: Request, res: Response) => {
  const items: CartItem[] = req.body.items;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({
      error: 'Cart validation requires a non-empty array of items.',
      code: 'INVALID_CART_PAYLOAD'
    });
    return;
  }

  const result = db.validateCartItems(items);

  // Trigger real-time price revalidation webhook event
  WebhookService.dispatchEvent('price.revalidated', `Cart #${Math.floor(1000 + Math.random() * 9000)}`);

  res.json({
    validated: true,
    revalidatedAt: new Date().toISOString(),
    items: result.items,
    subtotal: result.subtotal,
    totalSavings: result.totalSavings,
    message: 'Prices successfully revalidated with live pharmacy network.'
  });
});

export default router;
