import { Schema, model, Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  userId?: Types.ObjectId;
  userEmail: string;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'LOGIN' | 'TOGGLE_DRIVE';
  section: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    action: {
      type: String,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'LOGIN', 'TOGGLE_DRIVE'],
      required: true,
      index: true,
    },
    section: { type: String, required: true, index: true },
    resourceId: { type: String, default: '' },
    details: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const AuditLog = model<IAuditLog>('AuditLog', AuditLogSchema);

