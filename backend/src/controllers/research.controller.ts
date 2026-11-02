import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { ResearchPaper } from '../models/ResearchPaper';
import { logAudit } from '../utils/auditLogger';

export const getPublicPapers = async (req: Request, res: Response) => {
  try {
    const { year, search } = req.query;
    const filter: any = { isPublished: true };
    if (year) filter.year = Number(year);
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { authors: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    const papers = await ResearchPaper.find(filter).sort({ year: -1, createdAt: -1 });
    return res.status(200).json({ success: true, data: papers });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPapers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const papers = await ResearchPaper.find().sort({ year: -1, createdAt: -1 });
    return res.status(200).json({ success: true, data: papers });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPaper = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, authors, venue, year, abstract, paperUrl, doi, isPublished } = req.body;

    if (!title || !authors || !venue || !year) {
      return res.status(400).json({
        success: false,
        message: 'Title, authors, venue, and year are required',
      });
    }

    const paper = await ResearchPaper.create({
      title: title.trim(),
      authors: Array.isArray(authors) ? authors : [authors],
      venue: venue.trim(),
      year: Number(year),
      abstract: abstract || '',
      paperUrl: paperUrl || '',
      doi: doi || '',
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    await logAudit(req, 'CREATE', 'research_papers', (paper._id as any).toString(), { title });

    return res.status(201).json({
      success: true,
      message: 'Research paper published successfully',
      data: paper,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePaper = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, authors, venue, year, abstract, paperUrl, doi, isPublished } = req.body;

    const paper = await ResearchPaper.findById(id);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Research paper not found' });
    }

    if (title) paper.title = title.trim();
    if (authors) paper.authors = Array.isArray(authors) ? authors : [authors];
    if (venue) paper.venue = venue.trim();
    if (year) paper.year = Number(year);
    if (abstract !== undefined) paper.abstract = abstract;
    if (paperUrl !== undefined) paper.paperUrl = paperUrl;
    if (doi !== undefined) paper.doi = doi;
    if (isPublished !== undefined) paper.isPublished = isPublished;

    await paper.save();
    await logAudit(req, 'UPDATE', 'research_papers', id, { title: paper.title });

    return res.status(200).json({
      success: true,
      message: 'Research paper updated',
      data: paper,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePaper = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const paper = await ResearchPaper.findById(id);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Research paper not found' });
    }

    await ResearchPaper.findByIdAndDelete(id);
    await logAudit(req, 'DELETE', 'research_papers', id, { title: paper.title });

    return res.status(200).json({
      success: true,
      message: 'Research paper removed',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

