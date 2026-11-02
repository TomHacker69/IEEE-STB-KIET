import multer from 'multer';
import { Request } from 'express';
import { uploadToCloudinary } from '../config/cloudinary';

// Memory storage so we stream buffers directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: JPEG, PNG, WEBP, GIF, SVG, PDF.`));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max file size
  },
  fileFilter,
});

export const handleSingleUpload = async (
  file: Express.Multer.File,
  folder: string = 'general'
): Promise<string> => {
  const isPdf = file.mimetype === 'application/pdf';
  const resourceType = isPdf ? 'raw' : 'image';
  const result = await uploadToCloudinary(file.buffer, folder, resourceType);
  return result.secure_url;
};

