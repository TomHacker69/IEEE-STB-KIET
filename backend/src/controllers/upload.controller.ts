import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { handleSingleUpload } from '../utils/fileUpload';

export const uploadMedia = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const folder = (req.body.folder as string) || 'general';
    const url = await handleSingleUpload(req.file, folder);

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      url,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message,
    });
  }
};

