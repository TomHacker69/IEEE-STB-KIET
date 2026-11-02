import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { SectionConfig } from '../models/SectionConfig';
import { logAudit } from '../utils/auditLogger';

export const listSections = async (req: Request, res: Response) => {
  try {
    const { page } = req.query;
    const filter: any = {};
    if (page) filter.page = page;

    const sections = await SectionConfig.find(filter).sort({ orderIndex: 1 });
    return res.status(200).json({ success: true, data: sections });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createSection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sectionKey, title, subtitle, orderIndex, isVisible, page } = req.body;

    if (!sectionKey) {
      return res.status(400).json({ success: false, message: 'sectionKey is required' });
    }

    const existing = await SectionConfig.findOne({ sectionKey });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Section key already exists' });
    }

    const section = await SectionConfig.create({
      sectionKey,
      title: title || '',
      subtitle: subtitle || '',
      orderIndex: orderIndex ?? 0,
      isVisible: isVisible !== undefined ? isVisible : true,
      page: page || 'home',
    });

    await logAudit(req, 'CREATE', 'section_config', (section._id as any).toString(), {
      sectionKey,
    });

    return res.status(201).json({ success: true, data: section });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subtitle, orderIndex, isVisible, page } = req.body;

    const section = await SectionConfig.findById(id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section config not found' });
    }

    if (title !== undefined) section.title = title;
    if (subtitle !== undefined) section.subtitle = subtitle;
    if (orderIndex !== undefined) section.orderIndex = orderIndex;
    if (isVisible !== undefined) section.isVisible = isVisible;
    if (page !== undefined) section.page = page;

    await section.save();
    await logAudit(req, 'UPDATE', 'section_config', id, {
      sectionKey: section.sectionKey,
      isVisible: section.isVisible,
      orderIndex: section.orderIndex,
    });

    return res.status(200).json({
      success: true,
      message: 'Section configuration updated',
      data: section,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const reorderSections = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items } = req.body; // array of { id, orderIndex }
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items array is required' });
    }

    const operations = items.map((item) =>
      SectionConfig.findByIdAndUpdate(item.id, { orderIndex: item.orderIndex })
    );

    await Promise.all(operations);
    await logAudit(req, 'UPDATE', 'section_config', 'batch-reorder', { count: items.length });

    const updated = await SectionConfig.find().sort({ orderIndex: 1 });
    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

