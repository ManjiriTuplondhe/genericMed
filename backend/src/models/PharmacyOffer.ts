import mongoose, { Schema, Document } from 'mongoose';
import { PharmacyOffer } from '../types';

export interface PharmacyOfferDocument extends Document, Omit<PharmacyOffer, 'id'> {
  offerId: string;
}

const PharmacyOfferSchema = new Schema(
  {
    offerId: { type: String, required: true, unique: true, index: true },
    medicineId: { type: String, required: true, index: true },
    pharmacyName: { type: String, required: true },
    nodeId: { type: String, required: true },
    subtitle: { type: String },
    rating: { type: Number, default: 4.8 },
    auditCount: { type: Number, default: 0 },
    distanceMiles: { type: Number, default: 0 },
    price: { type: Number, required: true },
    brandBenchmarkPrice: { type: Number, required: true },
    savingsAmount: { type: Number, required: true },
    platformFee: { type: String, default: '$1.50' },
    deliveryEstimate: { type: String, default: '45 mins' },
    slaMinutes: { type: Number, default: 45 },
    slaBadge: { type: String, default: 'Express SLA' },
    inStock: { type: Boolean, default: true },
    stockCountVerified: { type: Number, default: 50 },
    tagBadge: { type: String },
    badgeType: {
      type: String,
      enum: ['best-match', 'fastest', 'standard'],
      default: 'standard'
    },
    isOutOfStock: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const PharmacyOfferModel = mongoose.model<PharmacyOfferDocument>('PharmacyOffer', PharmacyOfferSchema);
