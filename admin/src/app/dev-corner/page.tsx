'use client';

import React, { useEffect, useState } from 'react';
import {
  Code2,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Save,
  X,
  AlertCircle,
  Github,
  Linkedin,
  Globe,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { ImageUploadField } from '../../components/ImageUploadField';
import { EmptyState } from '../../components/EmptyState';

interface DevProfileItem {
  _id: string;
  name: string;
  role: string;
  photoUrl: string;
  story: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  orderIndex: number;
  isVisible: boolean;
}

export default function DevelopersCornerAdminPage() {
  const { isSuperAdmin, hasPermission } = useAuth();
  const [profiles, setProfiles] = useState<DevProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Full-Stack Developer');
  const [photoUrl, setPhotoUrl] = useState('');
  const [story, setStory] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dev-corner/admin');
      if (res.success && res.data) {
        setProfiles(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch developer profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setRole('Full-Stack Developer');
    setPhotoUrl('');
    setStory('');
    setGithubUrl('');
    setLinkedinUrl('');
    setPortfolioUrl('');
    setOrderIndex(profiles.length);
    setIsVisible(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: DevProfileItem) => {
    setEditingId(item._id);
    setName(item.name);
    setRole(item.role);
    setPhotoUrl(item.photoUrl);
    setStory(item.story);
    setGithubUrl(item.githubUrl || '');
    setLinkedinUrl(item.linkedinUrl || '');
    setPortfolioUrl(item.portfolioUrl || '');
    setOrderIndex(item.orderIndex);
    setIsVisible(item.isVisible);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Developer Name is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        role: role.trim(),
        photoUrl,
        story: story.trim(),
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        portfolioUrl: portfolioUrl.trim(),
        orderIndex: Number(orderIndex),
        isVisible,
      };

      if (editingId) {
        await api.put(`/dev-corner/${editingId}`, payload);
      } else {
        await api.post('/dev-corner', payload);
      }

      setIsModalOpen(false);
      await fetchProfiles();
    } catch (err: any) {
      alert(err.message || 'Failed to save profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, devName: string) => {
    if (!confirm(`Delete profile "${devName}"?`)) return;
    try {
      await api.delete(`/dev-corner/${id}`);
      await fetchProfiles();
    } catch (err: any) {
      alert(err.message || 'Failed to delete profile');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-6 h-6 text-ieee-blue" />
              Developers Corner Manager
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Editable from the Super Admin panel. Displayed as a dedicated section just above the footer,
              plus a small credit link in the footer bottom corner.
            </p>
          </div>

          {(isSuperAdmin || hasPermission('dev_corner', 'create')) && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Add Developer Profile
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Profiles Grid */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-ieee-blue animate-spin" />
          </div>
        ) : profiles.length === 0 ? (
          <EmptyState
            icon={Code2}
            title="No Developer Profiles Added"
            description="Add the developers who designed and engineered the platform with their story and social links."
            actionLabel="Add Developer Profile"
            onAction={openCreateModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {profiles.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center gap-4">
                    {p.photoUrl ? (
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center shrink-0 border border-slate-200">
                        {p.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                      <p className="text-xs font-semibold text-ieee-blue">{p.role}</p>
                    </div>
                  </div>

                  {p.story && (
                    <p className="mt-3 text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-lg leading-relaxed">
                      {p.story}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-slate-400">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noreferrer" className="hover:text-slate-800">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {p.linkedinUrl && (
                      <a href={p.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-blue-600">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {p.portfolioUrl && (
                      <a href={p.portfolioUrl} target="_blank" rel="noreferrer" className="hover:text-ieee-blue">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  {(isSuperAdmin || hasPermission('dev_corner', 'delete')) && (
                    <button
                      onClick={() => handleDelete(p._id, p.name)}
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

        {/* Modal: Create/Edit Developer Profile */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-ieee-blue" />
                  <h2 className="text-base font-bold text-slate-900">
                    {editingId ? 'Edit Developer Profile' : 'Add Developer Profile'}
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
                      Developer Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ankit Singh Tomar"
                      required
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Lead Architect & Full-Stack Developer"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Developer Portrait Photo"
                  value={photoUrl}
                  onChange={(url) => setPhotoUrl(url)}
                  folder="developers"
                  helperText="Upload developer headshot photo to Cloudinary."
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    How & Why the Site Was Built (Story)
                  </label>
                  <textarea
                    rows={3}
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="Built for IEEE Student Branch to empower non-developer leads with complete dynamic control..."
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
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
                    <span>Save Profile</span>
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

