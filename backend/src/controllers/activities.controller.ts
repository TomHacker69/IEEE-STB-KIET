import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Activity } from '../models/Activity';
import { logAudit } from '../utils/auditLogger';

export const getPublicActivities = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const query = Activity.find({ isPublished: true }).sort({ date: -1 });
    if (limit) query.limit(Number(limit));

    const activities = await query.exec();
    return res.status(200).json({ success: true, data: activities });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllActivities = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const activities = await Activity.find().sort({ date: -1 });
    return res.status(200).json({ success: true, data: activities });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getActivityById = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    return res.status(200).json({ success: true, data: activity });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, images, date, tags, isPublished } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const activity = await Activity.create({
      title: title.trim(),
      description,
      images: images || [],
      date: date ? new Date(date) : new Date(),
      tags: tags || [],
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    await logAudit(req, 'CREATE', 'activities', (activity._id as any).toString(), { title });

    return res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: activity,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, images, date, tags, isPublished } = req.body;

    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    if (title) activity.title = title.trim();
    if (description) activity.description = description;
    if (images !== undefined) activity.images = images;
    if (date) activity.date = new Date(date);
    if (tags !== undefined) activity.tags = tags;
    if (isPublished !== undefined) activity.isPublished = isPublished;

    await activity.save();
    await logAudit(req, 'UPDATE', 'activities', id, { title: activity.title });

    return res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      data: activity,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    await Activity.findByIdAndDelete(id);
    await logAudit(req, 'DELETE', 'activities', id, { title: activity.title });

    return res.status(200).json({
      success: true,
      message: 'Activity deleted',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

