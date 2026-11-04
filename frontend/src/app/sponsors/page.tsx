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
    <div className="py-16 bg-[#e8edf5] min-h-screen">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sponsors.map((sp: any) => (
              <div
                key={sp._id}
                className="neu-card rounded-3xl p-6 border border-white/60 flex flex-col items-center text-center justify-between hover:shadow-[-10px_-10px_20px_#ffffff,10px_10px_20px_#c4d0e0] transition-all duration-300"
              >
                <div className="w-full flex flex-col items-center">
                  <div className="w-36 h-24 neu-inset rounded-2xl p-3 flex items-center justify-center mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sp.logoUrl}
                      alt={sp.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{sp.name}</h3>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-ieee-blue neu-pill px-3 py-1 mt-2">
                    {sp.tier} Partner
                  </span>
                </div>

                {sp.websiteUrl && (
                  <div className="mt-6 pt-5 border-t border-slate-300/40 w-full">
                    <a
                      href={sp.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="neu-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-ieee-blue hover:text-ieee-dark transition"
                    >
                      <span>Visit Partner Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
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
