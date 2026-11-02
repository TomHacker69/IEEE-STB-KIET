import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';
import {
  listSections,
  createSection,
  updateSection,
  reorderSections,
} from '../controllers/sections.controller';

const router = Router();

// Public: dynamically get order and visibility of sections
router.get('/', listSections);

// Admin
router.post('/', authenticate, requirePermission('section_config', 'create'), createSection);
router.post('/reorder', authenticate, requirePermission('section_config', 'edit'), reorderSections);
router.put('/:id', authenticate, requirePermission('section_config', 'edit'), updateSection);

export default router;

