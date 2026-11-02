'use client';

import React, { useEffect, useState } from 'react';
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Quote,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { ImageUploadField } from '../../components/ImageUploadField';
import { EmptyState } from '../../components/EmptyState';

interface DignitaryItem {
  _id: string;
  name: string;
  designation: string;
  institution?: string;
  photoUrl: string;
  quote: string;
  orderIndex: number;
  isVisible: boolean;
}

export default function DignitariesPage() {
  const { isSuperAdmin, hasPermission } = useAuth();
  const [dignitaries, setDignitaries] = useState<DignitaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [institution, setInstitution] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [quote, setQuote] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchDignitaries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dignitaries/admin');
      if (res.success && res.data) {
        setDignitaries(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dignitaries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDignitaries();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setDesignation('');
    setInstitution('');
    setPhotoUrl('');
    setQuote('');
    setOrderIndex(dignitaries.length);
    setIsVisible(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: DignitaryItem) => {
    setEditingId(item._id);
    setName(item.name);
    setDesignation(item.designation);
    setInstitution(item.institution || '');
    setPhotoUrl(item.photoUrl);
    setQuote(item.quote);
    setOrderIndex(item.orderIndex);
    setIsVisible(item.isVisible);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !designation.trim()) {
      alert('Name and Designation are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        designation: designation.trim(),
        institution: institution.trim(),
        photoUrl,
        quote: quote.trim(),
        orderIndex: Number(orderIndex),
        isVisible,
      };

      if (editingId) {
        await api.put(`/dignitaries/${editingId}`, payload);
      } else {
        await api.post('/dignitaries', payload);
      }

      setIsModalOpen(false);
      await fetchDignitaries();
    } catch (err: any) {
      alert(err.message || 'Failed to save dignitary');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, dignitaryName: string) => {
    if (!confirm(`Delete dignitary "${dignitaryName}"?`)) return;
    try {
      await api.delete(`/dignitaries/${id}`);
      await fetchDignitaries();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-ieee-blue" />
              Honorable Dignitaries (Home Page Honor Section)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Presented respectfully on the Home page only. Ordered by hierarchy: Director Academics →
              Dean Academics → Pro VC → VC → Branch Counselor.
            </p>
          </div>

          {(isSuperAdmin || hasPermission('dignitaries', 'create')) && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Add Dignitary
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dignitaries List */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-ieee-blue animate-spin" />
          </div>
        ) : dignitaries.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No Dignitaries Added Yet"
            description="Add your first dignitary (e.g., Director Academics, Dean, Branch Counselor) with their photo and IEEE quote."
            actionLabel="Add Dignitary"
            onAction={openCreateModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {dignitaries.map((dig) => (
              <div
                key={dig._id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center gap-4">
                    {dig.photoUrl ? (
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shrink-0 border-2 border-ieee-blue/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={dig.photoUrl} alt={dig.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center shrink-0 border-2 border-slate-200">
                        {dig.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{dig.name}</h3>
                      <p className="text-xs font-semibold text-ieee-blue">{dig.designation}</p>
                      {dig.institution && (
                        <p className="text-[11px] text-slate-400">{dig.institution}</p>
                      )}
                    </div>
                  </div>

                  {dig.quote && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs italic text-slate-600 flex items-start gap-2">
                      <Quote className="w-3.5 h-3.5 text-ieee-cyan shrink-0 mt-0.5" />
                      <span>&quot;{dig.quote}&quot;</span>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Hierarchy Rank: #{dig.orderIndex}</span>
                    <span className={dig.isVisible ? 'text-emerald-600 font-medium' : 'text-slate-400'}>
                      {dig.isVisible ? 'Visible on Home' : 'Hidden'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(dig)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  {(isSuperAdmin || hasPermission('dignitaries', 'delete')) && (
                    <button
                      onClick={() => handleDelete(dig._id, dig.name)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Create/Edit Dignitary */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-ieee-blue" />
                  <h2 className="text-base font-bold text-slate-900">
                    {editingId ? 'Edit Dignitary' : 'Add Dignitary'}
                  </h2>
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
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. A. K. Sharma"
                      required
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Designation *
                    </label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Director Academics"
                      required
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Institution / Department
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. KIET Group of Institutions"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <ImageUploadField
                  label="Dignitary Portrait Photo"
                  value={photoUrl}
                  onChange={(url) => setPhotoUrl(url)}
                  folder="dignitaries"
                  helperText="Upload a professional portrait photo to Cloudinary."
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Quote on IEEE (1-2 lines)
                  </label>
                  <textarea
                    rows={2}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="e.g. IEEE empowers student innovation and connects campus ideas to global frontiers."
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Display Priority / Order Index
                    </label>
                    <input
                      type="number"
                      value={orderIndex}
                      onChange={(e) => setOrderIndex(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="isVisibleCheck"
                      checked={isVisible}
                      onChange={(e) => setIsVisible(e.target.checked)}
                      className="w-4 h-4 text-ieee-blue rounded border-slate-300 focus:ring-ieee-blue"
                    />
                    <label htmlFor="isVisibleCheck" className="text-xs font-semibold text-slate-700">
                      Visible on Website
                    </label>
                  </div>
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
                    <span>Save Dignitary</span>
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

