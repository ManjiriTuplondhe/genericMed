import mongoose, { Schema, Document } from 'mongoose';
import { UserAccount } from '../db';

export interface UserDocument extends Document, Omit<UserAccount, 'id'> {
  userId: string;
}

const UserSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ['patient', 'pharmacist', 'superadmin', 'guest'],
      required: true
    },
    passwordHash: { type: String },
    tenantId: { type: String, index: true },
    organizationName: { type: String },
    avatarUrl: { type: String },
    npiNumber: { type: String },
    licenseNumber: { type: String }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
