import { Router, Response } from 'express';
import { db } from '../db';
import { PartnerOrder } from '../types';
import { TenantRequest, tenantScopeMiddleware } from '../middleware/tenantScope';

const router = Router();

router.use(tenantScopeMiddleware);

// GET /api/partner/orders - Fetch partner dispensing order queue
router.get('/orders', (req: TenantRequest, res: Response) => {
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  let orders = db.getOrders(req.tenantId);

  if (status && status !== 'all') {
    orders = orders.filter((o) => o.status.toLowerCase() === status.toLowerCase() || o.urgency === status);
  }

  res.json({
    tenantId: req.tenantId || 'all_nodes',
    data: orders,
    total: orders.length,
    activeDispensingCount: orders.filter((o) => o.status === 'Needs Dispensing').length
  });
});

// PATCH /api/partner/orders/:id/status - Update dispensing status
router.patch('/orders/:id/status', (req: TenantRequest, res: Response) => {
  const { status } = req.body as { status: PartnerOrder['status'] };

  if (!status) {
    res.status(400).json({
      error: "Missing required 'status' field in request body.",
      code: 'MISSING_STATUS'
    });
    return;
  }

  const updatedOrder = db.updateOrderStatus(req.params.id, status);

  if (!updatedOrder) {
    res.status(404).json({
      error: `Order with ID '${req.params.id}' was not found.`,
      code: 'ORDER_NOT_FOUND'
    });
    return;
  }

  res.json({
    success: true,
    message: `Order status transitioned to '${status}'.`,
    data: updatedOrder
  });
});

// PATCH /api/partner/orders/:id/scan-item - Verify barcode scan for order item
router.patch('/orders/:id/scan-item', (req: TenantRequest, res: Response) => {
  const { sku } = req.body as { sku: string };

  if (!sku) {
    res.status(400).json({
      error: "Missing required 'sku' in request body.",
      code: 'MISSING_SKU'
    });
    return;
  }

  const updatedOrder = db.scanOrderItem(req.params.id, sku);

  if (!updatedOrder) {
    res.status(404).json({
      error: `Order with ID '${req.params.id}' was not found.`,
      code: 'ORDER_NOT_FOUND'
    });
    return;
  }

  res.json({
    success: true,
    message: `Item barcode verified for SKU: ${sku}`,
    data: updatedOrder
  });
});

export default router;
