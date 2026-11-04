'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import {
  ArrowRight,
  Calendar,
  Quote,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { fetcher } from '../lib/api';
import { SectionHeader } from '../components/SectionHeader';
import { DevelopersCorner } from '../components/DevelopersCorner';
import { EmptyState } from '../components/EmptyState';

export default function HomePage() {
  // Real-time dynamic fetch of site content & section order
  const { data: contentData } = useSWR('/content', fetcher, { revalidateOnFocus: true });
  const { data: sectionsData } = useSWR('/sections', fetcher, { revalidateOnFocus: true });

  // Real-time fetch of entities
  const { data: dignitariesRes } = useSWR('/dignitaries', fetcher, { revalidateOnFocus: true });
  const { data: eventsRes } = useSWR('/events?status=upcoming&limit=3', fetcher, { revalidateOnFocus: true });
  const { data: socialRes } = useSWR('/social?limit=4', fetcher, { revalidateOnFocus: true });
  const { data: sponsorsRes } = useSWR('/sponsors', fetcher, { revalidateOnFocus: true });

  const dict = contentData?.dictionary || {};
  const heroContent = dict.hero || {};
  const aboutContent = dict.about || {};
  const highlightsContent = dict.highlights || {};

  const sectionsList = sectionsData?.data || [];
  const sectionMap = new Map();
  sectionsList.forEach((s: any) => sectionMap.set(s.sectionKey, s));

  const isSectionVisible = (key: string) => {
    if (!sectionMap.has(key)) return true;
    return sectionMap.get(key).isVisible;
  };

  const getSectionTitle = (key: string, defaultName?: string) => {
    return sectionMap.get(key)?.title || defaultName || '';
  };

  const getSectionSubtitle = (key: string) => {
    return sectionMap.get(key)?.subtitle || '';
  };

  const dignitaries = dignitariesRes?.data || [];
  const events = eventsRes?.data || [];
  const socialPosts = socialRes?.data || [];
  const sponsors = sponsorsRes?.data || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#e8edf5]">
      {/* 1. HERO SECTION */}
      {isSectionVisible('hero') && (
        <section className="relative py-24 sm:py-32 overflow-hidden border-b border-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#e8edf5] text-ieee-blue shadow-[3px_3px_6px_#c5d0e0,-3px_-3px_6px_#ffffff] border border-white/80 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-ieee-blue" />
              <span>{heroContent.badge_text || 'IEEE Student Branch KIET'}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto text-slate-900 leading-tight sm:leading-none">
              {heroContent.headline || 'Empowering Technical Innovation & Leadership'}
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              {heroContent.subtitle ||
                'KIET Group of Institutions Student Branch. Driving excellence across research, engineering, and student development.'}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/events"
                className="px-7 py-3.5 rounded-2xl text-sm font-bold text-white neu-btn-primary transition-all flex items-center gap-2 shadow-neu-primary"
              >
                <span>{heroContent.primary_cta || 'Explore Events'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/recruitment"
                className="px-7 py-3.5 rounded-2xl text-sm font-bold text-slate-700 hover:text-ieee-blue bg-[#e8edf5] shadow-[6px_6px_14px_#c5d0e0,-6px_-6px_14px_#ffffff] hover:shadow-[4px_4px_8px_#c5d0e0,-4px_-4px_8px_#ffffff] border border-white/80 transition-all"
              >
                {heroContent.secondary_cta || 'Join Branch'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 2. HONORABLE DIGNITARIES SECTION */}
      {isSectionVisible('dignitaries') && dignitaries.length > 0 && (
        <section className="py-20 border-b border-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              badge="Institutional Leadership"
              title={getSectionTitle('dignitaries', 'Honorable Dignitaries')}
              subtitle={getSectionSubtitle('dignitaries')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {dignitaries.map((dig: any) => (
                <div
                  key={dig._id}
                  className="p-6 rounded-3xl bg-[#e8edf5] shadow-[8px_8px_18px_#c5d0e0,-8px_-8px_18px_#ffffff] border border-white/80 flex flex-col justify-between hover:shadow-[10px_10px_22px_#c5d0e0,-10px_-10px_22px_#ffffff] transition-all"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      {dig.photoUrl ? (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#e8edf5] p-1 shadow-[inset_3px_3px_6px_#c5d0e0,inset_-3px_-3px_6px_#ffffff] shrink-0 border border-white/80">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={dig.photoUrl}
                            alt={dig.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-[#e8edf5] shadow-[5px_5px_12px_#c5d0e0,-5px_-5px_12px_#ffffff] text-ieee-blue font-bold flex items-center justify-center shrink-0 text-xl border border-white/80">
                          {dig.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{dig.name}</h3>
                        <p className="text-xs font-semibold text-ieee-blue">{dig.designation}</p>
                        {dig.institution && (
                          <p className="text-[11px] text-slate-500 font-medium">{dig.institution}</p>
                        )}
                      </div>
                    </div>

                    {dig.quote && (
                      <div className="p-4 bg-[#e8edf5] rounded-2xl text-xs italic text-slate-600 flex items-start gap-2.5 shadow-[inset_3px_3px_6px_#c5d0e0,inset_-3px_-3px_6px_#ffffff] border border-white/60">
                        <Quote className="w-4 h-4 text-ieee-blue shrink-0 mt-0.5" />
                        <p className="leading-relaxed">&quot;{dig.quote}&quot;</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. ABOUT THE BRANCH SECTION */}
      {isSectionVisible('about') && (
        <section className="py-20 border-b border-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="p-8 sm:p-10 rounded-3xl bg-[#e8edf5] shadow-[8px_8px_18px_#c5d0e0,-8px_-8px_18px_#ffffff] border border-white/80">
                <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#e8edf5] text-ieee-blue shadow-[3px_3px_6px_#c5d0e0,-3px_-3px_6px_#ffffff] border border-white/80 mb-4">
                  {aboutContent.badge || 'About Our Branch'}
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {aboutContent.section_title || 'Advancing Technology for Humanity'}
                </h2>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {aboutContent.description ||
                    'IEEE Student Branch at KIET Group of Institutions is dedicated to cultivating technical excellence, research capability, and leadership among students through workshops, hackathons, and global networking opportunities.'}
                </p>

                {(aboutContent.point_1 || aboutContent.point_2) && (
                  <div className="mt-6 space-y-3 text-xs text-slate-700">
                    {aboutContent.point_1 && (
                      <div className="flex items-center gap-2.5">
                        <div className="p-1 rounded-lg bg-[#e8edf5] shadow-[inset_2px_2px_4px_#c5d0e0,inset_-2px_-2px_4px_#ffffff]">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-medium">{aboutContent.point_1}</span>
                      </div>
                    )}
                    {aboutContent.point_2 && (
                      <div className="flex items-center gap-2.5">
                        <div className="p-1 rounded-lg bg-[#e8edf5] shadow-[inset_2px_2px_4px_#c5d0e0,inset_-2px_-2px_4px_#ffffff]">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-medium">{aboutContent.point_2}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8">
                  <Link
                    href="/team"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-ieee-blue bg-[#e8edf5] shadow-[4px_4px_10px_#c5d0e0,-4px_-4px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5d0e0,-2px_-2px_5px_#ffffff] border border-white/80 transition"
                  >
                    <span>{aboutContent.cta_text || 'Meet Our Core Team & Leads'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Highlights Metric Boxes */}
              {(highlightsContent.members_count ||
              highlightsContent.events_count ||
              highlightsContent.papers_count ||
              highlightsContent.awards_count) ? (
                <div className="grid grid-cols-2 gap-6">
                  {highlightsContent.members_count && (
                    <div className="p-7 rounded-3xl bg-[#e8edf5] shadow-[6px_6px_14px_#c5d0e0,-6px_-6px_14px_#ffffff] border border-white/80 text-center">
                      <p className="text-3xl sm:text-4xl font-black text-ieee-blue">
                        {highlightsContent.members_count}
                      </p>
                      <p className="text-xs font-semibold text-slate-600 mt-2">Student Members</p>
                    </div>
                  )}
                  {highlightsContent.events_count && (
                    <div className="p-7 rounded-3xl bg-[#e8edf5] shadow-[6px_6px_14px_#c5d0e0,-6px_-6px_14px_#ffffff] border border-white/80 text-center">
                      <p className="text-3xl sm:text-4xl font-black text-ieee-blue">
                        {highlightsContent.events_count}
                      </p>
                      <p className="text-xs font-semibold text-slate-600 mt-2">Events & Workshops</p>
                    </div>
                  )}
                  {highlightsContent.papers_count && (
                    <div className="p-7 rounded-3xl bg-[#e8edf5] shadow-[6px_6px_14px_#c5d0e0,-6px_-6px_14px_#ffffff] border border-white/80 text-center">
                      <p className="text-3xl sm:text-4xl font-black text-ieee-blue">
                        {highlightsContent.papers_count}
                      </p>
                      <p className="text-xs font-semibold text-slate-600 mt-2">Research Publications</p>
                    </div>
                  )}
                  {highlightsContent.awards_count && (
                    <div className="p-7 rounded-3xl bg-[#e8edf5] shadow-[6px_6px_14px_#c5d0e0,-6px_-6px_14px_#ffffff] border border-white/80 text-center">
                      <p className="text-3xl sm:text-4xl font-black text-ieee-blue">
                        {highlightsContent.awards_count}
                      </p>
                      <p className="text-xs font-semibold text-slate-600 mt-2">Section Awards</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}

      {/* 4. UPCOMING EVENTS PREVIEW */}
      {isSectionVisible('events') && (
        <section className="py-20 border-b border-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <SectionHeader
                  badge="What's Next"
                  title={getSectionTitle('events', 'Events & Hackathons')}
                  subtitle={getSectionSubtitle('events')}
                  centered={false}
                />
              </div>
              <Link
                href="/events"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-ieee-blue bg-[#e8edf5] shadow-[3px_3px_6px_#c5d0e0,-3px_-3px_6px_#ffffff] border border-white/80 hover:shadow-[inset_2px_2px_4px_#c5d0e0,inset_-2px_-2px_4px_#ffffff] transition mb-8"
              >
                <span>View All Events</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {events.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No Upcoming Events Scheduled"
                description="Stay tuned! Our event team is preparing the upcoming semester schedule."
                actionHref="/events"
                actionLabel="Browse Past Events"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((evt: any) => (
                  <div
                    key={evt._id}
                    className="rounded-3xl bg-[#e8edf5] shadow-[8px_8px_18px_#c5d0e0,-8px_-8px_18px_#ffffff] border border-white/80 overflow-hidden flex flex-col justify-between hover:shadow-[10px_10px_22px_#c5d0e0,-10px_-10px_22px_#ffffff] transition-all"
                  >
                    <div>
                      {evt.coverImage ? (
                        <div className="h-48 w-full p-3 pb-0">
                          <div className="w-full h-full rounded-2xl overflow-hidden shadow-[inset_2px_2px_4px_#c5d0e0,inset_-2px_-2px_4px_#ffffff]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={evt.coverImage}
                              alt={evt.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="h-32 w-full flex items-center justify-center text-slate-400">
                          <Calendar className="w-8 h-8" />
                        </div>
                      )}

                      <div className="p-6 space-y-2.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold text-ieee-blue bg-[#e8edf5] shadow-[inset_2px_2px_4px_#c5d0e0,inset_-2px_-2px_4px_#ffffff]">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(evt.eventDate).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                          {evt.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{evt.description}</p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      {evt.registrationLink ? (
                        <a
                          href={evt.registrationLink}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-3 rounded-xl text-xs font-bold text-white neu-btn-primary text-center block transition shadow-md"
                        >
                          Register Now ↗
                        </a>
                      ) : (
                        <Link
                          href="/events"
                          className="w-full py-3 rounded-xl text-xs font-bold text-slate-700 bg-[#e8edf5] shadow-[4px_4px_8px_#c5d0e0,-4px_-4px_8px_#ffffff] text-center block hover:text-ieee-blue border border-white/80 transition"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. SOCIAL MEDIA INSIGHTS */}
      {isSectionVisible('social') && (
        <section className="py-20 border-b border-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              badge="Live Feed"
              title={getSectionTitle('social', "What's Happening at IEEE")}
              subtitle={getSectionSubtitle('social')}
            />

            {socialPosts.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No Social Posts Shared Yet"
                description="Follow our social channels to catch up on the latest branch happenings."
                actionHref="/social"
                actionLabel="Visit Social Hub"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {socialPosts.map((post: any) => (
                  <div
                    key={post._id}
                    className="p-4 rounded-3xl bg-[#e8edf5] shadow-[8px_8px_18px_#c5d0e0,-8px_-8px_18px_#ffffff] border border-white/80 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="h-52 w-full rounded-2xl overflow-hidden bg-[#e8edf5] shadow-[inset_2px_2px_5px_#c5d0e0,inset_-2px_-2px_5px_#ffffff]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.imageUrl}
                          alt={post.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
                          {post.caption}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 pt-0">
                      <a
                        href={post.postUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-ieee-blue bg-[#e8edf5] shadow-[2px_2px_5px_#c5d0e0,-2px_-2px_5px_#ffffff] border border-white/80"
                      >
                        <span>View on {post.platform}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. SPONSORS & PARTNERS */}
      {isSectionVisible('sponsors') && sponsors.length > 0 && (
        <section className="py-20 border-b border-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              badge="Our Network"
              title={getSectionTitle('sponsors', 'Our Partners & Sponsors')}
              subtitle={getSectionSubtitle('sponsors')}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
              {sponsors.map((sp: any) => (
                <div
                  key={sp._id}
                  className="p-5 rounded-2xl bg-[#e8edf5] shadow-[5px_5px_12px_#c5d0e0,-5px_-5px_12px_#ffffff] border border-white/80 flex items-center justify-center h-24 hover:shadow-[7px_7px_15px_#c5d0e0,-7px_-7px_15px_#ffffff] transition"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sp.logoUrl}
                    alt={sp.name}
                    className="max-h-12 max-w-full object-contain filter grayscale hover:grayscale-0 transition"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. DEVELOPERS CORNER */}
      {isSectionVisible('developers_corner') && <DevelopersCorner />}
    </div>
  );
}
