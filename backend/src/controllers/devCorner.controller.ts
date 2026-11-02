import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { DeveloperProfile } from '../models/DeveloperProfile';
import { logAudit } from '../utils/auditLogger';

export const getPublicDevProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await DeveloperProfile.find({ isVisible: true }).sort({ orderIndex: 1 });
    return res.status(200).json({ success: true, data: profiles });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDevProfiles = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profiles = await DeveloperProfile.find().sort({ orderIndex: 1 });
    return res.status(200).json({ success: true, data: profiles });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createDevProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, role, photoUrl, story, githubUrl, linkedinUrl, portfolioUrl, orderIndex, isVisible } =
      req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const profile = await DeveloperProfile.create({
      name: name.trim(),
      role: role || 'Lead Developer',
      photoUrl: photoUrl || '',
      story: story || '',
      githubUrl: githubUrl || '',
      linkedinUrl: linkedinUrl || '',
      portfolioUrl: portfolioUrl || '',
      orderIndex: orderIndex ?? 0,
      isVisible: isVisible !== undefined ? isVisible : true,
    });

    await logAudit(req, 'CREATE', 'dev_corner', (profile._id as any).toString(), { name });

    return res.status(201).json({
      success: true,
      message: 'Developer profile created',
      data: profile,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDevProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, photoUrl, story, githubUrl, linkedinUrl, portfolioUrl, orderIndex, isVisible } =
      req.body;

    const profile = await DeveloperProfile.findById(id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    if (name) profile.name = name.trim();
    if (role !== undefined) profile.role = role;
    if (photoUrl !== undefined) profile.photoUrl = photoUrl;
    if (story !== undefined) profile.story = story;
    if (githubUrl !== undefined) profile.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;
    if (portfolioUrl !== undefined) profile.portfolioUrl = portfolioUrl;
    if (orderIndex !== undefined) profile.orderIndex = orderIndex;
    if (isVisible !== undefined) profile.isVisible = isVisible;

    await profile.save();
    await logAudit(req, 'UPDATE', 'dev_corner', id, { name: profile.name });

    return res.status(200).json({
      success: true,
      message: 'Developer profile updated',
      data: profile,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDevProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const profile = await DeveloperProfile.findById(id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    await DeveloperProfile.findByIdAndDelete(id);
    await logAudit(req, 'DELETE', 'dev_corner', id, { name: profile.name });

    return res.status(200).json({
      success: true,
      message: 'Profile removed',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

