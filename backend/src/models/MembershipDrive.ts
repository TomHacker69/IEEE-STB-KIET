import { Schema, model, Document } from 'mongoose';

export interface IMembershipDrive extends Document {
  title: string;
  description: string;
  isOpen: boolean;
  academicYear: string;
  startDate?: Date;
  endDate?: Date;
  guidelines?: string;
  departmentsAllowed: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MembershipDriveSchema = new Schema<IMembershipDrive>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    isOpen: { type: Boolean, default: false },
    academicYear: { type: String, default: '2026-2027' },
    startDate: { type: Date },
    endDate: { type: Date },
    guidelines: { type: String, default: '' },
    departmentsAllowed: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const MembershipDrive = model<IMembershipDrive>('MembershipDrive', MembershipDriveSchema);

