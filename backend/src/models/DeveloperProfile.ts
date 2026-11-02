import { Schema, model, Document } from 'mongoose';

export interface IDeveloperProfile extends Document {
  name: string;
  role: string;
  photoUrl: string;
  story: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  orderIndex: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DeveloperProfileSchema = new Schema<IDeveloperProfile>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: 'Lead Developer' },
    photoUrl: { type: String, default: '' },
    story: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    orderIndex: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DeveloperProfile = model<IDeveloperProfile>(
  'DeveloperProfile',
  DeveloperProfileSchema
);

