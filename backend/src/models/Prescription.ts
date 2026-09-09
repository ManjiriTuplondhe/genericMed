import mongoose, { Schema, Document } from 'mongoose';
import { PrescriptionRecord } from '../types';

export interface PrescriptionDocument extends Document, Omit<PrescriptionRecord, 'id'> {
  prescriptionId: string;
}

const PrescriptionSchema = new Schema(
  {
    prescriptionId: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    patientName: { type: String, required: true },
    patientDob: { type: String },
    brandPrescribed: { type: String },
    genericMatched: { type: String },
    medicationName: { type: String, required: true },
    genericEquivalent: { type: String, required: true },
    dosage: { type: String, required: true },
    quantity: { type: Number, required: true },
    refillsRemaining: { type: Number, default: 0 },
    prescriberName: { type: String, required: true },
    prescriberNpi: { type: String, required: true, index: true },
    prescriberClinic: { type: String },
    prescribedDate: { type: String, required: true },
    expiresDate: { type: String, required: true },
    rxNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'EXPIRED', 'PENDING_VERIFICATION', 'REJECTED'],
      default: 'ACTIVE'
    },
    verificationStatus: {
      type: String,
      enum: ['NPI_VERIFIED', 'MANUAL_REVIEW_REQUIRED', 'DEA_FLAGGED'],
      default: 'NPI_VERIFIED'
    },
    ocrConfidence: { type: Number, default: 98.4 },
    fileUrl: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

export const PrescriptionModel = mongoose.model<PrescriptionDocument>('Prescription', PrescriptionSchema);
