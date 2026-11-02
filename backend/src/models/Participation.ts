import { Schema, model, Document, Types } from 'mongoose';

export interface IParticipation extends Document {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  role: 'attendee' | 'organizer' | 'speaker' | 'volunteer';
  certificateId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipationSchema = new Schema<IParticipation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    role: {
      type: String,
      enum: ['attendee', 'organizer', 'speaker', 'volunteer'],
      default: 'attendee',
    },
    certificateId: { type: Schema.Types.ObjectId, ref: 'Certificate' },
  },
  { timestamps: true }
);

ParticipationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

export const Participation = model<IParticipation>('Participation', ParticipationSchema);

