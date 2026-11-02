'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Mail, MapPin, Phone, ExternalLink, Code2 } from 'lucide-react';
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
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          {/* Branch Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-lg tracking-wider">IEEE</span>
              <span className="text-xs text-ieee-cyan font-bold tracking-widest uppercase">STB</span>
            </div>
            {branchName || collegeName || departmentName ? (
              <p className="text-xs text-slate-400 leading-relaxed">
                {branchName} {collegeName ? `at ${collegeName}.` : ''} {departmentName ? `Operating proudly under the ${departmentName}.` : ''}
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Branch details not configured. Configure via Admin Panel &gt; Dynamic Site Content &gt; Footer.
              </p>
            )}
            {disclaimer && (
              <p className="text-[11px] text-slate-500 italic">
                {disclaimer}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/events" className="hover:text-ieee-cyan transition">Events & Workshops</Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-ieee-cyan transition">Our Members & Core Team</Link>
              </li>
              <li>
                <Link href="/activities" className="hover:text-ieee-cyan transition">Branch Activities</Link>
              </li>
              <li>
                <Link href="/research" className="hover:text-ieee-cyan transition">Research Publications</Link>
              </li>
              <li>
                <Link href="/social" className="hover:text-ieee-cyan transition">Social Media Insights</Link>
              </li>
              <li>
                <Link href="/recruitment" className="hover:text-ieee-cyan transition">Recruitment & Join IEEE</Link>
              </li>
            </ul>
          </div>

          {/* Official IEEE Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">IEEE Network</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://www.ieee.org" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <span>IEEE Global</span> <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://ieeexplore.ieee.org" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <span>IEEE Xplore Digital Library</span> <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://students.ieee.org" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <span>IEEE Students</span> <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://standards.ieee.org" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <span>IEEE Standards Association</span> <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Branch Contact</h4>
            <div className="space-y-2 text-xs text-slate-400">
              {address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-ieee-cyan shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-ieee-cyan shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-white transition">
                    {email}
                  </a>
                </div>
              )}
              {!address && !email && (
                <p className="text-xs text-slate-500 italic">
                  Branch contact details updating soon.
                </p>
              )}
            </div>

            <div className="pt-2">
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-slate-700 transition"
              >
                <span>Admin Portal Login</span> ↗
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Developers Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{copyright}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Code2 className="w-3.5 h-3.5 text-ieee-cyan" />
            <span>Designed & Engineered for IEEE STB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

