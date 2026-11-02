import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { AuditLog } from '../models/AuditLog';

export const getAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { section, action, page = 1, limit = 50 } = req.query;
    const filter: any = {};
    if (section) filter.section = section;
    if (action) filter.action = action;

    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total] = await Promise.all([
      AuditLog.find(filter).sort({ timestamp: -1 }).skip(skip).limit(Number(limit)),
      AuditLog.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

