import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';
import {
  getCurrentDrive,
  updateDriveSettings,
  submitApplication,
  getApplications,
  reviewApplication,
} from '../controllers/recruitment.controller';

const router = Router();

// Public: recruitment drive status & application submission
router.get('/drive', getCurrentDrive);
router.post('/apply', optionalAuth, submitApplication);

// Membership Lead & Super Admin
router.put('/drive', authenticate, requirePermission('recruitment', 'edit'), updateDriveSettings);
router.get('/applications', authenticate, requirePermission('recruitment', 'view'), getApplications);
router.put('/applications/:id/review', authenticate, requirePermission('recruitment', 'edit'), reviewApplication);

export default router;

