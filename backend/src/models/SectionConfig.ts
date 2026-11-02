import { Schema, model, Document } from 'mongoose';

export interface ISectionConfig extends Document {
  sectionKey: string;
  title: string;
  subtitle: string;
  orderIndex: number;
  isVisible: boolean;
  page: string;
  createdAt: Date;
  updatedAt: Date;
}

const SectionConfigSchema = new Schema<ISectionConfig>(
  {
    sectionKey: { type: String, required: true, unique: true, trim: true },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    orderIndex: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    page: { type: String, default: 'home' },
  },
  { timestamps: true }
);

export const SectionConfig = model<ISectionConfig>('SectionConfig', SectionConfigSchema);

