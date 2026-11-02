import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { SocialPost } from '../models/SocialPost';
import { logAudit } from '../utils/auditLogger';

export const getPublicSocialPosts = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const query = SocialPost.find({ isPublished: true }).sort({ postedAt: -1 });
    if (limit) query.limit(Number(limit));

    const posts = await query.exec();
    return res.status(200).json({ success: true, data: posts });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllSocialPosts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const posts = await SocialPost.find().sort({ postedAt: -1 });
    return res.status(200).json({ success: true, data: posts });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createSocialPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { caption, imageUrl, postUrl, platform, postedAt, isPublished } = req.body;

    if (!caption || !imageUrl || !postUrl) {
      return res.status(400).json({
        success: false,
        message: 'Caption, imageUrl, and postUrl are required',
      });
    }

    const post = await SocialPost.create({
      caption: caption.trim(),
      imageUrl,
      postUrl: postUrl.trim(),
      platform: platform || 'instagram',
      postedAt: postedAt ? new Date(postedAt) : new Date(),
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    await logAudit(req, 'CREATE', 'social_posts', (post._id as any).toString(), {
      platform: post.platform,
      caption: post.caption.substring(0, 40),
    });

    return res.status(201).json({
      success: true,
      message: 'Social media post created successfully',
      data: post,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSocialPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { caption, imageUrl, postUrl, platform, postedAt, isPublished } = req.body;

    const post = await SocialPost.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Social post not found' });
    }

    if (caption) post.caption = caption.trim();
    if (imageUrl) post.imageUrl = imageUrl;
    if (postUrl) post.postUrl = postUrl.trim();
    if (platform) post.platform = platform;
    if (postedAt) post.postedAt = new Date(postedAt);
    if (isPublished !== undefined) post.isPublished = isPublished;

    await post.save();
    await logAudit(req, 'UPDATE', 'social_posts', id, { platform: post.platform });

    return res.status(200).json({
      success: true,
      message: 'Social post updated successfully',
      data: post,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSocialPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const post = await SocialPost.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Social post not found' });
    }

    await SocialPost.findByIdAndDelete(id);
    await logAudit(req, 'DELETE', 'social_posts', id, { platform: post.platform });

    return res.status(200).json({
      success: true,
      message: 'Social post removed',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

