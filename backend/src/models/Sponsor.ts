import { Schema, model, Document } from 'mongoose';

export interface ISponsor extends Document {
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  tier: 'title' | 'platinum' | 'gold' | 'silver' | 'partner';
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SponsorSchema = new Schema<ISponsor>(
  {
    name: { type: String, required: true, trim: true },
    logoUrl: { type: String, required: true },
    websiteUrl: { type: String, default: '' },
    tier: {
      type: String,
      enum: ['title', 'platinum', 'gold', 'silver', 'partner'],
      default: 'partner',
    },
    orderIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Sponsor = model<ISponsor>('Sponsor', SponsorSchema);

