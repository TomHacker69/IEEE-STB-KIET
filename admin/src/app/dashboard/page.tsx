'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Users,
  BookOpen,
  Share2,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Database,
  Cloud,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function DashboardPage() {
  const { user, isSuperAdmin, role, hasPermission } = useAuth();

  const [stats, setStats] = useState({
    eventsCount: 0,
    membersCount: 0,
    papersCount: 0,
    socialCount: 0,
    driveOpen: false,
    applicationsCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const [eventsRes, membersRes, papersRes, socialRes, driveRes] = await Promise.allSettled([
          api.get('/events'),
          api.get('/members'),
          api.get('/research'),
          api.get('/social'),
          api.get('/recruitment/drive'),
        ]);

        setStats({
          eventsCount: eventsRes.status === 'fulfilled' && eventsRes.value.data ? eventsRes.value.data.length : 0,
          membersCount: membersRes.status === 'fulfilled' && membersRes.value.data ? membersRes.value.data.length : 0,
          papersCount: papersRes.status === 'fulfilled' && papersRes.value.data ? papersRes.value.data.length : 0,
          socialCount: socialRes.status === 'fulfilled' && socialRes.value.data ? socialRes.value.data.length : 0,
          driveOpen: driveRes.status === 'fulfilled' && driveRes.value ? Boolean(driveRes.value.isOpen) : false,
          applicationsCount: 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard overview:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    loadOverview();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="neu-card-lg rounded-3xl p-8 border border-white/80 relative overflow-hidden bg-[#e8edf5]">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full neu-pill-active text-xs font-bold text-ieee-blue mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-ieee-cyan" />
              <span>{isSuperAdmin ? 'Full Super Admin Privileges' : `Role: ${role?.name}`}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              Welcome back, {user?.name || 'Administrator'}!
            </h1>
            <p className="mt-2 text-sm text-slate-600 font-medium leading-relaxed">
              Real-time administrative control system for the IEEE Student Branch. Manage your assigned
              domain, review applications, and publish updates instantly without redeploying.
            </p>
          </div>
        </div>

        {/* Overview Stat Cards */}
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-5">
            Branch Overview & Real-Time Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Events */}
            <div className="neu-card rounded-2xl p-6 border border-white/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Events</p>
                <p className="text-2xl font-extrabold text-slate-800 mt-1">{stats.eventsCount}</p>
                <span className="text-[11px] text-slate-400 font-medium mt-1 block">Live in database</span>
              </div>
              <div className="w-14 h-14 rounded-2xl neu-inset text-ieee-blue flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            {/* Members */}
            <div className="neu-card rounded-2xl p-6 border border-white/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Team & Members</p>
                <p className="text-2xl font-extrabold text-slate-800 mt-1">{stats.membersCount}</p>
                <span className="text-[11px] text-slate-400 font-medium mt-1 block">Active branch directory</span>
              </div>
              <div className="w-14 h-14 rounded-2xl neu-inset text-emerald-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Research Papers */}
            <div className="neu-card rounded-2xl p-6 border border-white/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Research Papers</p>
                <p className="text-2xl font-extrabold text-slate-800 mt-1">{stats.papersCount}</p>
                <span className="text-[11px] text-slate-400 font-medium mt-1 block">Published records</span>
              </div>
              <div className="w-14 h-14 rounded-2xl neu-inset text-purple-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            {/* Recruitment Drive Status */}
            <div className="neu-card rounded-2xl p-6 border border-white/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recruitment Drive</p>
                <div className="flex items-center gap-1.5 mt-2">
                  {stats.driveOpen ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 neu-pill px-3 py-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> OPEN
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 neu-pill px-3 py-1">
                      <XCircle className="w-3.5 h-3.5 text-slate-500" /> CLOSED
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                  {stats.driveOpen ? 'Accepting applications' : 'Drive stopped'}
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl neu-inset text-amber-600 flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Management Hub */}
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-5">
            Quick Navigation & Workspaces
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Membership Lead Workspace */}
            {(isSuperAdmin || hasPermission('recruitment', 'view')) && (
              <Link
                href="/recruitment"
                className="group block neu-card rounded-2xl p-6 border border-white/60 hover:shadow-[-8px_-8px_16px_#ffffff,8px_8px_16px_#c4d0e0] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl neu-inset text-ieee-blue flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-ieee-blue group-hover:translate-x-1 transition" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-4">Membership Drive Workspace</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Start or stop recruitment, review applicant profiles, approve members, and issue membership records.
                </p>
              </Link>
            )}

            {/* Social Media Head Workspace */}
            {(isSuperAdmin || hasPermission('social_posts', 'view')) && (
              <Link
                href="/social"
                className="group block neu-card rounded-2xl p-6 border border-white/60 hover:shadow-[-8px_-8px_16px_#ffffff,8px_8px_16px_#c4d0e0] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl neu-inset text-pink-600 flex items-center justify-center">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 group-hover:translate-x-1 transition" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-4">Social Media Head Workspace</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Post &quot;What&apos;s happening at IEEE&quot; cards with flyers, captions, and links to Instagram/LinkedIn.
                </p>
              </Link>
            )}

            {/* Research Lead Workspace */}
            {(isSuperAdmin || hasPermission('research_papers', 'view')) && (
              <Link
                href="/research"
                className="group block neu-card rounded-2xl p-6 border border-white/60 hover:shadow-[-8px_-8px_16px_#ffffff,8px_8px_16px_#c4d0e0] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl neu-inset text-purple-600 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-4">Research Lead Workspace</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Curate published papers, conferences, IEEE Xplore DOI citations, and author lists.
                </p>
              </Link>
            )}

            {/* Super Admin: Custom Role Builder */}
            {isSuperAdmin && (
              <Link
                href="/roles"
                className="group block neu-card rounded-2xl p-6 border border-white/60 hover:shadow-[-8px_-8px_16px_#ffffff,8px_8px_16px_#c4d0e0] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl neu-inset text-slate-800 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-1 transition" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-4">Custom Role Builder</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Create roles from scratch and assign granular permissions (view, create, edit, delete, publish) per section.
                </p>
              </Link>
            )}

            {/* Super Admin: Dynamic Content */}
            {isSuperAdmin && (
              <Link
                href="/content"
                className="group block neu-card rounded-2xl p-6 border border-white/60 hover:shadow-[-8px_-8px_16px_#ffffff,8px_8px_16px_#c4d0e0] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl neu-inset text-teal-600 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-4">Dynamic Site Content</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Edit all website wording, headers, hero text, about section, and footer labels without touching code.
                </p>
              </Link>
            )}

            {/* Super Admin: Dignitaries */}
            {(isSuperAdmin || hasPermission('dignitaries', 'view')) && (
              <Link
                href="/dignitaries"
                className="group block neu-card rounded-2xl p-6 border border-white/60 hover:shadow-[-8px_-8px_16px_#ffffff,8px_8px_16px_#c4d0e0] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl neu-inset text-amber-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-4">Dignitaries (Home Honor Section)</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Manage honorary college dignitaries (Director, Dean, VC, Branch Counselor) with photos & IEEE quotes.
                </p>
              </Link>
            )}
          </div>
        </div>

        {/* System Integrity & Rules Card */}
        <div className="neu-card rounded-2xl p-6 border border-white/60 bg-[#e8edf5]">
          <div className="flex items-center gap-2.5 text-slate-800 font-bold text-sm mb-3">
            <Cloud className="w-4 h-4 text-ieee-blue" />
            <span>Strict Architectural Rules Enforced</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 font-medium">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Zero fallback/mock data: All content is dynamically loaded from MongoDB.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Real-time reflects: Admin panel changes appear instantly on public pages.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Cloudinary CDN: Photos, flyers, and certificate PDFs uploaded securely.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Firebase Auth + Server-side RBAC enforced on every API route.</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
