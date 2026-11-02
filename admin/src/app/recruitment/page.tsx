'use client';

import React, { useEffect, useState } from 'react';
import {
  UserPlus,
  Power,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  Eye,
  X,
  Save,
  Check,
  Ban,
  FileText,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { EmptyState } from '../../components/EmptyState';

interface MembershipDriveData {
  _id: string;
  title: string;
  description: string;
  isOpen: boolean;
  academicYear: string;
  guidelines?: string;
  departmentsAllowed: string[];
}

interface ApplicationItem {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  collegeId: string;
  department: string;
  yearOfStudy: string;
  domainInterests: string[];
  statementOfPurpose?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewRemarks?: string;
  createdAt: string;
}

export default function MembershipLeadPage() {
  const { isSuperAdmin, hasPermission } = useAuth();

  const [drive, setDrive] = useState<MembershipDriveData | null>(null);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [togglingDrive, setTogglingDrive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Review Modal
  const [reviewingApp, setReviewingApp] = useState<ApplicationItem | null>(null);
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'rejected'>('approved');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [designation, setDesignation] = useState('Active Member');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Drive Settings Modal
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [driveTitle, setDriveTitle] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [guidelines, setGuidelines] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [driveRes, appsRes] = await Promise.all([
        api.get('/recruitment/drive'),
        api.get('/recruitment/applications'),
      ]);

      if (driveRes.success && driveRes.data) {
        setDrive(driveRes.data);
        setDriveTitle(driveRes.data.title || '');
        setAcademicYear(driveRes.data.academicYear || '2026-2027');
        setGuidelines(driveRes.data.guidelines || '');
      }
      if (appsRes.success && appsRes.data) {
        setApplications(appsRes.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recruitment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleDrive = async () => {
    setTogglingDrive(true);
    try {
      const newStatus = !drive?.isOpen;
      const res = await api.put('/recruitment/drive', {
        isOpen: newStatus,
        title: driveTitle || 'Annual IEEE Student Branch Recruitment Drive',
        academicYear,
        guidelines,
      });

      if (res.success && res.data) {
        setDrive(res.data);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle recruitment drive');
    } finally {
      setTogglingDrive(false);
    }
  };

  const handleSaveDriveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put('/recruitment/drive', {
        title: driveTitle,
        academicYear,
        guidelines,
      });
      if (res.success && res.data) {
        setDrive(res.data);
      }
      setIsDriveModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    }
  };

  const openReviewModal = (app: ApplicationItem) => {
    setReviewingApp(app);
    setReviewStatus(app.status === 'rejected' ? 'rejected' : 'approved');
    setReviewRemarks(app.reviewRemarks || '');
    setDesignation('Active Member');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingApp) return;

    setSubmittingReview(true);
    try {
      await api.put(`/recruitment/applications/${reviewingApp._id}/review`, {
        status: reviewStatus,
        reviewRemarks,
        designation: reviewStatus === 'approved' ? designation : undefined,
      });

      setReviewingApp(null);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredApps =
    activeTab === 'all' ? applications : applications.filter((a) => a.status === activeTab);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-ieee-blue" />
              Membership Lead Workspace — Recruitment Drive
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Start or stop recruitment drives, review student submissions, and approve new IEEE members.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDriveModalOpen(true)}
              className="px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Drive Settings
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Drive Controller Banner */}
        <div
          className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition ${
            drive?.isOpen
              ? 'bg-emerald-50/60 border-emerald-200'
              : 'bg-slate-100 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                drive?.isOpen ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-300 text-slate-600'
              }`}
            >
              <Power className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {drive?.title || 'Annual Recruitment Drive'}
                </h3>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    drive?.isOpen
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {drive?.isOpen ? 'DRIVE IS OPEN' : 'DRIVE STOPPED'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {drive?.isOpen
                  ? 'Public website form is currently active and accepting student applications.'
                  : 'Recruitment is paused. The public application form shows a closed message.'}
              </p>
            </div>
          </div>

          {(isSuperAdmin || hasPermission('recruitment', 'edit')) && (
            <button
              onClick={handleToggleDrive}
              disabled={togglingDrive}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-2 shrink-0 ${
                drive?.isOpen
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {togglingDrive ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Power className="w-4 h-4" />
              )}
              <span>{drive?.isOpen ? 'Stop Recruitment Drive' : 'Start Recruitment Drive'}</span>
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          {[
            { key: 'all', label: `All Applications (${applications.length})` },
            {
              key: 'pending',
              label: `Pending Review (${applications.filter((a) => a.status === 'pending').length})`,
            },
            {
              key: 'approved',
              label: `Approved (${applications.filter((a) => a.status === 'approved').length})`,
            },
            {
              key: 'rejected',
              label: `Rejected (${applications.filter((a) => a.status === 'rejected').length})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === tab.key
                  ? 'bg-ieee-blue text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Applications Table */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-ieee-blue animate-spin" />
          </div>
        ) : filteredApps.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="No Applications in this Category"
            description="When students register and submit their details via the public recruitment page, applications appear here for review."
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 font-semibold text-slate-600">
                <tr>
                  <th className="py-3.5 px-6">Applicant</th>
                  <th className="py-3.5 px-6">College Roll No & Dept</th>
                  <th className="py-3.5 px-6">Year & Domains</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Submitted Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredApps.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900">{app.fullName}</p>
                      <p className="text-[11px] text-slate-500">{app.email}</p>
                      <p className="text-[11px] text-slate-400">{app.phone}</p>
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      <p className="font-medium">{app.collegeId}</p>
                      <p className="text-[11px] text-slate-500">{app.department}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-slate-800">{app.yearOfStudy}</p>
                      {app.domainInterests && app.domainInterests.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {app.domainInterests.map((d, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {app.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                        </span>
                      ) : app.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                          <XCircle className="w-3 h-3 text-red-600" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending Review
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openReviewModal(app)}
                        className="px-3 py-1.5 text-xs font-semibold text-ieee-blue bg-blue-50 hover:bg-blue-100 rounded-md transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: Review Application */}
        {reviewingApp && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Review Application</h2>
                  <p className="text-xs text-slate-500">{reviewingApp.fullName} ({reviewingApp.collegeId})</p>
                </div>
                <button
                  onClick={() => setReviewingApp(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 text-slate-700">
                  <p><span className="font-bold text-slate-900">Email:</span> {reviewingApp.email}</p>
                  <p><span className="font-bold text-slate-900">Phone:</span> {reviewingApp.phone}</p>
                  <p><span className="font-bold text-slate-900">Department:</span> {reviewingApp.department} ({reviewingApp.yearOfStudy})</p>
                  {reviewingApp.statementOfPurpose && (
                    <div className="pt-2 border-t border-slate-200">
                      <p className="font-bold text-slate-900 mb-1">Statement of Purpose / Why join IEEE:</p>
                      <p className="text-slate-600 italic bg-white p-2 rounded border border-slate-200">
                        &quot;{reviewingApp.statementOfPurpose}&quot;
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Decision *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setReviewStatus('approved')}
                      className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        reviewStatus === 'approved'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Approve Member</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewStatus('rejected')}
                      className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        reviewStatus === 'rejected'
                          ? 'bg-red-50 border-red-500 text-red-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Ban className="w-4 h-4 text-red-600" />
                      <span>Reject Application</span>
                    </button>
                  </div>
                </div>

                {reviewStatus === 'approved' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Initial Designation
                    </label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Approving automatically creates an official Membership Record with a unique Membership ID.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Review Remarks / Feedback
                  </label>
                  <input
                    type="text"
                    value={reviewRemarks}
                    onChange={(e) => setReviewRemarks(e.target.value)}
                    placeholder="Optional notes or interview feedback..."
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewingApp(null)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {submittingReview ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Submit Decision</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Drive Settings */}
        {isDriveModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h2 className="text-base font-bold text-slate-900">Recruitment Drive Settings</h2>
                <button
                  onClick={() => setIsDriveModalOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDriveSettings} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Drive Title
                  </label>
                  <input
                    type="text"
                    value={driveTitle}
                    onChange={(e) => setDriveTitle(e.target.value)}
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Applicant Guidelines
                  </label>
                  <textarea
                    rows={3}
                    value={guidelines}
                    onChange={(e) => setGuidelines(e.target.value)}
                    placeholder="Instructions shown to candidates before applying..."
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDriveModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow transition"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

