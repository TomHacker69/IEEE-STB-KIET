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
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Scholarly Publications"
          title="Research Papers & Academic Literature"
          subtitle="Peer-reviewed publications, IEEE conference proceedings, and journal papers authored by members and faculty advisors."
        />

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by paper title, author, or venue..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-ieee-blue"
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
          <div className="space-y-6">
            {filtered.map((paper: any) => (
              <div
                key={paper._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ieee-blue bg-blue-50 px-2.5 py-1 rounded-md">
                      {paper.year}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      {paper.venue}
                    </span>
                  </div>

                  {paper.doi && (
                    <span className="font-mono text-[11px] text-slate-400">DOI: {paper.doi}</span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {paper.title}
                </h3>

                <p className="text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Authors: </span>
                  {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                </p>

                {paper.abstract && (
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">Abstract:</span>
                    {paper.abstract}
                  </p>
                )}

                {paper.paperUrl && (
                  <div className="pt-2">
                    <a
                      href={paper.paperUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-ieee-blue hover:text-ieee-dark"
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

