'use client';

import React from 'react';
import useSWR from 'swr';
import { Share2, ExternalLink, Instagram, Linkedin, Sparkles } from 'lucide-react';
import { fetcher } from '../../lib/api';
import { SectionHeader } from '../../components/SectionHeader';
import { EmptyState } from '../../components/EmptyState';

export default function SocialPage() {
  const { data: socialRes, isLoading } = useSWR('/social', fetcher);
  const posts = socialRes?.data || [];

  return (
    <div className="py-16 bg-[#e8edf5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Social Media Hub"
          title="What's Happening at IEEE"
          subtitle="Real-time highlights curated directly by the Social Media Head from our Instagram, LinkedIn, and community posts."
        />

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-ieee-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon={Share2}
            title="No Social Highlights Posted Yet"
            description="Our Social Media team will post live event highlights and student achievements soon."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {posts.map((post: any) => (
              <div
                key={post._id}
                className="neu-card rounded-3xl overflow-hidden border border-white/60 flex flex-col justify-between hover:shadow-[-10px_-10px_20px_#ffffff,10px_10px_20px_#c4d0e0] transition-all duration-300 group"
              >
                <div>
                  <div className="h-64 w-full bg-[#e8edf5] overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 right-3 neu-card-sm bg-[#e8edf5]/90 backdrop-blur-sm border border-white/80 text-slate-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow flex items-center gap-1.5">
                      {post.platform === 'instagram' ? (
                        <Instagram className="w-3 h-3 text-pink-600" />
                      ) : (
                        <Linkedin className="w-3 h-3 text-blue-600" />
                      )}
                      <span>{post.platform}</span>
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-4">
                      {post.caption}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <a
                    href={post.postUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="neu-btn w-full py-2.5 rounded-xl text-xs font-bold text-ieee-blue hover:text-ieee-dark text-center block transition flex items-center justify-center gap-1.5"
                  >
                    <span>View Original Post</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
