import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';
import {
  getPublicSponsors,
  getAllSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
} from '../controllers/sponsors.controller';

const router = Router();

// Public
router.get('/', getPublicSponsors);

// Admin
router.get('/admin/all', authenticate, requirePermission('sponsors', 'view'), getAllSponsors);
router.post('/', authenticate, requirePermission('sponsors', 'create'), createSponsor);
router.put('/:id', authenticate, requirePermission('sponsors', 'edit'), updateSponsor);
router.delete('/:id', authenticate, requirePermission('sponsors', 'delete'), deleteSponsor);

export default router;

