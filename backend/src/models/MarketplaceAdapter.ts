import mongoose, { Schema, Document } from 'mongoose';
import { PharmacyMarketplaceAdapter } from '../types';

export interface MarketplaceAdapterDocument extends Document, Omit<PharmacyMarketplaceAdapter, 'id'> {
  adapterId: string;
}

const MarketplaceAdapterSchema = new Schema(
  {
    adapterId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    vendor: { type: String, required: true },
    version: { type: String, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ['CONNECTED', 'DEGRADED', 'DISABLED', 'SYNCING'],
      default: 'CONNECTED'
    },
    description: { type: String, required: true },
    icon: { type: String, default: 'sync' },
    lastSyncTimestamp: { type: String },
    inventoryCountSynced: { type: Number, default: 0 },
    features: [{ type: String }],
    protocol: { type: String, default: 'REST / HTTPS' },
    config: {
      apiUrl: { type: String },
      authMethod: { type: String },
      autoSyncEnabled: { type: Boolean, default: true },
      syncIntervalMinutes: { type: Number, default: 5 }
    }
  },
  { timestamps: true }
);

export const MarketplaceAdapterModel = mongoose.model<MarketplaceAdapterDocument>('MarketplaceAdapter', MarketplaceAdapterSchema);
