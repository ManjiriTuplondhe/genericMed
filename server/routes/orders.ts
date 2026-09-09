import { Router, Response } from 'express';
import { db } from '../db';
import { optionalAuthenticateToken, AuthRequest } from '../middleware/auth';
import { CartItem } from '../../src/types';

const router = Router();

// POST /api/orders - Place a new patient order
router.post('/', optionalAuthenticateToken, (req: AuthRequest, res: Response) => {
  const { items, patientName, patientAddress, prescriberName, prescriberNpi } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({
      error: 'Cannot create an order with empty items.',
      code: 'EMPTY_ORDER'
    });
    return;
  }

  const name = patientName || req.user?.name || 'Verified Patient';

  const newOrder = db.createOrder({
    patientName: name,
    patientAddress,
    items: items as CartItem[],
    prescriberName,
    prescriberNpi
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully and routed to nearest dispensary node.',
    data: newOrder
  });
});

// GET /api/orders - Get orders list
router.get('/', optionalAuthenticateToken, (_req: AuthRequest, res: Response) => {
  const orders = db.getOrders();
  res.json({
    data: orders,
    total: orders.length
  });
});

// GET /api/orders/:id - Get order details
router.get('/:id', (req: AuthRequest, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    res.status(404).json({
      error: `Order with ID '${req.params.id}' not found.`,
      code: 'ORDER_NOT_FOUND'
    });
    return;
  }
  res.json({ data: order });
});

export default router;
