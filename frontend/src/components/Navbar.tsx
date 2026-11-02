'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react';
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
  const collegeName = brandingContent.college_name || navbarContent.college_name || '';
  const logoUrl = brandingContent.logo_url || '';

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={brandTitle} className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ieee-blue to-ieee-dark flex items-center justify-center text-white font-extrabold text-sm shadow-md group-hover:scale-105 transition">
                IEEE
              </div>
            )}
            <div>
              <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight block leading-tight group-hover:text-ieee-blue transition">
                {brandTitle}
              </span>
              {collegeName && (
                <span className="text-[11px] text-slate-500 font-medium block">
                  {collegeName}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'text-ieee-blue bg-blue-50/80 font-bold'
                      : 'text-slate-600 hover:text-ieee-blue hover:bg-slate-50'
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-50 text-ieee-blue hover:bg-blue-100 border border-blue-200 transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => logout()}
                  title="Sign Out"
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-ieee-blue transition"
                >
                  {navbarContent.login_button_text || 'Log In'}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-ieee-blue hover:bg-ieee-dark rounded-lg shadow-sm transition"
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
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-ieee-blue"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-bold bg-blue-50 text-ieee-blue rounded-lg block"
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
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-bold text-white bg-ieee-blue rounded-lg"
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

