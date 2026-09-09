import mongoose, { Schema, Document } from 'mongoose';
import { InAppNotification } from '../types';

export interface NotificationDocument extends Document, Omit<InAppNotification, 'id'> {
  notificationId: string;
}

const NotificationSchema = new Schema(
  {
    notificationId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    recipientRole: {
      type: String,
      enum: ['patient', 'pharmacist', 'superadmin', 'all'],
      default: 'all'
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['order_update', 'escrow_release', 'audit_alert', 'system_event', 'refill_reminder'],
      default: 'order_update'
    },
    read: { type: Boolean, default: false },
    actionUrl: { type: String }
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<NotificationDocument>('Notification', NotificationSchema);
