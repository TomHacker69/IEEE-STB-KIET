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
  const [department, setDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
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
    <div className="py-16 bg-slate-50 min-h-screen">
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
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200 text-center shadow-lg max-w-xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 text-ieee-blue flex items-center justify-center mx-auto shadow-sm">
              <Bell className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full inline-block mb-3 border border-amber-200">
                Membership Drive Closed
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Recruitment Drive Currently Closed
              </h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              You will be notified when the membership opportunity will be open for you all guys, till
              then keep an eye on your inbox.
            </p>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/events"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                <Calendar className="w-4 h-4" />
                Explore Upcoming Events
              </a>
              <a
                href="/social"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-ieee-blue hover:bg-ieee-dark transition shadow-sm"
              >
                <Instagram className="w-4 h-4" />
                Stay Updated on Social
              </a>
            </div>
          </div>
        ) : submitted ? (
          <div className="bg-white rounded-3xl p-12 border border-emerald-200 text-center shadow-md max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Application Submitted Successfully!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Thank you for applying to the IEEE Student Branch. Your application has been sent directly to
              the Membership Lead. Approved candidates will receive their official membership record and
              induction schedule via email.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
            {/* Drive Details Header */}
            <div className="mb-8 pb-6 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block mb-2">
                Active Induction Cycle {drive?.academicYear ? `(${drive.academicYear})` : ''}
              </span>
              <h3 className="text-xl font-bold text-slate-900">{drive?.title}</h3>
              {drive?.guidelines && (
                <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-blue-50/60 p-4 rounded-xl border border-blue-100 text-slate-700">
                  <span className="font-bold text-ieee-blue block mb-1">Guidelines for Applicants:</span>
                  {drive.guidelines}
                </p>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    College Roll No / Student ID *
                  </label>
                  <input
                    type="text"
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    placeholder="e.g. 2100290130001"
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Year of Study *
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Areas of Interest / Desired Domains
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DOMAINS.map((dom) => (
                    <label
                      key={dom}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition ${
                        selectedDomains.includes(dom)
                          ? 'bg-blue-50/80 border-ieee-blue text-ieee-blue font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDomains.includes(dom)}
                        onChange={() => toggleDomain(dom)}
                        className="w-4 h-4 text-ieee-blue rounded border-slate-300 focus:ring-ieee-blue"
                      />
                      <span>{dom}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Statement of Purpose */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Statement of Purpose / Why do you want to join IEEE?
                </label>
                <textarea
                  rows={4}
                  value={statementOfPurpose}
                  onChange={(e) => setStatementOfPurpose(e.target.value)}
                  placeholder="Tell us about your passions, past projects, what you hope to learn or contribute..."
                  className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                />
              </div>

              {/* Resume / Portfolio Link */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Resume or Portfolio Link (Google Drive / GitHub / LinkedIn)
                </label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or https://github.com/..."
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-ieee-blue hover:bg-ieee-dark text-white rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
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

