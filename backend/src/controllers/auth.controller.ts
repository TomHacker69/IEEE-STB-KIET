import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { getAuth } from '../config/firebase';
import { logAudit } from '../utils/auditLogger';

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await User.findById(req.user._id).populate('roleId');
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const syncUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { name, department, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User record not found' });
    }

    if (name) user.name = name;
    if (department) user.department = department;
    if (phone) user.phone = phone;

    await user.save();
    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const listSubAdmins = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const subadmins = await User.find({
      $or: [{ roleId: { $exists: true, $ne: null } }, { isSuperAdmin: true }],
    })
      .populate('roleId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: subadmins,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createSubAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password, name, roleId } = req.body;

    if (!email || !password || !name || !roleId) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, name, and roleId are required',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser && existingUser.roleId) {
      return res.status(400).json({
        success: false,
        message: 'A sub-admin account with this email already exists',
      });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Specified role not found' });
    }

    const auth = getAuth();
    let firebaseUser;

    try {
      // Check if user already exists in Firebase Auth
      firebaseUser = await auth.getUserByEmail(email);
      // Update password
      await auth.updateUser(firebaseUser.uid, {
        password,
        displayName: name,
      });
    } catch {
      // Create new user in Firebase Auth
      firebaseUser = await auth.createUser({
        email,
        password,
        displayName: name,
      });
    }

    let user = await User.findOne({ firebaseUid: firebaseUser.uid });
    if (user) {
      user.name = name;
      user.roleId = role._id as any;
      user.isActive = true;
      await user.save();
    } else {
      user = await User.create({
        firebaseUid: firebaseUser.uid,
        email: email.toLowerCase(),
        name,
        roleId: role._id,
        isSuperAdmin: false,
        isActive: true,
      });
    }

    await logAudit(req, 'CREATE', 'subadmins', (user._id as any).toString(), {
      email,
      name,
      roleName: role.name,
    });

    const populatedUser = await User.findById(user._id).populate('roleId');

    return res.status(201).json({
      success: true,
      message: 'Sub-admin account created successfully',
      data: populatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSubAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { roleId, isActive, name } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isSuperAdmin && req.user?._id !== (user._id as any).toString()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify Super Admin account through sub-admin management',
      });
    }

    if (roleId !== undefined) {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({ success: false, message: 'Role not found' });
      }
      user.roleId = role._id as any;
    }

    if (isActive !== undefined) {
      user.isActive = isActive;
      try {
        const auth = getAuth();
        await auth.updateUser(user.firebaseUid, { disabled: !isActive });
      } catch (err) {
        console.warn('Firebase user status update skipped:', err);
      }
    }

    if (name) user.name = name;

    await user.save();
    await logAudit(req, 'UPDATE', 'subadmins', (user._id as any).toString(), {
      email: user.email,
      isActive,
      roleId,
    });

    const populatedUser = await User.findById(user._id).populate('roleId');

    return res.status(200).json({
      success: true,
      message: 'Sub-admin updated successfully',
      data: populatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSubAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete the Super Admin account',
      });
    }

    user.roleId = undefined;
    user.isActive = false;
    await user.save();

    try {
      const auth = getAuth();
      await auth.updateUser(user.firebaseUid, { disabled: true });
    } catch (err) {
      console.warn('Firebase user disable skipped:', err);
    }

    await logAudit(req, 'DELETE', 'subadmins', id, { email: user.email });

    return res.status(200).json({
      success: true,
      message: 'Sub-admin deactivated and privileges revoked',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

