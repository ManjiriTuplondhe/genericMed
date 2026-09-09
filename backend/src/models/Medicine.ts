import mongoose, { Schema, Document } from 'mongoose';
import { Medicine } from '../types';

export interface MedicineDocument extends Document, Omit<Medicine, 'id'> {
  medicineId: string;
}

const MedicineSchema = new Schema(
  {
    medicineId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    genericName: { type: String, required: true },
    brandName: { type: String, required: true },
    brandManufacturer: { type: String, required: true },
    dosage: { type: String, required: true },
    packageDescription: { type: String, required: true },
    category: { type: String, required: true, index: true },
    rxType: { type: String, required: true },
    bioequivalentRating: { type: String, required: true },
    brandPrice: { type: Number, required: true },
    lowestPrice: { type: Number, required: true },
    savingsPercent: { type: Number, required: true },
    savingsAmount: { type: Number, required: true },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 },
    pharmacyCount: { type: Number, default: 1 },
    imageUrl: { type: String, default: '' },
    description: { type: String, required: true },
    ndc: { type: String, required: true, index: true },
    fdaApproved: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const MedicineModel = mongoose.model<MedicineDocument>('Medicine', MedicineSchema);
