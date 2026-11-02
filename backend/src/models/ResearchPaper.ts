import { Schema, model, Document } from 'mongoose';

export interface IResearchPaper extends Document {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  abstract?: string;
  paperUrl?: string;
  doi?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResearchPaperSchema = new Schema<IResearchPaper>(
  {
    title: { type: String, required: true, trim: true },
    authors: { type: [String], required: true },
    venue: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    abstract: { type: String, default: '' },
    paperUrl: { type: String, default: '' },
    doi: { type: String, default: '' },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const ResearchPaper = model<IResearchPaper>('ResearchPaper', ResearchPaperSchema);

