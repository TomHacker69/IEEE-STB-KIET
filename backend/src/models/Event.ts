import { Schema, model, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  coverImage: string;
  eventDate: Date;
  endDate?: Date;
  venue: string;
  mode: 'online' | 'offline' | 'hybrid';
  registrationLink?: string;
  status: 'upcoming' | 'ongoing' | 'past';
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    coverImage: { type: String, default: '' },
    eventDate: { type: Date, required: true, index: true },
    endDate: { type: Date },
    venue: { type: String, default: 'Campus Auditorium' },
    mode: { type: String, enum: ['online', 'offline', 'hybrid'], default: 'offline' },
    registrationLink: { type: String, default: '' },
    status: { type: String, enum: ['upcoming', 'ongoing', 'past'], default: 'upcoming', index: true },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Event = model<IEvent>('Event', EventSchema);

