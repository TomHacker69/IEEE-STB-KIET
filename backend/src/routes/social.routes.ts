import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';
import {
  getPublicSocialPosts,
  getAllSocialPosts,
  createSocialPost,
  updateSocialPost,
  deleteSocialPost,
} from '../controllers/social.controller';

const router = Router();

// Public: "What's happening at IEEE"
router.get('/', getPublicSocialPosts);

// Social Media Head & Super Admin
router.get('/admin/all', authenticate, requirePermission('social_posts', 'view'), getAllSocialPosts);
router.post('/', authenticate, requirePermission('social_posts', 'create'), createSocialPost);
router.put('/:id', authenticate, requirePermission('social_posts', 'edit'), updateSocialPost);
router.delete('/:id', authenticate, requirePermission('social_posts', 'delete'), deleteSocialPost);

export default router;

