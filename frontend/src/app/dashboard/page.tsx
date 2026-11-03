'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Shield,
  Loader2,
  FileText,
  Clock,
  BadgeCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { EmptyState } from '../../components/EmptyState';

export default function MemberDashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [data, setData] = useState<{
    certificates: any[];
    participations: any[];
    membershipRecord: any;
  }>({
    certificates: [],
    participations: [],
    membershipRecord: null,
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user) return;
      setLoadingData(true);
      try {
        const res = await api.get('/certificates/my');
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load member records:', err);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchMemberData();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-ieee-blue animate-spin" />
      </div>
    );
  }

  const { certificates, participations, membershipRecord } = data;

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ieee-blue to-ieee-dark text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
                <span className="bg-blue-50 text-ieee-blue border border-blue-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Member Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => logout()}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Core Member Executive Switcher */}
        {user.isCoreMember && (
          <div className="bg-gradient-to-r from-amber-500/15 via-blue-500/10 to-indigo-500/15 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-7 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow shrink-0">
                ★
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                    Executive Core Team
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {user.designation || 'Lead Coordinator'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  You have administrative privileges for the IEEE Student Branch.
                </h3>
                <p className="text-xs text-slate-600">
                  Manage your branch domain, review submissions, and publish records from the dedicated admin dashboard.
                </p>
              </div>
            </div>

            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow shrink-0"
            >
              Open Lead Admin Panel <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* 1. MEMBERSHIP DETAILS (Intentionally Minimal) */}
        <div className="bg-gradient-to-br from-slate-900 to-ieee-dark rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-ieee-cyan bg-white/10 px-3 py-1 rounded-full">
                Branch Membership Record
              </span>
              <h2 className="text-2xl font-extrabold">
                {membershipRecord?.designation || 'IEEE Student Member'}
              </h2>
              <p className="text-xs text-slate-300">
                Department: {user.department || 'Electronics and Communication Engineering (ECE)'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Membership ID
                </p>
                <p className="text-sm font-mono font-bold text-ieee-cyan mt-1">
                  {membershipRecord?.membershipId || user.membershipId || 'IEEE-STB-ACTIVE'}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </p>
                <div className="mt-1">
                  {membershipRecord?.status === 'active' || !membershipRecord ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active Member
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-400">
                      {membershipRecord.status}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Validity Period
                </p>
                <p className="text-xs font-medium text-slate-300 mt-1">
                  {membershipRecord?.startDate
                    ? `${new Date(membershipRecord.startDate).toLocaleDateString()} — ${new Date(
                        membershipRecord.endDate
                      ).toLocaleDateString()}`
                    : 'Current Academic Term'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CERTIFICATES ISSUED (View / Download) */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your Issued Certificates</h3>
                <p className="text-xs text-slate-500">
                  Official verifiable digital credentials issued for workshops, hackathons, and leadership
                </p>
              </div>
            </div>
          </div>

          {loadingData ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 text-ieee-blue animate-spin" />
            </div>
          ) : certificates.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No Certificates Issued Yet"
              description="Certificates from attended events, competitive hackathons, or project cohorts will be uploaded here by event coordinators."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {certificates.map((cert: any) => (
                <div
                  key={cert._id}
                  className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/90 hover:border-ieee-blue/60 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                      ID: {cert.credentialId}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{cert.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      Issued On: {new Date(cert.issueDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="pt-2">
                    <a
                      href={cert.certificateFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-4 rounded-xl text-xs font-bold bg-white text-ieee-blue hover:bg-ieee-blue hover:text-white border border-blue-200 text-center block transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>Download / View Certificate Document</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. PARTICIPATIONS & ENGAGEMENTS */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-ieee-blue flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Events & Activities Participated</h3>
              <p className="text-xs text-slate-500">
                Record of technical workshops, seminars, and sessions you registered for
              </p>
            </div>
          </div>

          {loadingData ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 text-ieee-blue animate-spin" />
            </div>
          ) : participations.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No Participations Recorded"
              description="Register and participate in upcoming IEEE events to build your verified co-curricular record."
              actionHref="/events"
              actionLabel="Explore Upcoming Events"
            />
          ) : (
            <div className="space-y-3">
              {participations.map((part: any) => (
                <div
                  key={part._id}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{part.eventId?.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      Venue: {part.eventId?.venue} • {new Date(part.eventId?.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold capitalize bg-blue-50 text-ieee-blue px-2.5 py-1 rounded-md">
                    Role: {part.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
