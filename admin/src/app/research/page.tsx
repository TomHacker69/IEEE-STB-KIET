'use client';

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
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
import { EmptyState } from '../../components/EmptyState';

interface ResearchPaperItem {
  _id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  abstract?: string;
  paperUrl?: string;
  doi?: string;
  isPublished: boolean;
}

export default function ResearchPapersPage() {
  const { isSuperAdmin, hasPermission } = useAuth();
  const [papers, setPapers] = useState<ResearchPaperItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [authorsStr, setAuthorsStr] = useState('');
  const [venue, setVenue] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [abstract, setAbstract] = useState('');
  const [paperUrl, setPaperUrl] = useState('');
  const [doi, setDoi] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/research/admin/all');
      if (res.success && res.data) {
        setPapers(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch research papers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setAuthorsStr('');
    setVenue('');
    setYear(new Date().getFullYear());
    setAbstract('');
    setPaperUrl('');
    setDoi('');
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ResearchPaperItem) => {
    setEditingId(item._id);
    setTitle(item.title);
    setAuthorsStr(item.authors.join(', '));
    setVenue(item.venue);
    setYear(item.year);
    setAbstract(item.abstract || '');
    setPaperUrl(item.paperUrl || '');
    setDoi(item.doi || '');
    setIsPublished(item.isPublished);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authorsStr.trim() || !venue.trim()) {
      alert('Title, Authors, and Venue are required');
      return;
    }

    const authors = authorsStr
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        authors,
        venue: venue.trim(),
        year: Number(year),
        abstract: abstract.trim(),
        paperUrl: paperUrl.trim(),
        doi: doi.trim(),
        isPublished,
      };

      if (editingId) {
        await api.put(`/research/${editingId}`, payload);
      } else {
        await api.post('/research', payload);
      }

      setIsModalOpen(false);
      await fetchPapers();
    } catch (err: any) {
      alert(err.message || 'Failed to save paper');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, paperTitle: string) => {
    if (!confirm(`Delete research paper "${paperTitle}"?`)) return;
    try {
      await api.delete(`/research/${id}`);
      await fetchPapers();
    } catch (err: any) {
      alert(err.message || 'Failed to delete paper');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-ieee-blue" />
              Research Lead Workspace — Published Papers
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Curate branch research publications, IEEE Xplore articles, conference papers, and faculty-student journals.
            </p>
          </div>

          {(isSuperAdmin || hasPermission('research_papers', 'create')) && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Add Research Paper
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Papers List */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-ieee-blue animate-spin" />
          </div>
        ) : papers.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No Research Papers Listed"
            description="Add research papers authored by IEEE student branch members and faculty mentors."
            actionLabel="Add Research Paper"
            onAction={openCreateModal}
          />
        ) : (
          <div className="space-y-4">
            {papers.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ieee-blue bg-blue-50 px-2 py-0.5 rounded">
                      {p.year}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">{p.venue}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Authors: </span>
                    {p.authors.join(', ')}
                  </p>
                  {p.abstract && <p className="text-xs text-slate-600 line-clamp-2">{p.abstract}</p>}
                  {p.paperUrl && (
                    <a
                      href={p.paperUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-ieee-blue hover:underline pt-1"
                    >
                      <span>View Paper on IEEE Xplore / Publisher</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(p)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  {(isSuperAdmin || hasPermission('research_papers', 'delete')) && (
                    <button
                      onClick={() => handleDelete(p._id, p.title)}
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-ieee-blue" />
                  <h2 className="text-base font-bold text-slate-900">
                    {editingId ? 'Edit Research Paper' : 'Add Research Paper'}
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
                    Paper Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Deep Learning Approaches in 6G MIMO Signal Processing"
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Authors (comma separated) *
                  </label>
                  <input
                    type="text"
                    value={authorsStr}
                    onChange={(e) => setAuthorsStr(e.target.value)}
                    placeholder="e.g. Dr. A. Sharma, Priya Gupta, Rahul Verma"
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Publication Venue / Journal *
                    </label>
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="e.g. IEEE Transactions on Wireless Comm."
                      required
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      required
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Abstract
                  </label>
                  <textarea
                    rows={3}
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    placeholder="Brief summary of paper findings..."
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Paper URL / Publisher Link
                    </label>
                    <input
                      type="url"
                      value={paperUrl}
                      onChange={(e) => setPaperUrl(e.target.value)}
                      placeholder="https://ieeexplore.ieee.org/..."
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      DOI Code
                    </label>
                    <input
                      type="text"
                      value={doi}
                      onChange={(e) => setDoi(e.target.value)}
                      placeholder="10.1109/TWC.2026..."
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
                    <span>Save Paper</span>
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

