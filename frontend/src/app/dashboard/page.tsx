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
      <div className="flex h-[70vh] items-center justify-center bg-[#e8edf5]">
        <div className="p-6 rounded-2xl neu-card flex items-center gap-3">
          <Loader2 className="w-6 h-6 text-ieee-blue animate-spin" />
          <span className="text-sm font-semibold text-slate-700">Loading Member Profile...</span>
        </div>
      </div>
    );
  }

  const { certificates, participations, membershipRecord } = data;

  return (
    <div className="py-12 bg-[#e8edf5] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="neu-card rounded-3xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-white/60">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#e8edf5] shadow-[inset_3px_3px_6px_#c4d0e0,inset_-3px_-3px_6px_#ffffff] text-ieee-blue font-extrabold text-2xl flex items-center justify-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-slate-800">{user.name}</h1>
                <span className="neu-pill-active text-ieee-blue text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                  Member Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => logout()}
              className="neu-btn px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-red-600 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Core Member Executive Switcher */}
        {user.isCoreMember && (
          <div className="neu-card rounded-3xl p-6 sm:p-7 border border-amber-300/40 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-gradient-to-r from-amber-500/10 via-[#e8edf5] to-blue-500/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-[-3px_-3px_6px_#ffffff,3px_3px_6px_#c4d0e0] shrink-0">
                ★
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 neu-pill px-3 py-1">
                    Executive Core Team
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {user.designation || 'Lead Coordinator'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-1">
                  You have administrative privileges for the IEEE Student Branch.
                </h3>
                <p className="text-xs text-slate-500">
                  Manage your branch domain, review submissions, and publish records from the dedicated admin dashboard.
                </p>
              </div>
            </div>

            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="neu-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white shrink-0"
            >
              Open Lead Admin Panel <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* 1. MEMBERSHIP DETAILS */}
        <div className="neu-card-lg rounded-3xl p-8 bg-[#e8edf5] border border-white/80 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="neu-pill-active text-ieee-blue text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                Branch Membership Record
              </span>
              <h2 className="text-2xl font-extrabold text-slate-800">
                {membershipRecord?.designation || 'IEEE Student Member'}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Department: {user.department || 'Electronics and Communication Engineering (ECE)'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-300/60">
              <div className="neu-inset rounded-2xl p-4">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Membership ID
                </p>
                <p className="text-sm font-mono font-bold text-ieee-blue mt-1">
                  {membershipRecord?.membershipId || user.membershipId || 'IEEE-STB-ACTIVE'}
                </p>
              </div>

              <div className="neu-inset rounded-2xl p-4">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </p>
                <div className="mt-1">
                  {membershipRecord?.status === 'active' || !membershipRecord ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active Member
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-600">
                      {membershipRecord.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="neu-inset rounded-2xl p-4 col-span-2 sm:col-span-1">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Validity Period
                </p>
                <p className="text-xs font-bold text-slate-700 mt-1">
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

        {/* 2. CERTIFICATES ISSUED */}
        <div className="neu-card rounded-3xl p-8 border border-white/60 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-300/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl neu-card-sm flex items-center justify-center text-purple-600">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Your Issued Certificates</h3>
                <p className="text-xs text-slate-500 font-medium">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert: any) => (
                <div
                  key={cert._id}
                  className="neu-card-sm rounded-2xl p-6 border border-white/60 flex flex-col justify-between space-y-4 hover:shadow-[-8px_-8px_16px_#ffffff,8px_8px_16px_#c4d0e0] transition"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-slate-600 neu-pill px-2.5 py-1 inline-block">
                      ID: {cert.credentialId}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 leading-snug">{cert.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Issued On: {new Date(cert.issueDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="pt-2">
                    <a
                      href={cert.certificateFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold neu-btn text-ieee-blue text-center block transition flex items-center justify-center gap-1.5"
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
        <div className="neu-card rounded-3xl p-8 border border-white/60 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-300/40">
            <div className="w-10 h-10 rounded-xl neu-card-sm flex items-center justify-center text-ieee-blue">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Events & Activities Participated</h3>
              <p className="text-xs text-slate-500 font-medium">
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
                  className="neu-inset rounded-2xl p-4 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{part.eventId?.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Venue: {part.eventId?.venue} • {new Date(part.eventId?.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold capitalize neu-pill text-ieee-blue px-3 py-1">
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
