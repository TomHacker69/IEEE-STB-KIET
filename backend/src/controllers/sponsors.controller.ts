import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Sponsor } from '../models/Sponsor';
import { logAudit } from '../utils/auditLogger';

export const getPublicSponsors = async (req: Request, res: Response) => {
  try {
    const sponsors = await Sponsor.find({ isActive: true }).sort({ orderIndex: 1, name: 1 });
    return res.status(200).json({ success: true, data: sponsors });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllSponsors = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sponsors = await Sponsor.find().sort({ orderIndex: 1, name: 1 });
    return res.status(200).json({ success: true, data: sponsors });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createSponsor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, logoUrl, websiteUrl, tier, orderIndex, isActive } = req.body;

    if (!name || !logoUrl) {
      return res.status(400).json({ success: false, message: 'Name and logoUrl are required' });
    }

    const sponsor = await Sponsor.create({
      name: name.trim(),
      logoUrl,
      websiteUrl: websiteUrl || '',
      tier: tier || 'partner',
      orderIndex: orderIndex ?? 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await logAudit(req, 'CREATE', 'sponsors', (sponsor._id as any).toString(), { name });

    return res.status(201).json({
      success: true,
      message: 'Sponsor created successfully',
      data: sponsor,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSponsor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, logoUrl, websiteUrl, tier, orderIndex, isActive } = req.body;

    const sponsor = await Sponsor.findById(id);
    if (!sponsor) {
      return res.status(404).json({ success: false, message: 'Sponsor not found' });
    }

    if (name) sponsor.name = name.trim();
    if (logoUrl) sponsor.logoUrl = logoUrl;
    if (websiteUrl !== undefined) sponsor.websiteUrl = websiteUrl;
    if (tier !== undefined) sponsor.tier = tier;
    if (orderIndex !== undefined) sponsor.orderIndex = orderIndex;
    if (isActive !== undefined) sponsor.isActive = isActive;

    await sponsor.save();
    await logAudit(req, 'UPDATE', 'sponsors', id, { name: sponsor.name });

    return res.status(200).json({
      success: true,
      message: 'Sponsor updated successfully',
      data: sponsor,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSponsor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const sponsor = await Sponsor.findById(id);
    if (!sponsor) {
      return res.status(404).json({ success: false, message: 'Sponsor not found' });
    }

    await Sponsor.findByIdAndDelete(id);
    await logAudit(req, 'DELETE', 'sponsors', id, { name: sponsor.name });

    return res.status(200).json({
      success: true,
      message: 'Sponsor removed',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

