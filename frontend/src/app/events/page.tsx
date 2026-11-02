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
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Branch Calendar"
          title="Events, Hackathons & Workshops"
          subtitle="Discover technical competitions, guest lectures from IEEE fellows, and hands-on laboratory workshops."
        />

        {/* Filter Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            {[
              { key: 'upcoming', label: 'Upcoming Events' },
              { key: 'past', label: 'Past Archives' },
              { key: 'all', label: 'All Events' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition ${
                  filter === tab.key
                    ? 'bg-ieee-blue text-white shadow-sm'
                    : 'text-slate-600 hover:text-ieee-blue'
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
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {evt.coverImage ? (
                    <div className="h-52 w-full bg-slate-100 overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={evt.coverImage} alt={evt.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow bg-slate-900/80 text-white backdrop-blur-sm">
                        {evt.status}
                      </span>
                    </div>
                  ) : (
                    <div className="h-32 w-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Calendar className="w-8 h-8" />
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-ieee-blue">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(evt.eventDate).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{evt.title}</h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>

                    <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Venue: {evt.venue}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-slate-600">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        <span className="capitalize">Mode: {evt.mode}</span>
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
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-ieee-blue hover:bg-ieee-dark text-white text-center block transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>Register for Event</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-500 text-center block">
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

