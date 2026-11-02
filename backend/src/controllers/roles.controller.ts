import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Role } from '../models/Role';
import { User } from '../models/User';
import { logAudit } from '../utils/auditLogger';

export const listRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find().sort({ createdAt: 1 });
    return res.status(200).json({ success: true, data: roles });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    return res.status(200).json({ success: true, data: role });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, permissions } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Role name is required' });
    }

    const existingRole = await Role.findOne({ name: name.trim() });
    if (existingRole) {
      return res.status(400).json({ success: false, message: 'A role with this name already exists' });
    }

    const role = await Role.create({
      name: name.trim(),
      description: description || '',
      isSystem: false,
      permissions: permissions || {},
    });

    await logAudit(req, 'CREATE', 'roles', (role._id as any).toString(), { name });

    return res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    if (name) role.name = name.trim();
    if (description !== undefined) role.description = description;
    if (permissions) role.permissions = permissions;

    await role.save();
    await logAudit(req, 'UPDATE', 'roles', id, { name: role.name });

    return res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: role,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    if (role.isSystem) {
      return res.status(400).json({
        success: false,
        message: 'System roles cannot be deleted',
      });
    }

    // Check if any active user is assigned this role
    const assignedUsers = await User.countDocuments({ roleId: id });
    if (assignedUsers > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role: ${assignedUsers} user(s) currently have this role assigned. Reassign them first.`,
      });
    }

    await Role.findByIdAndDelete(id);
    await logAudit(req, 'DELETE', 'roles', id, { name: role.name });

    return res.status(200).json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

