import mongoose, { Schema, Document } from 'mongoose';
import { TenantOrg } from '../types';

export interface TenantDocument extends Document, Omit<TenantOrg, 'id'> {
  tenantId: string;
}

const TenantSchema = new Schema(
  {
    tenantId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    dba: { type: String },
    tier: {
      type: String,
      enum: ['Enterprise Health System', 'Regional Multi-Site', 'Independent Partner', 'Specialty Dispensary'],
      default: 'Independent Partner'
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ONBOARDING', 'AUDIT_PENDING', 'SUSPENDED'],
      default: 'ACTIVE'
    },
    stateLicenses: [{ type: String }],
    deaRegistrationNumber: { type: String },
    shard: { type: String, default: 'us-east-shard-01' },
    replicaLag: { type: String, default: '0.4ms' },
    monthlyOrders: { type: Number, default: 0 },
    monthlyVolumeText: { type: String, default: '$0' },
    slaRate: { type: Number, default: 99.8 },
    complianceStatus: {
      type: String,
      enum: ['HIPAA & DEA Validated', 'Verified', 'SLA Warning', 'DEA Under Review'],
      default: 'Verified'
    },
    nodeHealthPercent: { type: Number, default: 100 },
    healthStatus: {
      type: String,
      enum: ['OK', 'PROBATION', 'IN-FLIGHT'],
      default: 'OK'
    }
  },
  { timestamps: true }
);

export const TenantModel = mongoose.model<TenantDocument>('Tenant', TenantSchema);
