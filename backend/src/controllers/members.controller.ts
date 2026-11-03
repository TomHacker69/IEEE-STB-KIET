import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Member } from '../models/Member';
import { logAudit } from '../utils/auditLogger';

export const getPublicMembers = async (req: Request, res: Response) => {
  try {
    const { tier } = req.query;
    const filter: any = { isActive: true };
    if (tier) filter.tier = tier;

    const members = await Member.find(filter).sort({ orderIndex: 1, name: 1 });

    const grouped = {
      core_team: members.filter((m) => m.tier === 'core_team'),
      regular_member: members.filter((m) => m.tier === 'regular_member'),
      content_member: members.filter((m) => m.tier === 'content_member'),
    };

    return res.status(200).json({
      success: true,
      data: members,
      grouped,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllMembers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { tier, search } = req.query;
    const filter: any = {};
    if (tier) filter.tier = tier;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const members = await Member.find(filter).sort({ orderIndex: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: members });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createMember = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      designation,
      tier,
      photoUrl,
      quote,
      email,
      department,
      membershipId,
      socialLinks,
      orderIndex,
      isActive,
    } = req.body;

    if (!name || !designation) {
      return res.status(400).json({ success: false, message: 'Name and designation are required' });
    }

    const member = await Member.create({
      name: name.trim(),
      designation: designation.trim(),
      tier: tier || 'regular_member',
      photoUrl: photoUrl || '',
      quote: tier === 'core_team' ? quote || '' : '', // quotes reserved for core team
      email: email ? email.toLowerCase().trim() : '',
      department: department || '',
      membershipId: membershipId || '',
      socialLinks: socialLinks || {},
      orderIndex: orderIndex ?? 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await logAudit(req, 'CREATE', 'members', (member._id as any).toString(), {
      name,
      tier: member.tier,
      designation,
    });

    return res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: member,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMember = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      designation,
      tier,
      photoUrl,
      quote,
      email,
      department,
      membershipId,
      socialLinks,
      orderIndex,
      isActive,
    } = req.body;

    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    if (name) member.name = name.trim();
    if (designation) member.designation = designation.trim();
    if (tier) member.tier = tier;
    if (photoUrl !== undefined) member.photoUrl = photoUrl;
    if (quote !== undefined) member.quote = tier === 'core_team' || member.tier === 'core_team' ? quote : '';
    if (email !== undefined) member.email = email.toLowerCase().trim();
    if (department !== undefined) member.department = department;
    if (membershipId !== undefined) member.membershipId = membershipId;
    if (socialLinks !== undefined) member.socialLinks = socialLinks;
    if (orderIndex !== undefined) member.orderIndex = orderIndex;
    if (isActive !== undefined) member.isActive = isActive;

    await member.save();
    await logAudit(req, 'UPDATE', 'members', id, { name: member.name });

    return res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: member,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMember = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    await Member.findByIdAndDelete(id);
    await logAudit(req, 'DELETE', 'members', id, { name: member.name });

    return res.status(200).json({
      success: true,
      message: 'Member removed',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const batchImportMembers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { members } = req.body;
    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A non-empty "members" array is required for batch import.',
      });
    }

    const imported = [];
    const errors = [];

    for (let i = 0; i < members.length; i++) {
      const item = members[i];
      if (!item.name || !item.name.trim()) {
        errors.push(`Row ${i + 1}: Name is required`);
        continue;
      }

      const email = item.email ? item.email.toLowerCase().trim() : '';
      const designation = item.designation ? item.designation.trim() : 'Member';
      const tier =
        item.tier && ['core_team', 'regular_member', 'content_member'].includes(item.tier)
          ? item.tier
          : 'regular_member';
      const department = item.department ? item.department.trim() : '';
      const quote = tier === 'core_team' ? (item.quote || '').trim() : '';
      const membershipId = item.membershipId
        ? item.membershipId.trim()
        : `IEEE-${Date.now().toString().slice(-6)}-${i + 1}`;

      let member;
      if (email) {
        member = await Member.findOneAndUpdate(
          { email },
          {
            $set: {
              name: item.name.trim(),
              designation,
              tier,
              department,
              quote,
              membershipId,
              photoUrl: item.photoUrl || '',
              socialLinks: item.socialLinks || {},
              isActive: item.isActive !== undefined ? item.isActive : true,
              orderIndex: item.orderIndex ?? i,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } else {
        member = await Member.create({
          name: item.name.trim(),
          designation,
          tier,
          department,
          quote,
          membershipId,
          photoUrl: item.photoUrl || '',
          socialLinks: item.socialLinks || {},
          isActive: item.isActive !== undefined ? item.isActive : true,
          orderIndex: item.orderIndex ?? i,
        });
      }

      imported.push(member);
    }

    await logAudit(req, 'CREATE', 'members', 'batch', {
      count: imported.length,
      errorsCount: errors.length,
    });

    return res.status(200).json({
      success: true,
      message: `Successfully processed ${imported.length} members.${
        errors.length > 0 ? ` Encountered ${errors.length} warnings.` : ''
      }`,
      data: {
        importedCount: imported.length,
        errors,
        members: imported,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

