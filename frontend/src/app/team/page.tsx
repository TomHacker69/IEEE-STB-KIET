'use client';

import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Users, Quote, Linkedin, Github, Mail, Award, ArrowRight } from 'lucide-react';
import { fetcher } from '../../lib/api';
import { SectionHeader } from '../../components/SectionHeader';
import { EmptyState } from '../../components/EmptyState';

export default function TeamPage() {
  const { data: membersRes, isLoading } = useSWR('/members', fetcher);
  const grouped = membersRes?.grouped || {
    core_team: [],
    regular_member: [],
    content_member: [],
  };

  const coreTeam = grouped.core_team || [];
  const regularMembers = grouped.regular_member || [];
  const contentTeam = grouped.content_member || [];

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div>
          <SectionHeader
            badge="Student Leadership"
            title="Our Members & Executive Team"
            subtitle="The passionate student engineers, researchers, and content creators leading the IEEE Student Branch."
          />

          {/* Institutional Dignitaries Banner Link */}
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 mb-12 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ieee-blue text-white flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Looking for our Institutional Dignitaries & Branch Counselor?
                </p>
                <p className="text-[11px] text-slate-600">
                  Institutional leadership and branch counselors are respectfully featured on the Home Page.
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white text-ieee-blue hover:bg-ieee-blue hover:text-white border border-blue-200 transition shrink-0 flex items-center gap-1"
            >
              <span>View Dignitaries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 1. CORE TEAM SECTION */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2.5 h-6 bg-ieee-blue rounded-full" />
            <h3 className="text-xl font-bold text-slate-900">Executive Core Team</h3>
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
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      {member.photoUrl ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shrink-0 border-2 border-ieee-blue/20">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0 text-xl border-2 border-slate-200">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{member.name}</h4>
                        <p className="text-xs font-semibold text-ieee-blue">{member.designation}</p>
                        {member.department && (
                          <p className="text-[11px] text-slate-400">{member.department}</p>
                        )}
                      </div>
                    </div>

                    {member.quote && (
                      <div className="p-3.5 bg-slate-50 rounded-xl text-xs italic text-slate-600 flex items-start gap-2 border border-slate-100">
                        <Quote className="w-4 h-4 text-ieee-cyan shrink-0 mt-0.5" />
                        <p className="leading-relaxed">&quot;{member.quote}&quot;</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100 text-slate-400">
                    {member.socialLinks?.linkedin && (
                      <a
                        href={member.socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-blue-600 transition"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.socialLinks?.github && (
                      <a
                        href={member.socialLinks.github}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-slate-800 transition"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="hover:text-ieee-blue transition"
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

        {/* 2. REGULAR & CONTENT MEMBERS */}
        {(regularMembers.length > 0 || contentTeam.length > 0) && (
          <section className="pt-8 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2.5 h-6 bg-ieee-cyan rounded-full" />
              <h3 className="text-xl font-bold text-slate-900">General & Content Members</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {[...regularMembers, ...contentTeam].map((m: any) => (
                <div
                  key={m._id}
                  className="bg-white rounded-xl p-4 border border-slate-200 text-center shadow-sm flex flex-col items-center"
                >
                  {m.photoUrl ? (
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 mb-2 border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center mb-2 text-sm border border-slate-200">
                      {m.name.charAt(0)}
                    </div>
                  )}

                  <h5 className="text-xs font-bold text-slate-900 truncate w-full">{m.name}</h5>
                  <p className="text-[11px] text-ieee-blue font-medium truncate w-full">
                    {m.designation}
                  </p>
                  {m.department && (
                    <p className="text-[10px] text-slate-400 mt-0.5">{m.department}</p>
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

