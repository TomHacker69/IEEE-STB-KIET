'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import {
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Send,
  Clock,
  Bell,
  Linkedin,
  Instagram,
  Calendar,
} from 'lucide-react';
import { fetcher, api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { SectionHeader } from '../../components/SectionHeader';
import { EmptyState } from '../../components/EmptyState';

const DOMAINS = [
  'Technical & Web Development',
  'Robotics, IoT & Embedded Systems',
  'Signal Processing & VLSI',
  'Event Management & Operations',
  'Content Writing & Research',
  'Design, Media & PR',
];

export default function RecruitmentPage() {
  const { user } = useAuth();
  const { data: driveRes, isLoading } = useSWR('/recruitment/drive', fetcher);

  const drive = driveRes?.data;
  const isOpen = Boolean(driveRes?.isOpen);

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [department, setDepartment] = useState('Electronics and Communication Engineering (ECE)');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [statementOfPurpose, setStatementOfPurpose] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !collegeId.trim()) {
      setError('Please fill out all mandatory fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.post('/recruitment/apply', {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        collegeId: collegeId.trim(),
        department: department.trim(),
        yearOfStudy,
        domainInterests: selectedDomains,
        statementOfPurpose: statementOfPurpose.trim(),
        resumeUrl: resumeUrl.trim(),
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please check your information and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 bg-[#e8edf5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Join Our Community"
          title="IEEE Student Branch Recruitment"
          subtitle="Become part of the world's largest technical organization. Learn, lead, publish, and network."
        />

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-ieee-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !isOpen ? (
          <div className="neu-card rounded-3xl p-10 sm:p-14 border border-white/70 text-center max-w-xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-[#e8edf5] shadow-[inset_3px_3px_6px_#c4d0e0,inset_-3px_-3px_6px_#ffffff] text-ieee-blue flex items-center justify-center mx-auto">
              <Bell className="w-10 h-10 animate-bounce text-ieee-blue" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 neu-pill px-3 py-1 inline-block mb-3">
                Membership Drive Closed
              </span>
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                Recruitment Drive Currently Closed
              </h3>
            </div>

            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
              You will be notified when the membership opportunity will be open for you all guys, till
              then keep an eye on your inbox.
            </p>

            <div className="pt-6 border-t border-slate-300/40 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/events"
                className="w-full sm:w-auto neu-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-slate-700 hover:text-ieee-blue transition"
              >
                <Calendar className="w-4 h-4" />
                Explore Upcoming Events
              </a>
              <a
                href="/social"
                className="w-full sm:w-auto neu-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white transition"
              >
                <Instagram className="w-4 h-4" />
                Stay Updated on Social
              </a>
            </div>
          </div>
        ) : submitted ? (
          <div className="neu-card rounded-3xl p-12 border border-white/70 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#e8edf5] shadow-[inset_3px_3px_6px_#c4d0e0,inset_-3px_-3px_6px_#ffffff] text-emerald-600 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">
              Application Submitted Successfully!
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mb-6">
              Thank you for applying to the IEEE Student Branch. Your application has been sent directly to
              the Membership Lead. Approved candidates will receive their official membership record and
              induction schedule via email.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="neu-btn px-6 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-ieee-blue transition"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <div className="neu-card-lg rounded-3xl p-8 sm:p-12 border border-white/70">
            {/* Drive Details Header */}
            <div className="mb-8 pb-6 border-b border-slate-300/40">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 neu-pill px-3 py-1 inline-block mb-3">
                Active Induction Cycle {drive?.academicYear ? `(${drive.academicYear})` : ''}
              </span>
              <h3 className="text-xl font-extrabold text-slate-800">{drive?.title}</h3>
              {drive?.guidelines && (
                <div className="text-xs text-slate-600 font-medium mt-3 leading-relaxed neu-inset p-4 sm:p-5 rounded-2xl">
                  <span className="font-bold text-ieee-blue block mb-1">Guidelines for Applicants:</span>
                  {drive.guidelines}
                </div>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 neu-inset text-red-600 rounded-2xl text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="w-full neu-inset rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    required
                    className="w-full neu-inset rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full neu-inset rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    College Roll No / Student ID *
                  </label>
                  <input
                    type="text"
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    placeholder="e.g. 2100290130001"
                    required
                    className="w-full neu-inset rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full neu-inset rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none"
                  >
                    <option value="Electronics and Communication Engineering (ECE)">
                      Electronics and Communication Engineering (ECE)
                    </option>
                    <option value="Computer Science and Engineering (CSE)">
                      Computer Science and Engineering (CSE)
                    </option>
                    <option value="Information Technology (IT)">Information Technology (IT)</option>
                    <option value="Electrical and Electronics Engineering (EEE)">
                      Electrical and Electronics Engineering (EEE)
                    </option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Other Department">Other Department</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Year of Study *
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="w-full neu-inset rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none"
                  >
                    <option value="1st Year">1st Year (Fresher)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                  </select>
                </div>
              </div>

              {/* Domain Interests */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Areas of Interest / Desired Domains
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DOMAINS.map((dom) => {
                    const isSelected = selectedDomains.includes(dom);
                    return (
                      <label
                        key={dom}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'neu-inset text-ieee-blue font-bold shadow-[inset_3px_3px_6px_#c4d0e0,inset_-3px_-3px_6px_#ffffff]'
                            : 'neu-btn text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleDomain(dom)}
                          className="w-4 h-4 text-ieee-blue rounded border-slate-300 focus:ring-ieee-blue"
                        />
                        <span>{dom}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Statement of Purpose */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Statement of Purpose / Why do you want to join IEEE?
                </label>
                <textarea
                  rows={4}
                  value={statementOfPurpose}
                  onChange={(e) => setStatementOfPurpose(e.target.value)}
                  placeholder="Tell us about your passions, past projects, what you hope to learn or contribute..."
                  className="w-full neu-inset rounded-2xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Resume / Portfolio Link */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Resume or Portfolio Link (Google Drive / GitHub / LinkedIn)
                </label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or https://github.com/..."
                  className="w-full neu-inset rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="pt-6 border-t border-slate-300/40 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="neu-btn-primary w-full sm:w-auto px-9 py-3.5 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
