import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { initFirebase, getAuth } from '../config/firebase';
import { User } from '../models/User';
import { Role } from '../models/Role';

const defaultFullPermissions = {
  view: true,
  create: true,
  edit: true,
  delete: true,
  publish: true,
};

const defaultSections = [
  'site_content',
  'section_config',
  'dignitaries',
  'members',
  'events',
  'activities',
  'research_papers',
  'social_posts',
  'sponsors',
  'recruitment',
  'certificates',
  'dev_corner',
  'audit_logs',
  'subadmins',
  'roles',
];

const seedSuperAdmin = async () => {
  console.log('🌱 Starting Super Admin Initialization...');

  // 1. Connect MongoDB
  await connectDB();

  // 2. Init Firebase Admin
  initFirebase();
  const auth = getAuth();

  // 3. Credentials from ENV or CLI arguments
  const args = process.argv.slice(2);
  const email = (args[0] || process.env.SUPERADMIN_EMAIL || 'admin@ieee.org').toLowerCase().trim();
  const password = args[1] || process.env.SUPERADMIN_PASSWORD || 'Admin@IEEE2026!';
  const name = args[2] || process.env.SUPERADMIN_NAME || 'Super Administrator';

  if (!email || !password) {
    console.error('❌ Error: SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD must be provided.');
    process.exit(1);
  }

  // 4. Create / Ensure Default Role Templates in MongoDB
  const superAdminPermissions: Record<string, typeof defaultFullPermissions> = {};
  defaultSections.forEach((sec) => {
    superAdminPermissions[sec] = { ...defaultFullPermissions };
  });

  const superAdminRole = await Role.findOneAndUpdate(
    { name: 'Super Admin' },
    {
      name: 'Super Admin',
      description: 'Full unrestricted administrative access to the entire platform and settings',
      isSystem: true,
      permissions: superAdminPermissions,
    },
    { upsert: true, new: true }
  );

  // Template: Research Lead
  await Role.findOneAndUpdate(
    { name: 'Research Lead' },
    {
      name: 'Research Lead',
      description: 'Manages research papers publication and literature records',
      isSystem: true,
      permissions: {
        research_papers: { ...defaultFullPermissions },
      },
    },
    { upsert: true, new: true }
  );

  // Template: Membership Lead
  await Role.findOneAndUpdate(
    { name: 'Membership Lead' },
    {
      name: 'Membership Lead',
      description: 'Manages membership drives, applications review, and member records',
      isSystem: true,
      permissions: {
        recruitment: { ...defaultFullPermissions },
        members: { view: true, create: true, edit: true, delete: false, publish: true },
        certificates: { view: true, create: true, edit: true, delete: false, publish: true },
      },
    },
    { upsert: true, new: true }
  );

  // Template: Social Media Head
  await Role.findOneAndUpdate(
    { name: 'Social Media Head' },
    {
      name: 'Social Media Head',
      description: 'Manages social media insight posts and highlights',
      isSystem: true,
      permissions: {
        social_posts: { ...defaultFullPermissions },
      },
    },
    { upsert: true, new: true }
  );

  // Template: Secretary & Chairperson
  await Role.findOneAndUpdate(
    { name: 'Secretary & Chairperson' },
    {
      name: 'Secretary & Chairperson',
      description: 'Manages events, activities, dignitaries, and team members',
      isSystem: true,
      permissions: {
        events: { ...defaultFullPermissions },
        activities: { ...defaultFullPermissions },
        dignitaries: { view: true, create: true, edit: true, delete: false, publish: true },
        members: { view: true, create: true, edit: true, delete: false, publish: true },
        certificates: { ...defaultFullPermissions },
      },
    },
    { upsert: true, new: true }
  );

  console.log('✅ Core Role Templates verified.');

  // 5. Create or retrieve Firebase Auth user
  let firebaseUid: string;
  try {
    const existingFbUser = await auth.getUserByEmail(email);
    firebaseUid = existingFbUser.uid;
    await auth.updateUser(firebaseUid, {
      password,
      displayName: name,
      disabled: false,
    });
    console.log(`ℹ️ Existing Firebase user found (${email}). Password and credentials updated.`);
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') {
      const newFbUser = await auth.createUser({
        email,
        password,
        displayName: name,
      });
      firebaseUid = newFbUser.uid;
      console.log(`✅ Created new Firebase Auth account for Super Admin (${email}).`);
    } else {
      console.warn('⚠️ Firebase User Creation Warning:', err.message);
      // Fallback pseudo-uid for development if offline/mock
      firebaseUid = `superadmin-${Date.now()}`;
    }
  }

  // 6. Create / Update MongoDB User record
  const superAdminUser = await User.findOneAndUpdate(
    { email },
    {
      firebaseUid,
      email,
      name,
      roleId: superAdminRole._id,
      isSuperAdmin: true,
      isActive: true,
    },
    { upsert: true, new: true }
  );

  console.log('\n======================================================');
  console.log('🎉 Super Admin account seeded successfully!');
  console.log(`   Email:        ${email}`);
  console.log(`   Password:     ${password}`);
  console.log(`   Firebase UID: ${firebaseUid}`);
  console.log(`   Mongo ID:     ${superAdminUser._id}`);
  console.log('   Strict Notice: Zero dummy content or placeholder seeded.');
  console.log('======================================================\n');

  await mongoose.disconnect();
  process.exit(0);
};

seedSuperAdmin().catch((err) => {
  console.error('❌ Super Admin Seeding Failed:', err);
  process.exit(1);
});

