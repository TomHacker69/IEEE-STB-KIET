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
    <div className="py-16 bg-slate-50 min-h-screen">
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
                  className={`bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } items-stretch gap-0`}
                >
                  {/* Photo Section */}
                  <div className="lg:w-1/2 min-h-[280px] bg-slate-100 relative overflow-hidden">
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
                      <div className="flex items-center gap-2 text-xs font-semibold text-ieee-blue">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(act.date).toLocaleDateString()}</span>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                        {act.title}
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {act.description}
                      </p>
                    </div>

                    {act.tags && act.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-6 border-t border-slate-100 mt-6">
                        {act.tags.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-ieee-blue px-2.5 py-1 rounded-md"
                          >
                            <Tag className="w-3 h-3" />
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

