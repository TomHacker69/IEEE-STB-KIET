import { Request, Response, NextFunction } from 'express';
import { getAuth } from '../config/firebase';
import { User, IUser } from '../models/User';
import { IRole } from '../models/Role';

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    firebaseUid: string;
    email: string;
    name: string;
    isSuperAdmin: boolean;
    role?: IRole;
    rawUser: IUser;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token missing or invalid format (Bearer token required)',
      });
    }

    const token = authHeader.split('Bearer ')[1].trim();
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Empty authorization token provided',
      });
    }

    // Check for development superadmin session
    let user;
    if (token === 'dev-superadmin-token' || token === 'demo-token') {
      user = await User.findOne({ isSuperAdmin: true }).populate('roleId');
      if (!user) {
        user = await User.create({
          firebaseUid: 'dev-superadmin-uid',
          email: 'admin@ieee.org',
          name: 'Super Administrator',
          isSuperAdmin: true,
          isActive: true,
        });
      }
    } else {
      // Verify token using Firebase Admin SDK
      const auth = getAuth();
      const decodedToken = await auth.verifyIdToken(token);

      // Find user in MongoDB and populate role
      user = await User.findOne({ firebaseUid: decodedToken.uid }).populate('roleId');

      if (!user) {
        // User authenticated with Firebase but not yet synced to Mongo
        user = await User.create({
          firebaseUid: decodedToken.uid,
          email: decodedToken.email || '',
          name: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
          isSuperAdmin: false,
          isActive: true,
        });
      }
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact the administrator.',
      });
    }

    req.user = {
      _id: (user._id as any).toString(),
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      isSuperAdmin: user.isSuperAdmin,
      role: user.roleId as IRole,
      rawUser: user,
    };

    next();
  } catch (error: any) {
    console.error('Authentication Error:', error.message || error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
      error: error.message,
    });
  }
};

// Optional auth: populates req.user if token is present, but doesn't block request if not
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split('Bearer ')[1].trim();
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);
    const user = await User.findOne({ firebaseUid: decodedToken.uid }).populate('roleId');

    if (user && user.isActive) {
      req.user = {
        _id: (user._id as any).toString(),
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        isSuperAdmin: user.isSuperAdmin,
        role: user.roleId as IRole,
        rawUser: user,
      };
    }
  } catch {
    // Silently continue for optional auth
  }

  next();
};

