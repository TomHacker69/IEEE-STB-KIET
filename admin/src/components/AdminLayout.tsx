'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  Sliders,
  Award,
  Calendar,
  Activity,
  BookOpen,
  Share2,
  DollarSign,
  UserPlus,
  Code2,
  History,
  LogOut,
  Radio,
  FileCheck2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, role, isSuperAdmin, hasPermission, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-ieee-cyan border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-300">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!user && pathname !== '/login') {
    return null;
  }

  // Sidebar navigation filtered dynamically by user's granular role permissions
  const navItems = [
    {
      label: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      show: true,
    },
    {
      label: 'Sub-Admins',
      href: '/subadmins',
      icon: Users,
      show: isSuperAdmin || hasPermission('subadmins', 'view'),
    },
    {
      label: 'Custom Role Builder',
      href: '/roles',
      icon: Shield,
      show: isSuperAdmin || hasPermission('roles', 'view'),
    },
    {
      label: 'Dynamic Site Content',
      href: '/content',
      icon: FileText,
      show: isSuperAdmin || hasPermission('site_content', 'view'),
    },
    {
      label: 'Section Config & Order',
      href: '/sections',
      icon: Sliders,
      show: isSuperAdmin || hasPermission('section_config', 'view'),
    },
    {
      label: 'Dignitaries (Home)',
      href: '/dignitaries',
      icon: Award,
      show: isSuperAdmin || hasPermission('dignitaries', 'view'),
    },
    {
      label: 'Members & Team',
      href: '/members',
      icon: Users,
      show: isSuperAdmin || hasPermission('members', 'view'),
    },
    {
      label: 'Events',
      href: '/events',
      icon: Calendar,
      show: isSuperAdmin || hasPermission('events', 'view'),
    },
    {
      label: 'Activities',
      href: '/activities',
      icon: Activity,
      show: isSuperAdmin || hasPermission('activities', 'view'),
    },
    {
      label: 'Research Papers',
      href: '/research',
      icon: BookOpen,
      show: isSuperAdmin || hasPermission('research_papers', 'view'),
    },
    {
      label: 'Social Media Head',
      href: '/social',
      icon: Share2,
      show: isSuperAdmin || hasPermission('social_posts', 'view'),
    },
    {
      label: 'Sponsors',
      href: '/sponsors',
      icon: DollarSign,
      show: isSuperAdmin || hasPermission('sponsors', 'view'),
    },
    {
      label: 'Recruitment & Drives',
      href: '/recruitment',
      icon: UserPlus,
      show: isSuperAdmin || hasPermission('recruitment', 'view'),
    },
    {
      label: 'Certificates',
      href: '/certificates',
      icon: FileCheck2,
      show: isSuperAdmin || hasPermission('certificates', 'view'),
    },
    {
      label: 'Developers Corner',
      href: '/dev-corner',
      icon: Code2,
      show: isSuperAdmin || hasPermission('dev_corner', 'view'),
    },
    {
      label: 'Audit Logs',
      href: '/audit-logs',
      icon: History,
      show: isSuperAdmin || hasPermission('audit_logs', 'view'),
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-lg tracking-wider">IEEE STB</span>
              <span className="bg-ieee-blue text-[10px] text-white px-2 py-0.5 rounded-full font-bold uppercase">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Management & RBAC Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-ieee-blue text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
        </nav>

        {/* Footer User Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-ieee-cyan truncate">
                {isSuperAdmin ? 'Super Administrator' : role?.name || 'Sub-Admin'}
              </p>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-red-400 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
              Live DB Active (No Hardcoding)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-ieee-blue hover:underline flex items-center gap-1"
            >
              View Public Website ↗
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
};

