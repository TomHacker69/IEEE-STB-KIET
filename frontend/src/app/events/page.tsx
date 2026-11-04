'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { Calendar, MapPin, ExternalLink, Clock, Tag } from 'lucide-react';
import { fetcher } from '../../lib/api';
import { SectionHeader } from '../../components/SectionHeader';
import { EmptyState } from '../../components/EmptyState';

export default function EventsPage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const { data: eventsRes, error, isLoading } = useSWR(
    `/events${filter === 'all' ? '' : `?status=${filter}`}`,
    fetcher
  );

  const events = eventsRes?.data || [];

  return (
    <div className="py-16 bg-[#e8edf5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Branch Calendar"
          title="Events, Hackathons & Workshops"
          subtitle="Discover technical competitions, guest lectures from IEEE fellows, and hands-on laboratory workshops."
        />

        {/* Filter Tabs in Neumorphic Track */}
        <div className="flex justify-center mb-12">
          <div className="neu-inset p-2 rounded-2xl inline-flex gap-2">
            {[
              { key: 'upcoming', label: 'Upcoming Events' },
              { key: 'past', label: 'Past Archives' },
              { key: 'all', label: 'All Events' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  filter === tab.key
                    ? 'neu-pill-active text-ieee-blue shadow-[inset_3px_3px_6px_#c4d0e0,inset_-3px_-3px_6px_#ffffff]'
                    : 'neu-btn text-slate-600 hover:text-ieee-blue'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-ieee-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={filter === 'upcoming' ? 'No Upcoming Events at this Moment' : 'No Events in this Category'}
            description="Our event chairs and coordinators are planning new technical sessions. Check back soon or follow our social channels!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((evt: any) => (
              <div
                key={evt._id}
                className="neu-card rounded-3xl border border-white/60 overflow-hidden flex flex-col justify-between hover:shadow-[-10px_-10px_20px_#ffffff,10px_10px_20px_#c4d0e0] transition-all duration-300"
              >
                <div>
                  {evt.coverImage ? (
                    <div className="h-52 w-full bg-[#e8edf5] overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={evt.coverImage} alt={evt.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full neu-card-sm text-slate-800 bg-[#e8edf5]/90 backdrop-blur-sm border border-white/80">
                        {evt.status}
                      </span>
                    </div>
                  ) : (
                    <div className="h-32 w-full bg-[#e8edf5] shadow-[inset_2px_2px_5px_#c4d0e0,inset_-2px_-2px_5px_#ffffff] flex items-center justify-center text-slate-400">
                      <Calendar className="w-8 h-8" />
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-ieee-blue">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(evt.eventDate).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 leading-snug">{evt.title}</h3>

                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>

                    <div className="pt-2 flex flex-col gap-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2 neu-inset px-3 py-2 rounded-xl">
                        <MapPin className="w-3.5 h-3.5 text-ieee-blue shrink-0" />
                        <span className="truncate">Venue: {evt.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 neu-inset px-3 py-2 rounded-xl">
                        <Tag className="w-3.5 h-3.5 text-ieee-cyan shrink-0" />
                        <span className="capitalize font-semibold">Mode: {evt.mode}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  {evt.registrationLink && evt.status !== 'past' ? (
                    <a
                      href={evt.registrationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="neu-btn-primary w-full py-3 rounded-xl text-xs font-bold text-white text-center block transition flex items-center justify-center gap-1.5"
                    >
                      <span>Register for Event</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="neu-pill w-full py-3 text-xs font-semibold text-slate-500 text-center block">
                      {evt.status === 'past' ? 'Event Concluded' : 'Registration Opening Soon'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
