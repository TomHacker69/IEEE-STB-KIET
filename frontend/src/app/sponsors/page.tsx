'use client';

import React from 'react';
import useSWR from 'swr';
import { DollarSign, ExternalLink } from 'lucide-react';
import { fetcher } from '../../lib/api';
import { SectionHeader } from '../../components/SectionHeader';
import { EmptyState } from '../../components/EmptyState';

export default function SponsorsPage() {
  const { data: spRes, isLoading } = useSWR('/sponsors', fetcher);
  const sponsors = spRes?.data || [];

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Our Supporters"
          title="Corporate Partners & Sponsors"
          subtitle="We extend our deepest gratitude to our corporate sponsors, platform partners, and hackathon patrons."
        />

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-ieee-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sponsors.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="Partnership Directory Updating"
            description="Our sponsorship and outreach team is finalizing industry collaborations. Partner logos will be shown here."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sponsors.map((sp: any) => (
              <div
                key={sp._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center justify-between hover:border-ieee-blue hover:shadow-md transition"
              >
                <div className="w-full flex flex-col items-center">
                  <div className="w-32 h-20 bg-slate-50 rounded-xl p-3 flex items-center justify-center border border-slate-100 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sp.logoUrl}
                      alt={sp.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{sp.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ieee-blue bg-blue-50 px-2.5 py-0.5 rounded-full mt-1.5">
                    {sp.tier} Partner
                  </span>
                </div>

                {sp.websiteUrl && (
                  <div className="mt-6 pt-4 border-t border-slate-100 w-full">
                    <a
                      href={sp.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-ieee-blue transition"
                    >
                      <span>Visit Partner Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

