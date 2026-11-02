import { Schema, model, Document } from 'mongoose';

export type MemberTier = 'core_team' | 'regular_member' | 'content_member';

export interface IMember extends Document {
  name: string;
  designation: string;
  tier: MemberTier;
  photoUrl: string;
  quote?: string;
  email?: string;
  department?: string;
  membershipId?: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    email?: string;
  };
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema = new Schema<IMember>(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    tier: {
      type: String,
      enum: ['core_team', 'regular_member', 'content_member'],
      default: 'regular_member',
      index: true,
    },
    photoUrl: { type: String, default: '' },
    quote: { type: String, default: '' },
    email: { type: String, default: '', lowercase: true, trim: true },
    department: { type: String, default: '' },
    membershipId: { type: String, default: '' },
    socialLinks: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      twitter: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    orderIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Member = model<IMember>('Member', MemberSchema);

