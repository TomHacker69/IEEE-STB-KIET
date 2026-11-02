import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { SiteContent } from '../models/SiteContent';
import { logAudit } from '../utils/auditLogger';

export const getAllContent = async (req: Request, res: Response) => {
  try {
    const items = await SiteContent.find().sort({ group: 1, key: 1 });

    // Also build a convenient nested dictionary: { [group]: { [key]: value } }
    const dictionary: Record<string, Record<string, string>> = {};
    for (const item of items) {
      if (!dictionary[item.group]) {
        dictionary[item.group] = {};
      }
      dictionary[item.group][item.key] = item.value;
    }

    return res.status(200).json({
      success: true,
      data: items,
      dictionary,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getContentByGroup = async (req: Request, res: Response) => {
  try {
    const { group } = req.params;
    const items = await SiteContent.find({ group }).sort({ key: 1 });

    const dictionary: Record<string, string> = {};
    for (const item of items) {
      dictionary[item.key] = item.value;
    }

    return res.status(200).json({
      success: true,
      group,
      data: items,
      dictionary,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { group, key, label, value, type, description } = req.body;

    if (!group || !key || !label) {
      return res.status(400).json({
        success: false,
        message: 'Group, key, and label are required',
      });
    }

    const existing = await SiteContent.findOne({ group, key });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Content key '${key}' already exists in group '${group}'`,
      });
    }

    const item = await SiteContent.create({
      group,
      key,
      label,
      value: value || '',
      type: type || 'text',
      description: description || '',
    });

    await logAudit(req, 'CREATE', 'site_content', (item._id as any).toString(), {
      group,
      key,
      label,
    });

    return res.status(201).json({
      success: true,
      message: 'Content item created',
      data: item,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { value, label, description, type } = req.body;

    const item = await SiteContent.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Content item not found' });
    }

    if (value !== undefined) item.value = value;
    if (label !== undefined) item.label = label;
    if (description !== undefined) item.description = description;
    if (type !== undefined) item.type = type;

    await item.save();
    await logAudit(req, 'UPDATE', 'site_content', id, {
      group: item.group,
      key: item.key,
      value: item.value,
    });

    return res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: item,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const item = await SiteContent.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Content item not found' });
    }

    await SiteContent.findByIdAndDelete(id);
    await logAudit(req, 'DELETE', 'site_content', id, { group: item.group, key: item.key });

    return res.status(200).json({
      success: true,
      message: 'Content item removed',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const initStandardContentSchema = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const STANDARD_SCHEMA = [
      // Navbar
      { group: 'navbar', key: 'brand_title', label: 'Brand Title (Header)', type: 'text', description: 'Main title shown in navbar top left' },
      { group: 'navbar', key: 'college_name', label: 'College / Institute Name (Header)', type: 'text', description: 'Sub-label under brand title' },
      { group: 'navbar', key: 'nav_home', label: 'Nav Link: Home', type: 'text' },
      { group: 'navbar', key: 'nav_events', label: 'Nav Link: Events', type: 'text' },
      { group: 'navbar', key: 'nav_team', label: 'Nav Link: Team', type: 'text' },
      { group: 'navbar', key: 'nav_activities', label: 'Nav Link: Activities', type: 'text' },
      { group: 'navbar', key: 'nav_research', label: 'Nav Link: Research', type: 'text' },
      { group: 'navbar', key: 'nav_social', label: 'Nav Link: Social', type: 'text' },
      { group: 'navbar', key: 'nav_sponsors', label: 'Nav Link: Sponsors', type: 'text' },
      { group: 'navbar', key: 'nav_recruitment', label: 'Nav Link: Recruitment', type: 'text' },
      { group: 'navbar', key: 'login_button_text', label: 'Login Button Text', type: 'text' },
      { group: 'navbar', key: 'register_button_text', label: 'Register Button Text', type: 'text' },

      // Hero
      { group: 'hero', key: 'badge_text', label: 'Hero Badge Text', type: 'text' },
      { group: 'hero', key: 'headline', label: 'Hero Main Headline', type: 'text' },
      { group: 'hero', key: 'subtitle', label: 'Hero Subtitle Paragraph', type: 'textarea' },
      { group: 'hero', key: 'primary_cta', label: 'Hero Primary Button Label', type: 'text' },
      { group: 'hero', key: 'secondary_cta', label: 'Hero Secondary Button Label', type: 'text' },

      // About
      { group: 'about', key: 'badge', label: 'About Section Badge', type: 'text' },
      { group: 'about', key: 'section_title', label: 'About Section Headline', type: 'text' },
      { group: 'about', key: 'description', label: 'About Branch Description', type: 'textarea' },
      { group: 'about', key: 'point_1', label: 'Affiliation Bullet Point 1', type: 'text' },
      { group: 'about', key: 'point_2', label: 'Affiliation Bullet Point 2', type: 'text' },
      { group: 'about', key: 'cta_text', label: 'Team Link Button Label', type: 'text' },

      // Highlights
      { group: 'highlights', key: 'members_count', label: 'Highlight: Student Members Count', type: 'text' },
      { group: 'highlights', key: 'events_count', label: 'Highlight: Events & Workshops Count', type: 'text' },
      { group: 'highlights', key: 'papers_count', label: 'Highlight: Research Publications Count', type: 'text' },
      { group: 'highlights', key: 'awards_count', label: 'Highlight: Section Awards Count', type: 'text' },

      // Footer
      { group: 'footer', key: 'branch_name', label: 'Footer Branch Title', type: 'text' },
      { group: 'footer', key: 'college_name', label: 'Footer College Name', type: 'text' },
      { group: 'footer', key: 'department_name', label: 'Department Affiliation', type: 'text' },
      { group: 'footer', key: 'address', label: 'Campus Address / Location', type: 'text' },
      { group: 'footer', key: 'email', label: 'Official Branch Email', type: 'text' },
      { group: 'footer', key: 'copyright', label: 'Copyright Notice', type: 'text' },
      { group: 'footer', key: 'disclaimer', label: 'IEEE Disclaimer Statement', type: 'textarea' },

      // Branding
      { group: 'branding', key: 'branch_name', label: 'Official Branch Name', type: 'text' },
      { group: 'branding', key: 'college_name', label: 'Official College Name', type: 'text' },
      { group: 'branding', key: 'logo_url', label: 'Branch Logo URL / Image', type: 'image' },
    ];

    let createdCount = 0;
    for (const item of STANDARD_SCHEMA) {
      const existing = await SiteContent.findOne({ group: item.group, key: item.key });
      if (!existing) {
        await SiteContent.create({
          group: item.group,
          key: item.key,
          label: item.label,
          value: '', // Zero dummy data: strictly empty slots
          type: item.type,
          description: item.description || '',
        });
        createdCount++;
      }
    }

    await logAudit(req, 'CREATE', 'site_content', 'init-schema', { createdCount });

    return res.status(200).json({
      success: true,
      message: `Initialized ${createdCount} standard content schema keys (empty values).`,
      createdCount,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

