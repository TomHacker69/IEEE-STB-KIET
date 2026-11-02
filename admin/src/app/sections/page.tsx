'use client';

import React, { useEffect, useState } from 'react';
import {
  Sliders,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { EmptyState } from '../../components/EmptyState';

interface SectionConfigItem {
  _id: string;
  sectionKey: string;
  title: string;
  subtitle: string;
  orderIndex: number;
  isVisible: boolean;
  page: string;
}

const DEFAULT_SECTIONS = [
  { sectionKey: 'hero', title: 'Welcome to IEEE STB', subtitle: 'Advancing Technology for Humanity', orderIndex: 0 },
  { sectionKey: 'dignitaries', title: 'Our Honorable Dignitaries', subtitle: 'Guiding Vision & Leadership', orderIndex: 1 },
  { sectionKey: 'about', title: 'About Our Student Branch', subtitle: 'Department & Branch Legacy', orderIndex: 2 },
  { sectionKey: 'highlights', title: 'Branch Highlights', subtitle: 'Key Milestones & Achievements', orderIndex: 3 },
  { sectionKey: 'events', title: 'Upcoming & Past Events', subtitle: 'Workshops, Hackathons & Seminars', orderIndex: 4 },
  { sectionKey: 'activities', title: 'Our Activities', subtitle: 'Technical & Professional Engagements', orderIndex: 5 },
  { sectionKey: 'research', title: 'Research & Publications', subtitle: 'Contributions by Members and Faculty', orderIndex: 6 },
  { sectionKey: 'social', title: "What's Happening at IEEE", subtitle: 'Social Media Updates & Live Moments', orderIndex: 7 },
  { sectionKey: 'sponsors', title: 'Our Partners & Sponsors', subtitle: 'Organizations Supporting Our Mission', orderIndex: 8 },
  { sectionKey: 'developers_corner', title: 'Developers Corner', subtitle: 'The Minds Behind This Platform', orderIndex: 9 },
];

export default function SectionConfigPage() {
  const { isSuperAdmin, hasPermission } = useAuth();
  const [sections, setSections] = useState<SectionConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(false);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sections');
      if (res.success && res.data) {
        setSections(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load section config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleToggleVisibility = async (sec: SectionConfigItem) => {
    setSavingId(sec._id);
    try {
      await api.put(`/sections/${sec._id}`, {
        isVisible: !sec.isVisible,
      });
      setSections((prev) =>
        prev.map((item) => (item._id === sec._id ? { ...item, isVisible: !item.isVisible } : item))
      );
      setStatusMsg(`Visibility for "${sec.title || sec.sectionKey}" updated.`);
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update visibility');
    } finally {
      setSavingId(null);
    }
  };

  const handleUpdateText = async (sec: SectionConfigItem, newTitle: string, newSubtitle: string) => {
    setSavingId(sec._id);
    try {
      await api.put(`/sections/${sec._id}`, {
        title: newTitle,
        subtitle: newSubtitle,
      });
      setSections((prev) =>
        prev.map((item) =>
          item._id === sec._id ? { ...item, title: newTitle, subtitle: newSubtitle } : item
        )
      );
      setStatusMsg(`Updated title/subtitle for "${sec.sectionKey}".`);
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update text');
    } finally {
      setSavingId(null);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    const reorderedItems = newSections.map((sec, idx) => ({
      id: sec._id,
      orderIndex: idx,
    }));

    setSections(newSections.map((sec, idx) => ({ ...sec, orderIndex: idx })));

    try {
      await api.post('/sections/reorder', { items: reorderedItems });
      setStatusMsg('Section order updated in database.');
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to reorder sections');
      await fetchSections();
    }
  };

  const handleInitializeDefaults = async () => {
    setInitializing(true);
    try {
      for (const def of DEFAULT_SECTIONS) {
        await api.post('/sections', def);
      }
      await fetchSections();
    } catch (err: any) {
      alert(err.message || 'Failed to initialize sections');
    } finally {
      setInitializing(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-6 h-6 text-ieee-blue" />
              Section Configuration & Visibility
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Control which sections appear on the public site, rename their headings, and arrange their
              display order dynamically.
            </p>
          </div>

          {sections.length === 0 && (
            <button
              onClick={handleInitializeDefaults}
              disabled={initializing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              {initializing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Initialize Sections Registry</span>
            </button>
          )}
        </div>

        {statusMsg && (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-ieee-blue animate-spin" />
          </div>
        ) : sections.length === 0 ? (
          <EmptyState
            icon={Sliders}
            title="No Section Config Registered"
            description="Click 'Initialize Sections Registry' to register the standard IEEE sections registry in MongoDB."
            actionLabel="Initialize Sections Registry"
            onAction={handleInitializeDefaults}
          />
        ) : (
          <div className="space-y-4">
            {sections.map((sec, idx) => (
              <div
                key={sec._id}
                className={`bg-white rounded-xl border p-5 shadow-sm transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  sec.isVisible ? 'border-slate-200' : 'border-slate-200 bg-slate-50/60 opacity-70'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Order Controls */}
                  <div className="flex flex-col gap-1 items-center justify-center shrink-0">
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 text-slate-600 transition"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] font-bold text-slate-400">#{idx + 1}</span>
                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === sections.length - 1}
                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 text-slate-600 transition"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Section Title & Subtitle Edit */}
                  <div className="space-y-2 flex-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {sec.sectionKey}
                      </span>
                      {sec.isVisible ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Visible
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <EyeOff className="w-3 h-3" /> Hidden
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                          Section Title
                        </label>
                        <input
                          type="text"
                          defaultValue={sec.title}
                          onBlur={(e) => {
                            if (e.target.value !== sec.title) {
                              handleUpdateText(sec, e.target.value, sec.subtitle);
                            }
                          }}
                          className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-ieee-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                          Section Subtitle
                        </label>
                        <input
                          type="text"
                          defaultValue={sec.subtitle}
                          onBlur={(e) => {
                            if (e.target.value !== sec.subtitle) {
                              handleUpdateText(sec, sec.title, e.target.value);
                            }
                          }}
                          className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-ieee-blue"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visibility Toggle Button */}
                <div className="shrink-0 flex items-center gap-3">
                  <button
                    onClick={() => handleToggleVisibility(sec)}
                    disabled={savingId === sec._id}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                      sec.isVisible
                        ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {sec.isVisible ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide from Website</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show on Website</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

