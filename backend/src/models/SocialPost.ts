import { Schema, model, Document } from 'mongoose';

export interface ISocialPost extends Document {
  caption: string;
  imageUrl: string;
  postUrl: string;
  platform: 'instagram' | 'linkedin' | 'x' | 'facebook' | 'other';
  postedAt: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SocialPostSchema = new Schema<ISocialPost>(
  {
    caption: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    postUrl: { type: String, required: true, trim: true },
    platform: {
      type: String,
      enum: ['instagram', 'linkedin', 'x', 'facebook', 'other'],
      default: 'instagram',
    },
    postedAt: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const SocialPost = model<ISocialPost>('SocialPost', SocialPostSchema);

