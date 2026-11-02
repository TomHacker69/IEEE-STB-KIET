import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';
import {
  getPublicEvents,
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/events.controller';

const router = Router();

// Public
router.get('/', getPublicEvents);
router.get('/:id', getEventById);

// Admin
router.get('/admin/all', authenticate, requirePermission('events', 'view'), getAllEvents);
router.post('/', authenticate, requirePermission('events', 'create'), createEvent);
router.put('/:id', authenticate, requirePermission('events', 'edit'), updateEvent);
router.delete('/:id', authenticate, requirePermission('events', 'delete'), deleteEvent);

export default router;

