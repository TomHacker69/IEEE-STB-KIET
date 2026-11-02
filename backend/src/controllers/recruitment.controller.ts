import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { MembershipDrive } from '../models/MembershipDrive';
import { MembershipApplication } from '../models/MembershipApplication';
import { MembershipRecord } from '../models/MembershipRecord';
import { User } from '../models/User';
import { logAudit } from '../utils/auditLogger';

export const getCurrentDrive = async (req: Request, res: Response) => {
  try {
    let drive = await MembershipDrive.findOne().sort({ createdAt: -1 });
    if (!drive) {
      // Return empty/closed state
      return res.status(200).json({
        success: true,
        data: null,
        isOpen: false,
        message: 'No active recruitment drive at this time.',
      });
    }

    return res.status(200).json({
      success: true,
      data: drive,
      isOpen: drive.isOpen,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDriveSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, isOpen, academicYear, startDate, endDate, guidelines, departmentsAllowed } =
      req.body;

    let drive = await MembershipDrive.findOne().sort({ createdAt: -1 });

    if (!drive) {
      drive = await MembershipDrive.create({
        title: title || 'Annual IEEE Student Branch Recruitment Drive',
        description: description || '',
        isOpen: isOpen ?? false,
        academicYear: academicYear || '2026-2027',
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        guidelines: guidelines || '',
        departmentsAllowed: departmentsAllowed || [],
      });
    } else {
      if (title !== undefined) drive.title = title;
      if (description !== undefined) drive.description = description;
      if (isOpen !== undefined) drive.isOpen = isOpen;
      if (academicYear !== undefined) drive.academicYear = academicYear;
      if (startDate !== undefined) drive.startDate = startDate ? new Date(startDate) : undefined;
      if (endDate !== undefined) drive.endDate = endDate ? new Date(endDate) : undefined;
      if (guidelines !== undefined) drive.guidelines = guidelines;
      if (departmentsAllowed !== undefined) drive.departmentsAllowed = departmentsAllowed;

      await drive.save();
    }

    await logAudit(
      req,
      'TOGGLE_DRIVE',
      'recruitment',
      (drive._id as any).toString(),
      { isOpen: drive.isOpen, title: drive.title }
    );

    return res.status(200).json({
      success: true,
      message: `Recruitment drive is now ${drive.isOpen ? 'OPEN' : 'CLOSED'}`,
      data: drive,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const drive = await MembershipDrive.findOne({ isOpen: true }).sort({ createdAt: -1 });
    if (!drive) {
      return res.status(400).json({
        success: false,
        message: 'Recruitment is currently closed. Please check back later.',
      });
    }

    const { fullName, email, phone, collegeId, department, yearOfStudy, domainInterests, statementOfPurpose, resumeUrl } =
      req.body;

    if (!fullName || !email || !phone || !collegeId || !department || !yearOfStudy) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields.',
      });
    }

    const existingApplication = await MembershipApplication.findOne({
      driveId: drive._id,
      email: email.toLowerCase().trim(),
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'An application with this email has already been submitted for the current drive.',
      });
    }

    const application = await MembershipApplication.create({
      driveId: drive._id,
      userId: req.user?._id,
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      collegeId: collegeId.trim(),
      department: department.trim(),
      yearOfStudy,
      domainInterests: domainInterests || [],
      statementOfPurpose: statementOfPurpose || '',
      resumeUrl: resumeUrl || '',
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully! The IEEE team will review your application soon.',
      data: application,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { collegeId: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await MembershipApplication.find(filter)
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: applications });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const reviewApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reviewRemarks, designation, startDate, endDate } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const application = await MembershipApplication.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    application.reviewRemarks = reviewRemarks || '';
    application.reviewedBy = req.user?._id as any;
    await application.save();

    // If approved, create or update a MembershipRecord
    let record = null;
    if (status === 'approved') {
      const generatedMembershipId = `IEEE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Find if user already has an account
      let user = await User.findOne({ email: application.email });
      if (!user) {
        // Create user doc if not yet existing
        user = await User.create({
          firebaseUid: `unregistered-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          email: application.email,
          name: application.fullName,
          phone: application.phone,
          department: application.department,
          membershipId: generatedMembershipId,
          isSuperAdmin: false,
          isActive: true,
        });
      } else {
        user.membershipId = user.membershipId || generatedMembershipId;
        await user.save();
      }

      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      record = await MembershipRecord.findOneAndUpdate(
        { userEmail: application.email },
        {
          userId: user._id,
          userEmail: application.email,
          userName: application.fullName,
          membershipId: user.membershipId || generatedMembershipId,
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : oneYearLater,
          designation: designation || 'Active Member',
          status: 'active',
        },
        { upsert: true, new: true }
      );
    }

    await logAudit(req, 'UPDATE', 'recruitment', id, {
      applicantEmail: application.email,
      status,
      reviewRemarks,
    });

    return res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: { application, record },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

