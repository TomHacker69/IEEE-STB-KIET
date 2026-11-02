import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Dignitary } from '../models/Dignitary';
import { logAudit } from '../utils/auditLogger';

export const getPublicDignitaries = async (req: Request, res: Response) => {
  try {
    const dignitaries = await Dignitary.find({ isVisible: true }).sort({ orderIndex: 1, createdAt: 1 });
    return res.status(200).json({ success: true, data: dignitaries });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDignitaries = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dignitaries = await Dignitary.find().sort({ orderIndex: 1, createdAt: 1 });
    return res.status(200).json({ success: true, data: dignitaries });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createDignitary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, designation, institution, photoUrl, quote, orderIndex, isVisible } = req.body;

    if (!name || !designation) {
      return res.status(400).json({ success: false, message: 'Name and designation are required' });
    }

    const dignitary = await Dignitary.create({
      name: name.trim(),
      designation: designation.trim(),
      institution: institution || '',
      photoUrl: photoUrl || '',
      quote: quote || '',
      orderIndex: orderIndex ?? 0,
      isVisible: isVisible !== undefined ? isVisible : true,
    });

    await logAudit(req, 'CREATE', 'dignitaries', (dignitary._id as any).toString(), {
      name,
      designation,
    });

    return res.status(201).json({
      success: true,
      message: 'Dignitary created successfully',
      data: dignitary,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDignitary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, designation, institution, photoUrl, quote, orderIndex, isVisible } = req.body;

    const dignitary = await Dignitary.findById(id);
    if (!dignitary) {
      return res.status(404).json({ success: false, message: 'Dignitary not found' });
    }

    if (name) dignitary.name = name.trim();
    if (designation) dignitary.designation = designation.trim();
    if (institution !== undefined) dignitary.institution = institution;
    if (photoUrl !== undefined) dignitary.photoUrl = photoUrl;
    if (quote !== undefined) dignitary.quote = quote;
    if (orderIndex !== undefined) dignitary.orderIndex = orderIndex;
    if (isVisible !== undefined) dignitary.isVisible = isVisible;

    await dignitary.save();
    await logAudit(req, 'UPDATE', 'dignitaries', id, { name: dignitary.name });

    return res.status(200).json({
      success: true,
      message: 'Dignitary updated successfully',
      data: dignitary,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDignitary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const dignitary = await Dignitary.findById(id);
    if (!dignitary) {
      return res.status(404).json({ success: false, message: 'Dignitary not found' });
    }

    await Dignitary.findByIdAndDelete(id);
    await logAudit(req, 'DELETE', 'dignitaries', id, { name: dignitary.name });

    return res.status(200).json({
      success: true,
      message: 'Dignitary removed',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

