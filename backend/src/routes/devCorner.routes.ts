import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';
import {
  getPublicDevProfiles,
  getAllDevProfiles,
  createDevProfile,
  updateDevProfile,
  deleteDevProfile,
} from '../controllers/devCorner.controller';

const router = Router();

// Public: Developers Corner above footer
router.get('/', getPublicDevProfiles);

// Admin: Super Admin editable
router.get('/admin', authenticate, requirePermission('dev_corner', 'view'), getAllDevProfiles);
router.post('/', authenticate, requirePermission('dev_corner', 'create'), createDevProfile);
router.put('/:id', authenticate, requirePermission('dev_corner', 'edit'), updateDevProfile);
router.delete('/:id', authenticate, requirePermission('dev_corner', 'delete'), deleteDevProfile);

export default router;

