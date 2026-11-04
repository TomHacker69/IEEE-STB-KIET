'use client';

import React from 'react';
import useSWR from 'swr';
import { Code2, Github, Linkedin, Globe } from 'lucide-react';
import { fetcher } from '../lib/api';

export const DevelopersCorner: React.FC = () => {
  const { data: devRes } = useSWR('/dev-corner', fetcher);
  const profiles = devRes?.data || [];

  if (!profiles || profiles.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[#e8edf5] border-t border-white/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#e8edf5] text-ieee-blue shadow-[3px_3px_6px_#c5d0e0,-3px_-3px_6px_#ffffff] border border-white/80 mb-3.5">
            <Code2 className="w-4 h-4 text-ieee-blue" />
            <span>Engineering & Design Credits</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Developers Corner
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Engineered with modern architecture to grant the IEEE Student Branch full real-time autonomy.
          </p>
          <div className="w-14 h-1.5 bg-gradient-to-r from-ieee-blue to-ieee-cyan rounded-full mt-4 mx-auto shadow-[2px_2px_4px_#c5d0e0]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {profiles.map((dev: any) => (
            <div
              key={dev._id}
              className="p-6 rounded-3xl bg-[#e8edf5] shadow-[8px_8px_18px_#c5d0e0,-8px_-8px_18px_#ffffff] border border-white/80 flex flex-col justify-between hover:shadow-[10px_10px_22px_#c5d0e0,-10px_-10px_22px_#ffffff] transition-all group"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  {dev.photoUrl ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#e8edf5] p-1 shadow-[inset_3px_3px_6px_#c5d0e0,inset_-3px_-3px_6px_#ffffff] shrink-0 border border-white/80">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={dev.photoUrl} alt={dev.name} className="w-full h-full object-cover rounded-xl" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-[#e8edf5] shadow-[5px_5px_12px_#c5d0e0,-5px_-5px_12px_#ffffff] text-ieee-blue font-bold flex items-center justify-center shrink-0 text-xl border border-white/80">
                      {dev.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-ieee-blue transition">
                      {dev.name}
                    </h3>
                    <p className="text-xs font-semibold text-ieee-blue">{dev.role}</p>
                  </div>
                </div>

                {dev.bio && (
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {dev.bio}
                  </p>
                )}

                {dev.techStack && dev.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {dev.techStack.map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-[10px] font-semibold text-slate-700 rounded-lg bg-[#e8edf5] shadow-[inset_2px_2px_4px_#c5d0e0,inset_-2px_-2px_4px_#ffffff] border border-white/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Social links well */}
              <div className="pt-4 border-t border-slate-300/40 flex items-center gap-2.5">
                {dev.githubUrl && (
                  <a
                    href={dev.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-[#e8edf5] shadow-[3px_3px_6px_#c5d0e0,-3px_-3px_6px_#ffffff] hover:shadow-[inset_2px_2px_4px_#c5d0e0,inset_-2px_-2px_4px_#ffffff] border border-white/80 transition"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {dev.linkedinUrl && (
                  <a
                    href={dev.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl text-slate-600 hover:text-ieee-blue bg-[#e8edf5] shadow-[3px_3px_6px_#c5d0e0,-3px_-3px_6px_#ffffff] hover:shadow-[inset_2px_2px_4px_#c5d0e0,inset_-2px_-2px_4px_#ffffff] border border-white/80 transition"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {dev.portfolioUrl && (
                  <a
                    href={dev.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl text-slate-600 hover:text-ieee-cyan bg-[#e8edf5] shadow-[3px_3px_6px_#c5d0e0,-3px_-3px_6px_#ffffff] hover:shadow-[inset_2px_2px_4px_#c5d0e0,inset_-2px_-2px_4px_#ffffff] border border-white/80 transition"
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
