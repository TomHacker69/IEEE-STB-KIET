'use client';

import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Save,
  X,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { ImageUploadField } from '../../components/ImageUploadField';
import { EmptyState } from '../../components/EmptyState';

interface SponsorItem {
  _id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  tier: 'title' | 'platinum' | 'gold' | 'silver' | 'partner';
  orderIndex: number;
  isActive: boolean;
}

export default function SponsorsPage() {
  const { isSuperAdmin, hasPermission } = useAuth();
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [tier, setTier] = useState<'title' | 'platinum' | 'gold' | 'silver' | 'partner'>('partner');
  const [orderIndex, setOrderIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sponsors/admin/all');
      if (res.success && res.data) {
        setSponsors(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sponsors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setLogoUrl('');
    setWebsiteUrl('');
    setTier('partner');
    setOrderIndex(sponsors.length);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: SponsorItem) => {
    setEditingId(item._id);
    setName(item.name);
    setLogoUrl(item.logoUrl);
    setWebsiteUrl(item.websiteUrl || '');
    setTier(item.tier);
    setOrderIndex(item.orderIndex);
    setIsActive(item.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !logoUrl) {
      alert('Sponsor Name and Logo are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        logoUrl,
        websiteUrl: websiteUrl.trim(),
        tier,
        orderIndex: Number(orderIndex),
        isActive,
      };

      if (editingId) {
        await api.put(`/sponsors/${editingId}`, payload);
      } else {
        await api.post('/sponsors', payload);
      }

      setIsModalOpen(false);
      await fetchSponsors();
    } catch (err: any) {
      alert(err.message || 'Failed to save sponsor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, sponsorName: string) => {
    if (!confirm(`Delete sponsor "${sponsorName}"?`)) return;
    try {
      await api.delete(`/sponsors/${id}`);
      await fetchSponsors();
    } catch (err: any) {
      alert(err.message || 'Failed to delete sponsor');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-ieee-blue" />
              Sponsors & Partners Manager
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add corporate sponsors, platform partners, and hackathon patron logos with website links.
            </p>
          </div>

          {(isSuperAdmin || hasPermission('sponsors', 'create')) && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Add Sponsor
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Sponsors Grid */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-ieee-blue animate-spin" />
          </div>
        ) : sponsors.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="No Sponsors Added"
            description="Add corporate logos and links to showcase on the public website."
            actionLabel="Add Sponsor"
            onAction={openCreateModal}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {sponsors.map((sp) => (
              <div
                key={sp._id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-16 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center p-2 mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sp.logoUrl} alt={sp.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{sp.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ieee-blue bg-blue-50 px-2 py-0.5 rounded mt-1">
                    {sp.tier} Tier
                  </span>
                  {sp.websiteUrl && (
                    <a
                      href={sp.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-slate-500 hover:text-ieee-blue flex items-center gap-1 mt-2"
                    >
                      <span>Visit Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(sp)}
                    className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  {(isSuperAdmin || hasPermission('sponsors', 'delete')) && (
                    <button
                      onClick={() => handleDelete(sp._id, sp.name)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
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

        {/* Modal: Create/Edit Sponsor */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-ieee-blue" />
                  <h2 className="text-base font-bold text-slate-900">
                    {editingId ? 'Edit Sponsor' : 'Add New Sponsor'}
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
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Sponsor Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Google Cloud, Intel, Texas Instruments"
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <ImageUploadField
                  label="Sponsor Logo *"
                  value={logoUrl}
                  onChange={(url) => setLogoUrl(url)}
                  folder="sponsors"
                  helperText="Upload transparent PNG or SVG logo to Cloudinary."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Partnership Tier
                    </label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    >
                      <option value="title">Title Sponsor</option>
                      <option value="platinum">Platinum Partner</option>
                      <option value="gold">Gold Partner</option>
                      <option value="silver">Silver Sponsor</option>
                      <option value="partner">Community Partner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://company.com"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
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
                    <span>Save Sponsor</span>
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

