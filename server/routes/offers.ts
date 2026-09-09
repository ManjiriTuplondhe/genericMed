import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router({ mergeParams: true });

// GET /api/medicines/:id/offers
router.get('/:id/offers', (req: Request, res: Response) => {
  const medicineId = req.params.id;
  const medicine = db.getMedicineById(medicineId);

  if (!medicine) {
    res.status(404).json({
      error: `Medicine with ID '${medicineId}' was not found.`,
      code: 'MEDICINE_NOT_FOUND'
    });
    return;
  }

  const offers = db.getOffersForMedicine(medicineId);
  res.json({
    medicineId,
    medicineName: medicine.name,
    data: offers,
    total: offers.length
  });
});

export default router;
