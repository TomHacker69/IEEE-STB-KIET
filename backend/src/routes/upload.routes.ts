import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../utils/fileUpload';
import { uploadMedia } from '../controllers/upload.controller';

const router = Router();

// Upload to Cloudinary (authenticated users)
router.post('/', authenticate, upload.single('file'), uploadMedia);

export default router;

