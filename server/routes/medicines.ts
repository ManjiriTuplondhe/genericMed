import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

// GET /api/medicines - List all medicines with optional search and category filters
router.get('/', (req: Request, res: Response) => {
  const query = typeof req.query.q === 'string' ? req.query.q : undefined;
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;

  const medicines = db.getMedicines(query, category);
  res.json({
    data: medicines,
    total: medicines.length
  });
});

// GET /api/medicines/:id - Get specific medicine details
router.get('/:id', (req: Request, res: Response) => {
  const medicine = db.getMedicineById(req.params.id);
  if (!medicine) {
    res.status(404).json({
      error: `Medicine with ID '${req.params.id}' was not found.`,
      code: 'MEDICINE_NOT_FOUND'
    });
    return;
  }

  const offers = db.getOffersForMedicine(medicine.id);
  res.json({
    data: medicine,
    offers
  });
});

export default router;
