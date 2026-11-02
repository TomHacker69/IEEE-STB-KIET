import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requireSuperAdmin } from '../middleware/rbacMiddleware';
import {
  listRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/roles.controller';

const router = Router();

// Any authenticated admin can view roles list (e.g. for dropdowns)
router.get('/', authenticate, listRoles);
router.get('/:id', authenticate, getRoleById);

// Custom Role Builder: Super Admin only
router.post('/', authenticate, requireSuperAdmin, createRole);
router.put('/:id', authenticate, requireSuperAdmin, updateRole);
router.delete('/:id', authenticate, requireSuperAdmin, deleteRole);

export default router;

