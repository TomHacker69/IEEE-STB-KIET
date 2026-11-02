'use client';

import React, { useEffect, useState } from 'react';
import {
  FileCheck2,
  Plus,
  Trash2,
  Loader2,
  Save,
  X,
  AlertCircle,
  ExternalLink,
  Award,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { ImageUploadField } from '../../components/ImageUploadField';
import { EmptyState } from '../../components/EmptyState';

interface CertificateItem {
  _id: string;
  userName: string;
  userEmail: string;
  title: string;
  certificateFileUrl: string;
  credentialId: string;
  issueDate: string;
  eventId?: {
    _id: string;
    title: string;
  };
}

interface EventOption {
  _id: string;
  title: string;
}

export default function CertificatesPage() {
  const { isSuperAdmin, hasPermission } = useAuth();
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [title, setTitle] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [certificateFileUrl, setCertificateFileUrl] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [certsRes, eventsRes] = await Promise.all([
        api.get('/certificates/admin'),
        api.get('/events'),
      ]);

      if (certsRes.success && certsRes.data) {
        setCertificates(certsRes.data);
      }
      if (eventsRes.success && eventsRes.data) {
        setEvents(eventsRes.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setUserName('');
    setUserEmail('');
    setTitle('');
    setSelectedEventId('');
    setCertificateFileUrl('');
    setCredentialId(
      `IEEE-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !title.trim() || !certificateFileUrl) {
      alert('Recipient Name, Email, Certificate Title, and Certificate File are required');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/certificates', {
        userName: userName.trim(),
        userEmail: userEmail.trim().toLowerCase(),
        title: title.trim(),
        eventId: selectedEventId || undefined,
        certificateFileUrl,
        credentialId: credentialId.trim(),
      });

      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to issue certificate');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, certTitle: string) => {
    if (!confirm(`Delete certificate "${certTitle}"?`)) return;
    try {
      await api.delete(`/certificates/${id}`);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete certificate');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-6 h-6 text-ieee-blue" />
              Member Certificates Manager
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Upload authenticated certificate PDFs or images to Cloudinary. Recipients can view and download
              them directly in their Member Dashboard.
            </p>
          </div>

          {(isSuperAdmin || hasPermission('certificates', 'create')) && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Upload & Issue Certificate
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Certificates Table */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-ieee-blue animate-spin" />
          </div>
        ) : certificates.length === 0 ? (
          <EmptyState
            icon={FileCheck2}
            title="No Certificates Issued Yet"
            description="Upload PDF or image certificates to issue credentials for workshop attendees and winners."
            actionLabel="Upload & Issue Certificate"
            onAction={openCreateModal}
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 font-semibold text-slate-600">
                <tr>
                  <th className="py-3.5 px-6">Recipient</th>
                  <th className="py-3.5 px-6">Certificate Title</th>
                  <th className="py-3.5 px-6">Event Association</th>
                  <th className="py-3.5 px-6">Credential ID</th>
                  <th className="py-3.5 px-6">File Document</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {certificates.map((cert) => (
                  <tr key={cert._id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900">{cert.userName}</p>
                      <p className="text-[11px] text-slate-500">{cert.userEmail}</p>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800">{cert.title}</td>
                    <td className="py-4 px-6 text-slate-600">
                      {cert.eventId ? (
                        <span className="bg-blue-50 text-ieee-blue px-2 py-0.5 rounded text-[11px] font-medium">
                          {cert.eventId.title}
                        </span>
                      ) : (
                        <span className="text-slate-400">General Credential</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-mono text-[11px] text-slate-500">
                      {cert.credentialId}
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={cert.certificateFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-ieee-blue hover:underline font-semibold"
                      >
                        <span>View / Download</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {(isSuperAdmin || hasPermission('certificates', 'delete')) && (
                        <button
                          onClick={() => handleDelete(cert._id, cert.title)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                          title="Delete Certificate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: Issue Certificate */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-ieee-blue" />
                  <h2 className="text-base font-bold text-slate-900">Upload & Issue Certificate</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      required
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Recipient Email *
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="priya@college.edu"
                      required
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Certificate Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Certificate of Merit — IEEE Web Dev Bootcamp"
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Associated Event (Optional)
                  </label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  >
                    <option value="">None / Standalone Achievement</option>
                    {events.map((evt) => (
                      <option key={evt._id} value={evt._id}>
                        {evt.title}
                      </option>
                    ))}
                  </select>
                </div>

                <ImageUploadField
                  label="Upload Certificate File (PDF or Image) *"
                  value={certificateFileUrl}
                  onChange={(url) => setCertificateFileUrl(url)}
                  folder="certificates"
                  accept="application/pdf,image/*"
                  helperText="Upload official PDF certificate or certificate image to Cloudinary."
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Verifiable Credential ID
                  </label>
                  <input
                    type="text"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Issue Certificate</span>
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

