import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requireSuperAdmin } from '../middleware/rbacMiddleware';
import {
  getMe,
  syncUser,
  listSubAdmins,
  createSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
} from '../controllers/auth.controller';

const router = Router();

router.get('/me', authenticate, getMe);
router.post('/sync', authenticate, syncUser);

// Sub-admin provisioning (Super Admin only)
router.get('/subadmins', authenticate, requireSuperAdmin, listSubAdmins);
router.post('/subadmins', authenticate, requireSuperAdmin, createSubAdmin);
router.put('/subadmins/:id', authenticate, requireSuperAdmin, updateSubAdmin);
router.delete('/subadmins/:id', authenticate, requireSuperAdmin, deleteSubAdmin);

export default router;

