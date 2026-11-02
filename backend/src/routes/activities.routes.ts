import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';
import {
  getPublicActivities,
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../controllers/activities.controller';

const router = Router();

// Public
router.get('/', getPublicActivities);
router.get('/:id', getActivityById);

// Admin
router.get('/admin/all', authenticate, requirePermission('activities', 'view'), getAllActivities);
router.post('/', authenticate, requirePermission('activities', 'create'), createActivity);
router.put('/:id', authenticate, requirePermission('activities', 'edit'), updateActivity);
router.delete('/:id', authenticate, requirePermission('activities', 'delete'), deleteActivity);

export default router;

