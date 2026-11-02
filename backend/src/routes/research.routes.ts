import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';
import {
  getPublicPapers,
  getAllPapers,
  createPaper,
  updatePaper,
  deletePaper,
} from '../controllers/research.controller';

const router = Router();

// Public
router.get('/', getPublicPapers);

// Research Lead & Super Admin
router.get('/admin/all', authenticate, requirePermission('research_papers', 'view'), getAllPapers);
router.post('/', authenticate, requirePermission('research_papers', 'create'), createPaper);
router.put('/:id', authenticate, requirePermission('research_papers', 'edit'), updatePaper);
router.delete('/:id', authenticate, requirePermission('research_papers', 'delete'), deletePaper);

export default router;

