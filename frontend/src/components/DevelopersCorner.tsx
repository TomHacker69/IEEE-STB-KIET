'use client';

import React from 'react';
import useSWR from 'swr';
import { Code2, Github, Linkedin, Globe, Sparkles } from 'lucide-react';
import { fetcher } from '../lib/api';

export const DevelopersCorner: React.FC = () => {
  const { data: devRes } = useSWR('/dev-corner', fetcher);
  const profiles = devRes?.data || [];

  if (!profiles || profiles.length === 0) {
    return null; // Clean empty state or hidden if no developer profiles are configured
  }

  return (
    <section className="py-16 bg-slate-900 text-white border-t border-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-ieee-cyan backdrop-blur-sm mb-3">
            <Code2 className="w-3.5 h-3.5" />
            <span>Engineering & Design Credits</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Developers Corner
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Engineered with modern architecture to grant the IEEE Student Branch full real-time autonomy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {profiles.map((dev: any) => (
            <div
              key={dev._id}
              className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 backdrop-blur-sm shadow-xl flex flex-col justify-between hover:border-ieee-cyan/50 transition group"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  {dev.photoUrl ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-700 shrink-0 border-2 border-ieee-cyan/30 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={dev.photoUrl} alt={dev.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ieee-blue to-ieee-cyan text-white font-bold flex items-center justify-center shrink-0 text-xl shadow-md">
                      {dev.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-ieee-cyan transition">
                      {dev.name}
                    </h3>
                    <p className="text-xs font-medium text-ieee-cyan">{dev.role}</p>
                  </div>
                </div>

                {dev.story && (
                  <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/40">
                    &quot;{dev.story}&quot;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-700/60 text-slate-400">
                {dev.githubUrl && (
                  <a
                    href={dev.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-700 transition"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {dev.linkedinUrl && (
                  <a
                    href={dev.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-900 hover:text-ieee-cyan hover:bg-slate-700 transition"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {dev.portfolioUrl && (
                  <a
                    href={dev.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-900 hover:text-emerald-400 hover:bg-slate-700 transition"
                    title="Portfolio"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

