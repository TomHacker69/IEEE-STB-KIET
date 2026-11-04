'use client';

import React from 'react';
import useSWR from 'swr';
import { Activity as ActivityIcon, Calendar, Tag } from 'lucide-react';
import { fetcher } from '../../lib/api';
import { SectionHeader } from '../../components/SectionHeader';
import { EmptyState } from '../../components/EmptyState';

export default function ActivitiesPage() {
  const { data: actRes, isLoading } = useSWR('/activities', fetcher);
  const activities = actRes?.data || [];

  return (
    <div className="py-16 bg-[#e8edf5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Branch Activities"
          title="Our Technical & Community Engagements"
          subtitle="Explore the hands-on project cohorts, industrial tours, outreach sessions, and coding competitions conducted by IEEE STB."
        />

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-ieee-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <EmptyState
            icon={ActivityIcon}
            title="No Activity Archives Available"
            description="Branch activities and outreach photo archives will appear here once published."
          />
        ) : (
          <div className="space-y-12">
            {activities.map((act: any, idx: number) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={act._id}
                  className={`neu-card rounded-3xl border border-white/60 overflow-hidden flex flex-col ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } items-stretch gap-0 hover:shadow-[-10px_-10px_20px_#ffffff,10px_10px_20px_#c4d0e0] transition-all duration-300`}
                >
                  {/* Photo Section */}
                  <div className="lg:w-1/2 min-h-[280px] bg-[#e8edf5] relative overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]">
                    {act.images && act.images.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={act.images[0]}
                        alt={act.title}
                        className="w-full h-full object-cover min-h-[300px]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ActivityIcon className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="lg:w-1/2 p-8 sm:p-10 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-ieee-blue neu-pill px-3 py-1 w-fit">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(act.date).toLocaleDateString()}</span>
                      </div>

                      <h3 className="text-2xl font-extrabold text-slate-800 leading-snug">
                        {act.title}
                      </h3>

                      <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                        {act.description}
                      </p>
                    </div>

                    {act.tags && act.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-300/40 mt-6">
                        {act.tags.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="neu-pill inline-flex items-center gap-1.5 text-xs font-bold text-ieee-blue px-3 py-1.5"
                          >
                            <Tag className="w-3 h-3 text-ieee-cyan" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
