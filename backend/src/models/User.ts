import { Schema, model, Document, Types } from 'mongoose';
import { IRole } from './Role';

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  name: string;
  roleId?: Types.ObjectId | IRole;
  isSuperAdmin: boolean;
  isActive: boolean;
  avatar?: string;
  phone?: string;
  department?: string;
  membershipId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    roleId: { type: Schema.Types.ObjectId, ref: 'Role' },
    isSuperAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    department: { type: String, default: '' },
    membershipId: { type: String, default: '' },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);

