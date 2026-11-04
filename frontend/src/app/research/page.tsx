'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { BookOpen, ExternalLink, Calendar, Search } from 'lucide-react';
import { fetcher } from '../../lib/api';
import { SectionHeader } from '../../components/SectionHeader';
import { EmptyState } from '../../components/EmptyState';

export default function ResearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: papersRes, isLoading } = useSWR('/research', fetcher);
  const papers = papersRes?.data || [];

  const filtered = papers.filter((p: any) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.title?.toLowerCase().includes(term) ||
      p.venue?.toLowerCase().includes(term) ||
      p.authors?.some((a: string) => a.toLowerCase().includes(term))
    );
  });

  return (
    <div className="py-16 bg-[#e8edf5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Scholarly Publications"
          title="Research Papers & Academic Literature"
          subtitle="Peer-reviewed publications, IEEE conference proceedings, and journal papers authored by members and faculty advisors."
        />

        {/* Neumorphic Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative neu-inset rounded-2xl">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by paper title, author, or venue..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Papers List */}
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-ieee-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={searchTerm ? 'No Papers Matched Search' : 'No Research Papers Published Yet'}
            description="Our student branch research cell regularly publishes findings in IEEE Xplore. Verified papers will appear here."
          />
        ) : (
          <div className="space-y-8">
            {filtered.map((paper: any) => (
              <div
                key={paper._id}
                className="neu-card rounded-3xl border border-white/60 p-6 sm:p-8 space-y-4 hover:shadow-[-10px_-10px_20px_#ffffff,10px_10px_20px_#c4d0e0] transition-all duration-300"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-ieee-blue neu-pill px-3 py-1">
                      {paper.year}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 neu-pill px-3 py-1">
                      {paper.venue}
                    </span>
                  </div>

                  {paper.doi && (
                    <span className="font-mono text-[11px] text-slate-500 font-medium">DOI: {paper.doi}</span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 leading-snug">
                  {paper.title}
                </h3>

                <p className="text-xs text-slate-600 font-medium">
                  <span className="font-bold text-slate-800">Authors: </span>
                  {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                </p>

                {paper.abstract && (
                  <div className="text-xs text-slate-600 font-medium leading-relaxed neu-inset p-4 sm:p-5 rounded-2xl">
                    <span className="font-bold text-slate-800 block mb-1">Abstract:</span>
                    {paper.abstract}
                  </div>
                )}

                {paper.paperUrl && (
                  <div className="pt-2">
                    <a
                      href={paper.paperUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="neu-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-ieee-blue hover:text-ieee-dark transition"
                    >
                      <span>Read Publication on IEEE Xplore / Journal</span>
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
