'use client';

import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Users, Linkedin, Github, Mail, Award, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { fetcher } from '../../lib/api';
import { SectionHeader } from '../../components/SectionHeader';
import { EmptyState } from '../../components/EmptyState';

export default function TeamPage() {
  const { data: membersRes, isLoading } = useSWR('/members', fetcher);
  const grouped = membersRes?.grouped || {
    core_team: [],
    regular_member: [],
  };

  const coreTeam = grouped.core_team || [];
  // Merge regular_member and any legacy content_member into regularMembers
  const regularMembers = [
    ...(grouped.regular_member || []),
    ...(grouped.content_member || []),
  ];

  return (
    <div className="py-16 bg-[#e8edf5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div>
          <SectionHeader
            badge="Student Leadership"
            title="Our Members & Executive Team"
            subtitle="The passionate student engineers, researchers, and technical leaders driving the IEEE Student Branch."
          />

          {/* Institutional Dignitaries Banner Link */}
          <div className="max-w-3xl mx-auto neu-card rounded-3xl p-5 sm:p-6 flex items-center justify-between gap-4 mb-12 border border-white/70">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e8edf5] shadow-[inset_2px_2px_5px_#c4d0e0,inset_-2px_-2px_5px_#ffffff] text-ieee-blue flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Looking for our Institutional Dignitaries & Branch Counselor?
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Institutional leadership and branch counselors (with words of wisdom) are featured on the Home Page.
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="neu-btn px-4 py-2.5 rounded-xl text-xs font-bold text-ieee-blue hover:text-ieee-dark transition shrink-0 flex items-center gap-1.5"
            >
              <span>View Dignitaries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 1. EXECUTIVE CORE TEAM */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-7 bg-gradient-to-b from-ieee-blue to-ieee-dark rounded-full shadow-[-2px_-2px_5px_#ffffff,2px_2px_5px_#c4d0e0]" />
            <div>
              <h3 className="text-xl font-extrabold text-slate-800">Executive Core Team</h3>
              <p className="text-xs text-slate-500 font-medium">Branch officers, coordinators, and domain leads</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="w-8 h-8 border-4 border-ieee-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : coreTeam.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Core Team Updating"
              description="Student branch executive council details are being finalized for this academic year."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreTeam.map((member: any) => (
                <div
                  key={member._id}
                  className="neu-card rounded-3xl p-7 border border-white/60 flex flex-col justify-between hover:shadow-[-10px_-10px_20px_#ffffff,10px_10px_20px_#c4d0e0] transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-5">
                      {member.photoUrl ? (
                        <div className="w-16 h-16 rounded-2xl p-1 neu-inset shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl neu-inset text-ieee-blue font-bold flex items-center justify-center shrink-0 text-xl">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="text-base font-bold text-slate-800">{member.name}</h4>
                        <p className="text-xs font-bold text-ieee-blue">{member.designation}</p>
                        {member.department && (
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">{member.department}</p>
                        )}
                        <span className="inline-block mt-1.5 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full neu-pill text-amber-700 bg-amber-50/50">
                          ★ Core Member
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-300/40">
                    {member.socialLinks?.linkedin && (
                      <a
                        href={member.socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="neu-btn p-2 rounded-xl text-slate-600 hover:text-blue-600 transition"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.socialLinks?.github && (
                      <a
                        href={member.socialLinks.github}
                        target="_blank"
                        rel="noreferrer"
                        className="neu-btn p-2 rounded-xl text-slate-600 hover:text-slate-900 transition"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="neu-btn p-2 rounded-xl text-slate-600 hover:text-ieee-blue transition"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. REGULAR MEMBERS */}
        {regularMembers.length > 0 && (
          <section className="pt-10 border-t border-slate-300/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-7 bg-gradient-to-b from-ieee-cyan to-ieee-blue rounded-full shadow-[-2px_-2px_5px_#ffffff,2px_2px_5px_#c4d0e0]" />
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">Regular Members</h3>
                <p className="text-xs text-slate-500 font-medium">Active student branch engineers and innovators</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {regularMembers.map((m: any) => (
                <div
                  key={m._id}
                  className="neu-card-sm rounded-2xl p-5 border border-white/60 text-center flex flex-col items-center hover:shadow-[-6px_-6px_12px_#ffffff,6px_6px_12px_#c4d0e0] transition"
                >
                  {m.photoUrl ? (
                    <div className="w-16 h-16 rounded-2xl p-1 neu-inset mb-3 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover rounded-xl" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl neu-inset text-ieee-blue font-bold flex items-center justify-center mb-3 text-base">
                      {m.name.charAt(0)}
                    </div>
                  )}

                  <h5 className="text-xs font-bold text-slate-800 truncate w-full">{m.name}</h5>
                  <p className="text-[11px] text-ieee-blue font-semibold truncate w-full mt-0.5">
                    {m.designation}
                  </p>
                  {m.department && (
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate w-full">{m.department}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
