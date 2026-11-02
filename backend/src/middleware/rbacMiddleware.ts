import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';
import { SectionPermissions } from '../models/Role';

export type PermissionAction = keyof SectionPermissions; // 'view' | 'create' | 'edit' | 'delete' | 'publish'

export const requireSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (!req.user.isSuperAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Super Admin privilege required for this operation.',
    });
  }

  next();
};

export const requirePermission = (section: string, action: PermissionAction) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Super Admin has unrestricted access to all operations
    if (req.user.isSuperAdmin) {
      return next();
    }

    const role = req.user.role;
    if (!role || !role.permissions) {
      return res.status(403).json({
        success: false,
        message: `Access denied: No administrative permissions assigned to your account.`,
      });
    }

    const sectionPerms = (role.permissions as any)[section];
    if (!sectionPerms || !sectionPerms[action]) {
      return res.status(403).json({
        success: false,
        message: `Access denied: You do not have '${action}' permission on '${section}'.`,
        required: { section, action },
      });
    }

    next();
  };
};

