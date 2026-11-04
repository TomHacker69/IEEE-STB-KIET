'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Mail, MapPin, ExternalLink, Code2 } from 'lucide-react';
import { fetcher } from '../lib/api';

export const Footer: React.FC = () => {
  const { data: contentData } = useSWR('/content', fetcher);
  const dict = contentData?.dictionary || {};
  const footerContent = dict.footer || {};
  const brandingContent = dict.branding || {};

  const branchName = brandingContent.branch_name || footerContent.branch_name || '';
  const collegeName = brandingContent.college_name || footerContent.college_name || '';
  const departmentName = footerContent.department_name || '';
  const address = footerContent.address || '';
  const email = footerContent.email || '';
  const copyright = footerContent.copyright || `© ${new Date().getFullYear()} IEEE Student Branch.`;
  const disclaimer = footerContent.disclaimer || '';

  return (
    <footer className="bg-[#e8edf5] text-slate-600 border-t border-white/90 shadow-[0_-8px_24px_#c5d0e0] pt-16 pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-300/60">
          {/* Branch Bio in Neumorphic Card */}
          <div className="p-6 rounded-3xl bg-[#e8edf5] shadow-[6px_6px_14px_#c5d0e0,-6px_-6px_14px_#ffffff] border border-white/80 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-xl bg-[#e8edf5] shadow-[3px_3px_6px_#c5d0e0,-3px_-3px_6px_#ffffff] border border-white/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpg" alt="IEEE Logo" className="h-8 w-auto object-contain rounded-lg" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-sm tracking-wide block">IEEE STB</span>
                <span className="text-[10px] text-ieee-blue font-bold tracking-widest uppercase block">KIET Branch</span>
              </div>
            </div>
            {branchName || collegeName || departmentName ? (
              <p className="text-xs text-slate-600 leading-relaxed">
                {branchName} {collegeName ? `at ${collegeName}.` : ''} {departmentName ? `Operating proudly under the ${departmentName}.` : ''}
              </p>
            ) : null}
            {disclaimer && (
              <p className="text-[11px] text-slate-500 italic pt-1">
                {disclaimer}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div className="p-6 rounded-3xl bg-[#e8edf5] shadow-[6px_6px_14px_#c5d0e0,-6px_-6px_14px_#ffffff] border border-white/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-ieee-blue">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/events" className="hover:text-ieee-blue transition flex items-center gap-1.5 font-medium">
                  Events & Workshops
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-ieee-blue transition flex items-center gap-1.5 font-medium">
                  Our Members & Core Team
                </Link>
              </li>
              <li>
                <Link href="/activities" className="hover:text-ieee-blue transition flex items-center gap-1.5 font-medium">
                  Branch Activities
                </Link>
              </li>
              <li>
                <Link href="/research" className="hover:text-ieee-blue transition flex items-center gap-1.5 font-medium">
                  Research Publications
                </Link>
              </li>
              <li>
                <Link href="/social" className="hover:text-ieee-blue transition flex items-center gap-1.5 font-medium">
                  Social Media Hub
                </Link>
              </li>
              <li>
                <Link href="/recruitment" className="hover:text-ieee-blue transition flex items-center gap-1.5 font-medium">
                  Recruitment & Join IEEE
                </Link>
              </li>
            </ul>
          </div>

          {/* Official IEEE Links */}
          <div className="p-6 rounded-3xl bg-[#e8edf5] shadow-[6px_6px_14px_#c5d0e0,-6px_-6px_14px_#ffffff] border border-white/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-ieee-blue">IEEE Network</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="https://www.ieee.org" target="_blank" rel="noreferrer" className="hover:text-ieee-blue transition flex items-center justify-between">
                  <span>IEEE Global</span> <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://ieeexplore.ieee.org" target="_blank" rel="noreferrer" className="hover:text-ieee-blue transition flex items-center justify-between">
                  <span>IEEE Xplore Library</span> <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://students.ieee.org" target="_blank" rel="noreferrer" className="hover:text-ieee-blue transition flex items-center justify-between">
                  <span>IEEE Students</span> <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://standards.ieee.org" target="_blank" rel="noreferrer" className="hover:text-ieee-blue transition flex items-center justify-between">
                  <span>IEEE Standards</span> <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details in Neumorphic Inset */}
          {(address || email) ? (
            <div className="p-6 rounded-3xl bg-[#e8edf5] shadow-[6px_6px_14px_#c5d0e0,-6px_-6px_14px_#ffffff] border border-white/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-ieee-blue">Branch Contact</h4>
              <div className="space-y-3 text-xs text-slate-600">
                {address && (
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#e8edf5] shadow-[inset_2px_2px_4px_#c5d0e0,inset_-2px_-2px_4px_#ffffff]">
                      <MapPin className="w-3.5 h-3.5 text-ieee-blue shrink-0" />
                    </div>
                    <span>{address}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#e8edf5] shadow-[inset_2px_2px_4px_#c5d0e0,inset_-2px_-2px_4px_#ffffff]">
                      <Mail className="w-3.5 h-3.5 text-ieee-blue shrink-0" />
                    </div>
                    <a href={`mailto:${email}`} className="hover:text-ieee-blue transition font-medium">
                      {email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-[#e8edf5] shadow-[6px_6px_14px_#c5d0e0,-6px_-6px_14px_#ffffff] border border-white/80 flex flex-col justify-center items-center text-center">
              <span className="text-xs text-slate-500 font-medium">IEEE Student Branch KIET</span>
              <span className="text-[11px] text-slate-400 mt-1">Advancing Technology for Humanity</span>
            </div>
          )}
        </div>

        {/* Bottom Bar & Developers Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>{copyright}</p>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#e8edf5] shadow-[3px_3px_6px_#c5d0e0,-3px_-3px_6px_#ffffff] border border-white/80 text-[11px] text-slate-600">
            <Code2 className="w-3.5 h-3.5 text-ieee-blue" />
            <span>Designed & Engineered for IEEE STB KIET</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
