'use client';

import React, { useEffect, useState } from 'react';
import {
  Activity as ActivityIcon,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Save,
  X,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { ImageUploadField } from '../../components/ImageUploadField';
import { EmptyState } from '../../components/EmptyState';

interface ActivityItem {
  _id: string;
  title: string;
  description: string;
  images: string[];
  date: string;
  tags: string[];
  isPublished: boolean;
}

export default function ActivitiesPage() {
  const { isSuperAdmin, hasPermission } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await api.get('/activities/admin/all');
      if (res.success && res.data) {
        setActivities(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setImages([]);
    setDate(new Date().toISOString().substring(0, 10));
    setTags([]);
    setTagInput('');
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ActivityItem) => {
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setImages(item.images || []);
    setDate(item.date ? new Date(item.date).toISOString().substring(0, 10) : '');
    setTags(item.tags || []);
    setTagInput('');
    setIsPublished(item.isPublished);
    setIsModalOpen(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Title and Description are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        images,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        tags,
        isPublished,
      };

      if (editingId) {
        await api.put(`/activities/${editingId}`, payload);
      } else {
        await api.post('/activities', payload);
      }

      setIsModalOpen(false);
      await fetchActivities();
    } catch (err: any) {
      alert(err.message || 'Failed to save activity');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, activityTitle: string) => {
    if (!confirm(`Delete activity "${activityTitle}"?`)) return;
    try {
      await api.delete(`/activities/${id}`);
      await fetchActivities();
    } catch (err: any) {
      alert(err.message || 'Failed to delete activity');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ActivityIcon className="w-6 h-6 text-ieee-blue" />
              Branch Activities Manager
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Document club initiatives, industrial visits, robotics workshops, and outreach programs.
            </p>
          </div>

          {(isSuperAdmin || hasPermission('activities', 'create')) && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Record Activity
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Activities List */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-ieee-blue animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <EmptyState
            icon={ActivityIcon}
            title="No Activities Documented"
            description="Record branch visits, project builds, and technical community activities."
            actionLabel="Record Activity"
            onAction={openCreateModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activities.map((act) => (
              <div
                key={act._id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  {act.images && act.images.length > 0 ? (
                    <div className="h-44 w-full bg-slate-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={act.images[0]} alt={act.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-28 w-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <ActivityIcon className="w-8 h-8" />
                    </div>
                  )}

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{act.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-3">{act.description}</p>

                    {act.tags && act.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {act.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {new Date(act.date).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(act)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    {(isSuperAdmin || hasPermission('activities', 'delete')) && (
                      <button
                        onClick={() => handleDelete(act._id, act.title)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Record/Edit Activity */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <ActivityIcon className="w-5 h-5 text-ieee-blue" />
                  <h2 className="text-base font-bold text-slate-900">
                    {editingId ? 'Edit Activity Record' : 'Record Activity'}
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
                    Activity Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Industrial Visit to Semiconductor Fabrication Plant"
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Details about outcomes, attendee engagement, and activities conducted..."
                    required
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <ImageUploadField
                  label="Primary Activity Photo"
                  value={images[0] || ''}
                  onChange={(url) => setImages(url ? [url] : [])}
                  folder="activities"
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Date of Activity
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag and press Add"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      Add
                    </button>
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 bg-blue-50 text-ieee-blue px-2 py-0.5 rounded text-xs"
                        >
                          #{t}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
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
                    <span>Save Record</span>
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

