import { Schema, model, Document, Types } from 'mongoose';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface IMembershipApplication extends Document {
  driveId: Types.ObjectId;
  userId?: Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  collegeId: string;
  department: string;
  yearOfStudy: string;
  domainInterests: string[];
  statementOfPurpose?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  reviewedBy?: Types.ObjectId;
  reviewRemarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipApplicationSchema = new Schema<IMembershipApplication>(
  {
    driveId: { type: Schema.Types.ObjectId, ref: 'MembershipDrive', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    collegeId: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    yearOfStudy: { type: String, required: true },
    domainInterests: { type: [String], default: [] },
    statementOfPurpose: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewRemarks: { type: String, default: '' },
  },
  { timestamps: true }
);

export const MembershipApplication = model<IMembershipApplication>(
  'MembershipApplication',
  MembershipApplicationSchema
);

