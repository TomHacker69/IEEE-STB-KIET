import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

export const initCloudinary = () => {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET || '',
      secure: true,
    });
    console.log(`✅ Cloudinary Configured (${process.env.CLOUDINARY_CLOUD_NAME})`);
  } else {
    console.log('ℹ️ Cloudinary credentials not configured in .env. Using local uploads directory fallback.');
  }
};

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string = 'general',
  resourceType: 'image' | 'raw' | 'auto' = 'auto'
): Promise<{ secure_url: string; public_id: string }> => {
  // If Cloudinary is configured, use it
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `ieee-stb/${folder}`,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary upload returned empty response'));
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      uploadStream.end(buffer);
    });
  }

  // Local storage fallback for seamless exploration
  const uploadsDir = path.join(process.cwd(), 'uploads', folder);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${
    resourceType === 'raw' ? 'pdf' : 'png'
  }`;
  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, buffer);

  const port = process.env.PORT || 5000;
  const localUrl = `http://localhost:${port}/uploads/${folder}/${filename}`;

  return {
    secure_url: localUrl,
    public_id: filename,
  };
};

export { cloudinary };
