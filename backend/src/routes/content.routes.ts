import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';
import {
  getAllContent,
  getContentByGroup,
  createContent,
  updateContent,
  deleteContent,
  initStandardContentSchema,
} from '../controllers/content.controller';

const router = Router();

// Public routes for dynamic website consumption
router.get('/', getAllContent);
router.get('/:group', getContentByGroup);

// Admin routes
router.post('/initialize-schema', authenticate, requirePermission('site_content', 'create'), initStandardContentSchema);
router.post('/', authenticate, requirePermission('site_content', 'create'), createContent);
router.put('/:id', authenticate, requirePermission('site_content', 'edit'), updateContent);
router.delete('/:id', authenticate, requirePermission('site_content', 'delete'), deleteContent);

export default router;

