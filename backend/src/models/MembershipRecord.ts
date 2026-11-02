import { Schema, model, Document, Types } from 'mongoose';

export type MembershipStatus = 'active' | 'expired' | 'alumni' | 'suspended';

export interface IMembershipRecord extends Document {
  userId: Types.ObjectId;
  userEmail: string;
  userName: string;
  membershipId: string;
  startDate: Date;
  endDate: Date;
  designation: string;
  status: MembershipStatus;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipRecordSchema = new Schema<IMembershipRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    userName: { type: String, required: true },
    membershipId: { type: String, required: true, unique: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    designation: { type: String, default: 'Member' },
    status: {
      type: String,
      enum: ['active', 'expired', 'alumni', 'suspended'],
      default: 'active',
      index: true,
    },
  },
  { timestamps: true }
);

export const MembershipRecord = model<IMembershipRecord>(
  'MembershipRecord',
  MembershipRecordSchema
);

