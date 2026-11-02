import { Schema, model, Document } from 'mongoose';

export interface ISiteContent extends Document {
  group: string;
  key: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'image' | 'url' | 'color' | 'boolean';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    group: { type: String, required: true, trim: true, index: true },
    key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    value: { type: String, default: '' },
    type: {
      type: String,
      enum: ['text', 'textarea', 'image', 'url', 'color', 'boolean'],
      default: 'text',
    },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

SiteContentSchema.index({ group: 1, key: 1 }, { unique: true });

export const SiteContent = model<ISiteContent>('SiteContent', SiteContentSchema);

