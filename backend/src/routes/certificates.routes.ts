import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';
import {
  getMyCertificates,
  verifyCertificate,
  getAllCertificates,
  issueCertificate,
  deleteCertificate,
} from '../controllers/certificates.controller';

const router = Router();

// Member Dashboard: certificates & participations
router.get('/my', authenticate, getMyCertificates);

// Public verification
router.get('/verify/:credentialId', verifyCertificate);

// Admin: Certificate issuance & management
router.get('/admin', authenticate, requirePermission('certificates', 'view'), getAllCertificates);
router.post('/', authenticate, requirePermission('certificates', 'create'), issueCertificate);
router.delete('/:id', authenticate, requirePermission('certificates', 'delete'), deleteCertificate);

export default router;

