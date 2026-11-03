import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';
import {
  getPublicMembers,
  getAllMembers,
  createMember,
  updateMember,
  deleteMember,
  batchImportMembers,
} from '../controllers/members.controller';

const router = Router();

// Public: Team page & Member listings
router.get('/', getPublicMembers);

// Admin: Team & Member management
router.get('/admin', authenticate, requirePermission('members', 'view'), getAllMembers);
router.post('/', authenticate, requirePermission('members', 'create'), createMember);
router.post('/batch-import', authenticate, requirePermission('members', 'create'), batchImportMembers);
router.put('/:id', authenticate, requirePermission('members', 'edit'), updateMember);
router.delete('/:id', authenticate, requirePermission('members', 'delete'), deleteMember);

export default router;

