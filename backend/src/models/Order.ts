import mongoose, { Schema, Document } from 'mongoose';
import { PartnerOrder } from '../types';

export interface OrderDocument extends Document, Omit<PartnerOrder, 'orderId'> {
  orderId: string;
  tenantId?: string;
}

const OrderItemSchema = new Schema(
  {
    sku: { type: String, required: true },
    dosage: { type: String },
    ndc: { type: String, required: true },
    lot: { type: String },
    exp: { type: String },
    quantityText: { type: String },
    binLocation: { type: String },
    scanned: { type: Boolean, default: false },
    rxRating: { type: String }
  },
  { _id: false }
);

const PrescriberSchema = new Schema(
  {
    name: { type: String, required: true },
    npi: { type: String, required: true },
    specialty: { type: String },
    hospital: { type: String },
    teleRxVerified: { type: Boolean, default: true }
  },
  { _id: false }
);

const FinancialsSchema = new Schema(
  {
    patientTotal: { type: Number, required: true },
    platformFee: { type: Number, default: 0 },
    netPayout: { type: Number, required: true }
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    patientName: { type: String, required: true },
    patientDemographics: { type: String, default: 'Age 42 • Female' },
    urgency: {
      type: String,
      enum: ['urgent-2h', 'curbside-ready', 'new-received', 'completed'],
      default: 'new-received'
    },
    status: {
      type: String,
      enum: ['Needs Dispensing', 'Ready in Locker', 'Just Received', 'Packed & Staged', 'Out for Delivery', 'Delivered & Verified', 'Cancelled & Refunded'],
      default: 'Just Received'
    },
    elapsedTime: { type: String, default: 'Just now' },
    slaTarget: { type: String, default: '45 mins remaining' },
    courierEta: { type: String },
    courierName: { type: String },
    courierVan: { type: String },
    courierStatus: { type: String },
    customerPin: { type: String },
    patientAddress: { type: String },
    claimTimerSeconds: { type: Number },
    items: [OrderItemSchema],
    prescriber: PrescriberSchema,
    financials: FinancialsSchema,
    tenantId: { type: String, index: true, default: 'org_apex_rx' }
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<OrderDocument>('Order', OrderSchema);
