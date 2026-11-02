import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';
import { getAuditLogs } from '../controllers/audit.controller';

const router = Router();

// Super Admin / authorized leads
router.get('/', authenticate, requirePermission('audit_logs', 'view'), getAuditLogs);

export default router;

