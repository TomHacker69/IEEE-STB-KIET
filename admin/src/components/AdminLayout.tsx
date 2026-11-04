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
      <div className="flex h-screen w-screen items-center justify-center bg-[#e8edf5] text-slate-800">
        <div className="flex flex-col items-center gap-4 neu-card p-8 rounded-3xl border border-white/80">
          <div className="w-10 h-10 border-4 border-ieee-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-700">Verifying Admin Session...</p>
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
    <div className="flex h-screen bg-[#e8edf5] overflow-hidden">
      {/* Neumorphic Sidebar */}
      <aside className="w-64 bg-[#e8edf5] text-slate-700 flex flex-col border-r border-slate-300/50 shadow-[4px_0_12px_rgba(0,0,0,0.03)] shrink-0">
        <div className="p-5 border-b border-slate-300/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="p-1.5 neu-card-sm rounded-xl">
              <img src="/logo.jpg" alt="IEEE Logo" className="h-8 w-auto object-contain rounded" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-800 text-sm tracking-wider">IEEE STB</span>
                <span className="neu-pill-active text-[9px] text-ieee-blue px-2 py-0.5 font-bold uppercase">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Management Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {navItems
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'neu-inset text-ieee-blue font-extrabold shadow-[inset_3px_3px_6px_#c4d0e0,inset_-3px_-3px_6px_#ffffff]'
                      : 'text-slate-600 font-medium hover:neu-card-sm hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-ieee-blue' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
        </nav>

        {/* Footer User Info */}
        <div className="p-4 border-t border-slate-300/40">
          <div className="neu-inset rounded-2xl p-3 flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
              <p className="text-[10px] text-ieee-blue font-semibold truncate">
                {isSuperAdmin ? 'Super Administrator' : role?.name || 'Sub-Admin'}
              </p>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="neu-btn p-2 rounded-xl text-slate-500 hover:text-red-600 transition shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#e8edf5]">
        {/* Top Header */}
        <header className="h-16 bg-[#e8edf5] border-b border-slate-300/50 px-8 flex items-center justify-between shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <span className="neu-pill flex items-center gap-1.5 text-xs font-bold text-emerald-700 px-3 py-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
              Live DB Operational
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://ieee-stb-kiet-theta.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-ieee-blue hover:text-ieee-dark transition flex items-center gap-1"
            >
              <span>View Public Website</span>
              <span>↗</span>
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#e8edf5]">{children}</main>
      </div>
    </div>
  );
};
