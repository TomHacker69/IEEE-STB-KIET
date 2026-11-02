'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Save,
  X,
  AlertCircle,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { ImageUploadField } from '../../components/ImageUploadField';
import { EmptyState } from '../../components/EmptyState';

interface EventItem {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  eventDate: string;
  endDate?: string;
  venue: string;
  mode: 'online' | 'offline' | 'hybrid';
  registrationLink?: string;
  status: 'upcoming' | 'ongoing' | 'past';
  isPublished: boolean;
}

export default function EventsPage() {
  const { isSuperAdmin, hasPermission } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('Campus Auditorium');
  const [mode, setMode] = useState<'online' | 'offline' | 'hybrid'>('offline');
  const [registrationLink, setRegistrationLink] = useState('');
  const [status, setStatus] = useState<'upcoming' | 'ongoing' | 'past'>('upcoming');
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events/admin/all');
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCoverImage('');
    setEventDate(new Date().toISOString().substring(0, 16));
    setVenue('Campus Auditorium');
    setMode('offline');
    setRegistrationLink('');
    setStatus('upcoming');
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: EventItem) => {
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setCoverImage(item.coverImage);
    setEventDate(item.eventDate ? new Date(item.eventDate).toISOString().substring(0, 16) : '');
    setVenue(item.venue);
    setMode(item.mode);
    setRegistrationLink(item.registrationLink || '');
    setStatus(item.status);
    setIsPublished(item.isPublished);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !eventDate) {
      alert('Title, Description, and Event Date are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        coverImage,
        eventDate: new Date(eventDate).toISOString(),
        venue: venue.trim(),
        mode,
        registrationLink: registrationLink.trim(),
        status,
        isPublished,
      };

      if (editingId) {
        await api.put(`/events/${editingId}`, payload);
      } else {
        await api.post('/events', payload);
      }

      setIsModalOpen(false);
      await fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, eventTitle: string) => {
    if (!confirm(`Delete event "${eventTitle}"?`)) return;
    try {
      await api.delete(`/events/${id}`);
      await fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to delete event');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-ieee-blue" />
              Events Manager
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage upcoming hackathons, tech talks, workshops, and past event archives.
            </p>
          </div>

          {(isSuperAdmin || hasPermission('events', 'create')) && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-ieee-blue animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Events Found in Database"
            description="Create your first student branch workshop, seminar, or flagship hackathon."
            actionLabel="Create Event"
            onAction={openCreateModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((evt) => (
              <div
                key={evt._id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  {evt.coverImage ? (
                    <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={evt.coverImage}
                        alt={evt.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 right-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow bg-slate-900/80 text-white backdrop-blur-sm">
                        {evt.status}
                      </span>
                    </div>
                  ) : (
                    <div className="h-28 w-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Calendar className="w-8 h-8" />
                    </div>
                  )}

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{evt.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{evt.description}</p>

                    <div className="pt-2 flex flex-col gap-1 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-ieee-blue" />
                        <span>{new Date(evt.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.venue} ({evt.mode})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                  <span className={evt.isPublished ? 'text-[11px] text-emerald-600 font-semibold' : 'text-[11px] text-slate-400'}>
                    {evt.isPublished ? 'Published' : 'Draft'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(evt)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    {(isSuperAdmin || hasPermission('events', 'delete')) && (
                      <button
                        onClick={() => handleDelete(evt._id, evt.title)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                        title="Delete Event"
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

        {/* Modal: Create/Edit Event */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-ieee-blue" />
                  <h2 className="text-base font-bold text-slate-900">
                    {editingId ? 'Edit Event' : 'Create New Event'}
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
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. IEEE Hackathon 2026"
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed agenda, speaker information, prerequisites..."
                    required
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <ImageUploadField
                  label="Event Banner / Poster"
                  value={coverImage}
                  onChange={(url) => setCoverImage(url)}
                  folder="events"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Event Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Mode
                    </label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    >
                      <option value="offline">In-Person (Offline)</option>
                      <option value="online">Virtual (Online)</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Venue
                    </label>
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="e.g. Auditorium / Audi Hall"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Registration Link
                  </label>
                  <input
                    type="url"
                    value={registrationLink}
                    onChange={(e) => setRegistrationLink(e.target.value)}
                    placeholder="https://forms.gle/... or https://unstop.com/..."
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isPublishedCheck"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-ieee-blue rounded border-slate-300 focus:ring-ieee-blue"
                  />
                  <label htmlFor="isPublishedCheck" className="text-xs font-semibold text-slate-700">
                    Publish Event Immediately on Website
                  </label>
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
                    <span>Save Event</span>
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

