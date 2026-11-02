import { Schema, model, Document, Types } from 'mongoose';

export interface ICertificate extends Document {
  userId: Types.ObjectId;
  userEmail: string;
  userName: string;
  eventId?: Types.ObjectId;
  activityId?: Types.ObjectId;
  title: string;
  certificateFileUrl: string;
  issueDate: Date;
  credentialId: string;
  uploadedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    userName: { type: String, required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    activityId: { type: Schema.Types.ObjectId, ref: 'Activity' },
    title: { type: String, required: true, trim: true },
    certificateFileUrl: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    credentialId: { type: String, required: true, unique: true, trim: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Certificate = model<ICertificate>('Certificate', CertificateSchema);

