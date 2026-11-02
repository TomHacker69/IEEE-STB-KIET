import { Schema, model, Document } from 'mongoose';

export interface SectionPermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  publish: boolean;
}

export interface IRole extends Document {
  name: string;
  description: string;
  isSystem: boolean;
  permissions: {
    site_content: SectionPermissions;
    section_config: SectionPermissions;
    dignitaries: SectionPermissions;
    members: SectionPermissions;
    events: SectionPermissions;
    activities: SectionPermissions;
    research_papers: SectionPermissions;
    social_posts: SectionPermissions;
    sponsors: SectionPermissions;
    recruitment: SectionPermissions;
    certificates: SectionPermissions;
    dev_corner: SectionPermissions;
    audit_logs: SectionPermissions;
    subadmins: SectionPermissions;
    roles: SectionPermissions;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const permissionActionSchema = new Schema<SectionPermissions>(
  {
    view: { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    publish: { type: Boolean, default: false },
  },
  { _id: false }
);

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    isSystem: { type: Boolean, default: false },
    permissions: {
      site_content: { type: permissionActionSchema, default: () => ({}) },
      section_config: { type: permissionActionSchema, default: () => ({}) },
      dignitaries: { type: permissionActionSchema, default: () => ({}) },
      members: { type: permissionActionSchema, default: () => ({}) },
      events: { type: permissionActionSchema, default: () => ({}) },
      activities: { type: permissionActionSchema, default: () => ({}) },
      research_papers: { type: permissionActionSchema, default: () => ({}) },
      social_posts: { type: permissionActionSchema, default: () => ({}) },
      sponsors: { type: permissionActionSchema, default: () => ({}) },
      recruitment: { type: permissionActionSchema, default: () => ({}) },
      certificates: { type: permissionActionSchema, default: () => ({}) },
      dev_corner: { type: permissionActionSchema, default: () => ({}) },
      audit_logs: { type: permissionActionSchema, default: () => ({}) },
      subadmins: { type: permissionActionSchema, default: () => ({}) },
      roles: { type: permissionActionSchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

export const Role = model<IRole>('Role', RoleSchema);

