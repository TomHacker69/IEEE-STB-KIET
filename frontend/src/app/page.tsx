'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import {
  ArrowRight,
  Calendar,
  Activity,
  Award,
  BookOpen,
  Share2,
  Users,
  MapPin,
  ExternalLink,
  Quote,
  ShieldCheck,
  ChevronRight,
  Sparkles,
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
  const { data: activitiesRes } = useSWR('/activities?limit=3', fetcher, { revalidateOnFocus: true });
  const { data: socialRes } = useSWR('/social?limit=4', fetcher, { revalidateOnFocus: true });
  const { data: sponsorsRes } = useSWR('/sponsors', fetcher, { revalidateOnFocus: true });

  const dict = contentData?.dictionary || {};
  const heroContent = dict.hero || {};
  const aboutContent = dict.about || {};
  const highlightsContent = dict.highlights || {};

  const sectionsList = sectionsData?.data || [];
  // Build a lookup for section visibility & custom titles
  const sectionMap = new Map();
  sectionsList.forEach((s: any) => sectionMap.set(s.sectionKey, s));

  const isSectionVisible = (key: string) => {
    if (!sectionMap.has(key)) return true; // default visible if not explicitly hidden
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
  const activities = activitiesRes?.data || [];
  const socialPosts = socialRes?.data || [];
  const sponsors = sponsorsRes?.data || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      {isSectionVisible('hero') && (
        <section className="relative bg-gradient-to-br from-slate-950 via-ieee-dark to-slate-900 text-white py-24 sm:py-32 overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(#00b5e2_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {!heroContent.headline ? (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 text-ieee-cyan backdrop-blur-sm mb-6 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-ieee-cyan" />
                  <span>IEEE Student Branch</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
                  Empowering Technical Innovation & Leadership
                </h1>
                <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
                  KIET Group of Institutions Student Branch. Driving excellence across research, engineering, and student development.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/events"
                    className="px-6 py-3.5 rounded-xl text-sm font-bold bg-ieee-blue hover:bg-ieee-electric text-white shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>Explore Events</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/recruitment"
                    className="px-6 py-3.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 transition-all"
                  >
                    Join Branch
                  </Link>
                </div>
              </>
            ) : (
              <>
                {heroContent.badge_text && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 text-ieee-cyan backdrop-blur-sm mb-6 border border-white/10">
                    <Sparkles className="w-3.5 h-3.5 text-ieee-cyan" />
                    <span>{heroContent.badge_text}</span>
                  </div>
                )}

                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
                  {heroContent.headline}
                </h1>

                {heroContent.subtitle && (
                  <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
                    {heroContent.subtitle}
                  </p>
                )}

                {(heroContent.primary_cta || heroContent.secondary_cta) && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    {heroContent.primary_cta && (
                      <Link
                        href="/events"
                        className="px-6 py-3.5 rounded-xl text-sm font-bold bg-ieee-blue hover:bg-ieee-electric text-white shadow-lg transition-all flex items-center gap-2"
                      >
                        <span>{heroContent.primary_cta}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                    {heroContent.secondary_cta && (
                      <Link
                        href="/recruitment"
                        className="px-6 py-3.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 transition-all"
                      >
                        {heroContent.secondary_cta}
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* 2. HONORABLE DIGNITARIES SECTION (HOME PAGE ONLY) */}
      {isSectionVisible('dignitaries') && (
        <section className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              badge="Institutional Leadership"
              title={getSectionTitle('dignitaries', 'Honorable Dignitaries')}
              subtitle={getSectionSubtitle('dignitaries')}
            />

            {dignitaries.length === 0 ? (
              <EmptyState
                icon={Award}
                title="No Dignitaries Configured"
                description="The institutional dignitaries honor list has not been populated yet. Add dignitaries with photo, designation, and thoughts via the Admin Panel."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                {dignitaries.map((dig: any) => (
                  <div
                    key={dig._id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        {dig.photoUrl ? (
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shrink-0 border-2 border-ieee-blue/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={dig.photoUrl}
                              alt={dig.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0 text-xl border-2 border-slate-200">
                            {dig.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{dig.name}</h3>
                          <p className="text-xs font-semibold text-ieee-blue">{dig.designation}</p>
                          {dig.institution && (
                            <p className="text-[11px] text-slate-400">{dig.institution}</p>
                          )}
                        </div>
                      </div>

                      {dig.quote && (
                        <div className="p-3.5 bg-slate-50 rounded-xl text-xs italic text-slate-600 flex items-start gap-2 border border-slate-100">
                          <Quote className="w-4 h-4 text-ieee-cyan shrink-0 mt-0.5" />
                          <p className="leading-relaxed">&quot;{dig.quote}&quot;</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. ABOUT THE BRANCH SECTION */}
      {isSectionVisible('about') && (
        <section className="py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {!aboutContent.section_title && !aboutContent.description ? (
              <EmptyState
                icon={BookOpen}
                title="About Section Not Configured"
                description="Branch description and affiliation details have not been entered yet. Configure them in Admin Panel > Dynamic Site Content > About & Department."
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  {aboutContent.badge && (
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-ieee-blue border border-blue-100 mb-3">
                      {aboutContent.badge}
                    </span>
                  )}
                  {aboutContent.section_title && (
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {aboutContent.section_title}
                    </h2>
                  )}
                  {aboutContent.description && (
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {aboutContent.description}
                    </p>
                  )}

                  {(aboutContent.point_1 || aboutContent.point_2) && (
                    <div className="mt-6 space-y-3 text-xs text-slate-600">
                      {aboutContent.point_1 && (
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>{aboutContent.point_1}</span>
                        </div>
                      )}
                      {aboutContent.point_2 && (
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>{aboutContent.point_2}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-8">
                    <Link
                      href="/team"
                      className="inline-flex items-center gap-2 text-xs font-bold text-ieee-blue hover:text-ieee-dark"
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
                  <div className="grid grid-cols-2 gap-4">
                    {highlightsContent.members_count && (
                      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                        <p className="text-3xl font-extrabold text-ieee-blue">
                          {highlightsContent.members_count}
                        </p>
                        <p className="text-xs font-semibold text-slate-600 mt-1">Student Members</p>
                      </div>
                    )}
                    {highlightsContent.events_count && (
                      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                        <p className="text-3xl font-extrabold text-ieee-blue">
                          {highlightsContent.events_count}
                        </p>
                        <p className="text-xs font-semibold text-slate-600 mt-1">Events & Workshops</p>
                      </div>
                    )}
                    {highlightsContent.papers_count && (
                      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                        <p className="text-3xl font-extrabold text-ieee-blue">
                          {highlightsContent.papers_count}
                        </p>
                        <p className="text-xs font-semibold text-slate-600 mt-1">Research Publications</p>
                      </div>
                    )}
                    {highlightsContent.awards_count && (
                      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                        <p className="text-3xl font-extrabold text-ieee-blue">
                          {highlightsContent.awards_count}
                        </p>
                        <p className="text-xs font-semibold text-slate-600 mt-1">Section Awards</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center flex flex-col items-center justify-center">
                    <p className="text-xs font-semibold text-slate-400">
                      Highlights not configured yet. Set them under Admin &gt; Dynamic Site Content &gt; Branch Highlights.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. UPCOMING EVENTS PREVIEW */}
      {isSectionVisible('events') && (
        <section className="py-20 bg-slate-50 border-b border-slate-200">
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
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-ieee-blue hover:underline mb-8"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((evt: any) => (
                  <div
                    key={evt._id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {evt.coverImage ? (
                        <div className="h-48 w-full bg-slate-100 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={evt.coverImage}
                            alt={evt.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-28 w-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <Calendar className="w-8 h-8" />
                        </div>
                      )}

                      <div className="p-6 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-ieee-blue">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(evt.eventDate).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                          {evt.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{evt.description}</p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      {evt.registrationLink ? (
                        <a
                          href={evt.registrationLink}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2.5 rounded-lg text-xs font-bold bg-ieee-blue hover:bg-ieee-dark text-white text-center block transition"
                        >
                          Register Now ↗
                        </a>
                      ) : (
                        <Link
                          href="/events"
                          className="w-full py-2.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 text-center block hover:bg-slate-200 transition"
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

      {/* 5. SOCIAL MEDIA INSIGHTS ("WHAT'S HAPPENING AT IEEE") */}
      {isSectionVisible('social') && (
        <section className="py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              badge="Live Feed"
              title={getSectionTitle('social', "What's Happening at IEEE")}
              subtitle={getSectionSubtitle('social')}
            />

            {socialPosts.length === 0 ? (
              <EmptyState
                icon={Share2}
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
                    className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col justify-between group"
                  >
                    <div>
                      <div className="h-56 w-full overflow-hidden bg-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.imageUrl}
                          alt={post.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
                          {post.caption}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <a
                        href={post.postUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-ieee-blue hover:underline"
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
      {isSectionVisible('sponsors') && (
        <section className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              badge="Our Network"
              title={getSectionTitle('sponsors', 'Our Partners & Sponsors')}
              subtitle={getSectionSubtitle('sponsors')}
            />

            {sponsors.length === 0 ? (
              <EmptyState
                icon={Award}
                title="Sponsorship Directory Updating"
                description="We collaborate with industry leaders. Partner logos will be presented here."
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
                {sponsors.map((sp: any) => (
                  <div
                    key={sp._id}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-center h-24 hover:border-ieee-blue transition"
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
            )}
          </div>
        </section>
      )}

      {/* 7. DEVELOPERS CORNER (ABOVE FOOTER) */}
      {isSectionVisible('developers_corner') && <DevelopersCorner />}
    </div>
  );
}

