import mongoose, { Schema, Document } from 'mongoose';
import { PaymentIntent } from '../types';

export interface PaymentDocument extends Document, Omit<PaymentIntent, 'id'> {
  paymentId: string;
}

const PaymentSchema = new Schema(
  {
    paymentId: { type: String, required: true, unique: true, index: true },
    orderId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['ESCROW_HOLD', 'CAPTURED', 'REFUNDED'],
      default: 'ESCROW_HOLD'
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'apple_pay', 'google_pay', 'fsa_hsa'],
      default: 'card'
    },
    last4: { type: String },
    escrowReleaseEstimatedAt: { type: String }
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model<PaymentDocument>('Payment', PaymentSchema);
