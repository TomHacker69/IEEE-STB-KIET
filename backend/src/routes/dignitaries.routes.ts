import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';
import {
  getPublicDignitaries,
  getAllDignitaries,
  createDignitary,
  updateDignitary,
  deleteDignitary,
} from '../controllers/dignitaries.controller';

const router = Router();

// Public: Home page honor section
router.get('/', getPublicDignitaries);

// Admin
router.get('/admin', authenticate, requirePermission('dignitaries', 'view'), getAllDignitaries);
router.post('/', authenticate, requirePermission('dignitaries', 'create'), createDignitary);
router.put('/:id', authenticate, requirePermission('dignitaries', 'edit'), updateDignitary);
router.delete('/:id', authenticate, requirePermission('dignitaries', 'delete'), deleteDignitary);

export default router;

