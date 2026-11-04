'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useSWR from 'swr';
import { fetcher } from '../lib/api';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch dynamic content dictionary for navbar & branding in real-time
  const { data: contentData } = useSWR('/content', fetcher, { revalidateOnFocus: true });
  const dict = contentData?.dictionary || {};
  const navbarContent = dict.navbar || {};
  const brandingContent = dict.branding || {};

  const brandTitle = brandingContent.branch_name || navbarContent.brand_title || 'IEEE Student Branch';
  const collegeName = brandingContent.college_name || navbarContent.college_name || 'KIET Group of Institutions';
  const logoUrl = brandingContent.logo_url || '/logo.jpg';

  const navLinks = [
    { label: navbarContent.nav_home || 'Home', href: '/' },
    { label: navbarContent.nav_events || 'Events', href: '/events' },
    { label: navbarContent.nav_team || 'Our Team', href: '/team' },
    { label: navbarContent.nav_activities || 'Activities', href: '/activities' },
    { label: navbarContent.nav_research || 'Research', href: '/research' },
    { label: navbarContent.nav_social || 'Social Hub', href: '/social' },
    { label: navbarContent.nav_sponsors || 'Sponsors', href: '/sponsors' },
    { label: navbarContent.nav_recruitment || 'Join IEEE', href: '/recruitment' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#e8edf5]/95 backdrop-blur-md border-b border-white/80 shadow-[0_4px_16px_#c5d0e0] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand in tactile well */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="p-1.5 rounded-2xl bg-[#e8edf5] shadow-[4px_4px_8px_#c5d0e0,-4px_4px_8px_#ffffff] border border-white/80 transition-transform group-hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt={brandTitle} className="h-10 w-auto object-contain rounded-xl" />
            </div>
            <div>
              <span className="font-extrabold text-slate-800 text-base sm:text-lg tracking-tight block leading-tight group-hover:text-ieee-blue transition">
                {brandTitle}
              </span>
              {collegeName && (
                <span className="text-[11px] text-slate-500 font-medium block">
                  {collegeName}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Nav Links in Neumorphic container */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#e8edf5] shadow-[inset_3px_3px_6px_#c5d0e0,inset_-3px_-3px_6px_#ffffff] border border-white/60">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#e8edf5] text-ieee-blue shadow-[3px_3px_6px_#c5d0e0,-3px_-3px_6px_#ffffff] font-bold border border-white/80'
                      : 'text-slate-600 hover:text-ieee-blue hover:shadow-[2px_2px_5px_#c5d0e0,-2px_-2px_5px_#ffffff]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Auth / Dashboard */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-ieee-blue bg-[#e8edf5] shadow-[4px_4px_10px_#c5d0e0,-4px_-4px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5d0e0,-2px_-2px_5px_#ffffff] border border-white/80 transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => logout()}
                  title="Sign Out"
                  className="p-2.5 rounded-xl text-slate-500 hover:text-red-500 bg-[#e8edf5] shadow-[4px_4px_8px_#c5d0e0,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_#c5d0e0,inset_-2px_-2px_4px_#ffffff] border border-white/80 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-ieee-blue rounded-xl bg-[#e8edf5] shadow-[4px_4px_8px_#c5d0e0,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_5px_#c5d0e0,-2px_-2px_5px_#ffffff] border border-white/80 transition"
                >
                  {navbarContent.login_button_text || 'Log In'}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-bold text-white rounded-xl neu-btn-primary transition shadow-md"
                >
                  {navbarContent.register_button_text || 'Join Branch'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 bg-[#e8edf5] shadow-[4px_4px_8px_#c5d0e0,-4px_-4px_8px_#ffffff] border border-white/80"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#e8edf5] border-t border-white/80 px-4 pt-3 pb-6 space-y-2 shadow-[0_8px_20px_#c5d0e0]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-ieee-blue hover:shadow-[inset_2px_2px_5px_#c5d0e0,inset_-2px_-2px_5px_#ffffff] transition"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-300/40 flex flex-col gap-2.5">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-bold bg-[#e8edf5] text-ieee-blue shadow-[4px_4px_10px_#c5d0e0,-4px_-4px_10px_#ffffff] rounded-xl block border border-white/80"
                >
                  Member Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-xs text-red-600 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-semibold text-slate-700 bg-[#e8edf5] shadow-[4px_4px_8px_#c5d0e0,-4px_-4px_8px_#ffffff] rounded-xl border border-white/80"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-bold text-white neu-btn-primary rounded-xl"
                >
                  Join Branch
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
