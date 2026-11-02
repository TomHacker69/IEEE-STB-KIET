import { Schema, model, Document } from 'mongoose';

export interface IActivity extends Document {
  title: string;
  description: string;
  images: string[];
  date: Date;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    date: { type: Date, default: Date.now },
    tags: { type: [String], default: [] },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Activity = model<IActivity>('Activity', ActivitySchema);

