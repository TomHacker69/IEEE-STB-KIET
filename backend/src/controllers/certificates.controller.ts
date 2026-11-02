import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Certificate } from '../models/Certificate';
import { Participation } from '../models/Participation';
import { MembershipRecord } from '../models/MembershipRecord';
import { User } from '../models/User';
import { logAudit } from '../utils/auditLogger';

export const getMyCertificates = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const certificates = await Certificate.find({
      $or: [{ userId: req.user._id }, { userEmail: req.user.email.toLowerCase() }],
    })
      .populate('eventId', 'title eventDate venue')
      .populate('activityId', 'title date')
      .sort({ issueDate: -1 });

    const participations = await Participation.find({ userId: req.user._id })
      .populate('eventId', 'title eventDate venue mode coverImage')
      .sort({ createdAt: -1 });

    const membershipRecord = await MembershipRecord.findOne({
      $or: [{ userId: req.user._id }, { userEmail: req.user.email.toLowerCase() }],
    });

    return res.status(200).json({
      success: true,
      data: {
        certificates,
        participations,
        membershipRecord,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const { credentialId } = req.params;
    const certificate = await Certificate.findOne({ credentialId })
      .populate('eventId', 'title eventDate venue')
      .populate('activityId', 'title date');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or credential ID is invalid.',
      });
    }

    return res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCertificates = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search } = req.query;
    const filter: any = {};
    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { credentialId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    const certificates = await Certificate.find(filter)
      .populate('eventId', 'title')
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: certificates });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const issueCertificate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      userEmail,
      userName,
      eventId,
      activityId,
      title,
      certificateFileUrl,
      issueDate,
      credentialId,
    } = req.body;

    if (!userEmail || !userName || !title || !certificateFileUrl) {
      return res.status(400).json({
        success: false,
        message: 'userEmail, userName, title, and certificateFileUrl are required',
      });
    }

    let user = await User.findOne({ email: userEmail.toLowerCase().trim() });
    if (!user) {
      user = await User.create({
        firebaseUid: `issued-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        email: userEmail.toLowerCase().trim(),
        name: userName.trim(),
        isSuperAdmin: false,
        isActive: true,
      });
    }

    const generatedCredentialId =
      credentialId ||
      `CERT-IEEE-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const cert = await Certificate.create({
      userId: user._id,
      userEmail: user.email,
      userName: userName.trim(),
      eventId: eventId || undefined,
      activityId: activityId || undefined,
      title: title.trim(),
      certificateFileUrl,
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      credentialId: generatedCredentialId,
      uploadedBy: req.user?._id,
    });

    // Also record event participation if eventId is provided
    if (eventId) {
      await Participation.findOneAndUpdate(
        { userId: user._id, eventId },
        { userId: user._id, eventId, role: 'attendee', certificateId: cert._id },
        { upsert: true }
      );
    }

    await logAudit(req, 'CREATE', 'certificates', (cert._id as any).toString(), {
      recipient: cert.userEmail,
      title: cert.title,
      credentialId: cert.credentialId,
    });

    return res.status(201).json({
      success: true,
      message: 'Certificate uploaded and issued successfully',
      data: cert,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCertificate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const cert = await Certificate.findById(id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    await Certificate.findByIdAndDelete(id);
    await logAudit(req, 'DELETE', 'certificates', id, {
      title: cert.title,
      recipient: cert.userEmail,
    });

    return res.status(200).json({
      success: true,
      message: 'Certificate deleted',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

