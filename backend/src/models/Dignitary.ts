import { Schema, model, Document } from 'mongoose';

export interface IDignitary extends Document {
  name: string;
  designation: string;
  institution?: string;
  photoUrl: string;
  quote: string;
  orderIndex: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DignitarySchema = new Schema<IDignitary>(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    institution: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    quote: { type: String, default: '' },
    orderIndex: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Dignitary = model<IDignitary>('Dignitary', DignitarySchema);

