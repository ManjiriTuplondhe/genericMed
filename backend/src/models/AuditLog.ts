import mongoose, { Schema, Document } from 'mongoose';
import { Sec18AuditLog } from '../types';

export interface AuditLogDocument extends Document, Omit<Sec18AuditLog, 'id'> {
  logId: string;
}

const AuditLogSchema = new Schema(
  {
    logId: { type: String, required: true, unique: true, index: true },
    timestampUtc: { type: String, required: true },
    type: {
      type: String,
      enum: ['TENANT ISOLATION AUDIT', 'GLOBAL NDC SYNC', 'COMMISSION SETTLEMENT RUN', 'SLA GUARD BREACH', 'SECURITY / AUDIT EVENT'],
      required: true
    },
    summary: { type: String, required: true },
    actorOrTarget: { type: String, required: true },
    sha256: { type: String, required: true },
    statusBadge: { type: String, default: 'COMPLIANT' },
    badgeStyle: {
      type: String,
      enum: ['success', 'info', 'primary', 'warning', 'neutral'],
      default: 'success'
    }
  },
  { timestamps: true }
);

export const AuditLogModel = mongoose.model<AuditLogDocument>('AuditLog', AuditLogSchema);
