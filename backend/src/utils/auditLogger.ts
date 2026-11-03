import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { AuditLog } from '../models/AuditLog';

export const logAudit = async (
  req: AuthenticatedRequest,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'LOGIN' | 'TOGGLE_DRIVE',
  section: string,
  resourceId?: string,
  details?: Record<string, any>
) => {
  try {
    const user = req.user;
    const ipAddress =
      (req.headers && (req.headers['x-forwarded-for'] as string)) ||
      (req.socket && req.socket.remoteAddress) ||
      '';

    await AuditLog.create({
      userId: user?._id,
      userEmail: user?.email || 'anonymous@ieee.org',
      userName: user?.name || 'System User',
      action,
      section,
      resourceId: resourceId || '',
      details: details || {},
      ipAddress,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};

