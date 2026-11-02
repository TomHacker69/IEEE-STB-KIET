'use client';

import React, { useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  Save,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Database,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { ImageUploadField } from '../../components/ImageUploadField';
import { EmptyState } from '../../components/EmptyState';

interface ContentItem {
  _id: string;
  group: string;
  key: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'image' | 'url' | 'color' | 'boolean';
  description?: string;
}

const GROUPS = [
  { key: 'navbar', label: 'Navbar & Navigation' },
  { key: 'hero', label: 'Hero Section' },
  { key: 'about', label: 'About & Department' },
  { key: 'highlights', label: 'Branch Highlights & Stats' },
  { key: 'footer', label: 'Footer & Contact' },
  { key: 'branding', label: 'Branding & Theme' },
];

export default function SiteContentPage() {
  const { isSuperAdmin, hasPermission } = useAuth();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [activeGroup, setActiveGroup] = useState('navbar');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Edit State
  const [values, setValues] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [initLoading, setInitLoading] = useState(false);

  // Add Item Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState('navbar');
  const [newKey, setNewKey] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState<'text' | 'textarea' | 'image' | 'url'>('text');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await api.get('/content');
      if (res.success && res.data) {
        setItems(res.data);
        const valMap: Record<string, string> = {};
        res.data.forEach((item: ContentItem) => {
          valMap[item._id] = item.value;
        });
        setValues(valMap);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch site content');
    } finally {
      setLoading(false);
    }
  };

  const handleInitSchema = async () => {
    if (!confirm('This will create standard empty content slots in MongoDB if they do not exist yet. No placeholder text will be seeded. Continue?')) {
      return;
    }
    setInitLoading(true);
    try {
      const res = await api.post('/content/initialize-schema', {});
      if (res.success) {
        setSaveSuccess(res.message);
        await fetchContent();
        setTimeout(() => setSaveSuccess(null), 5000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to initialize schema');
    } finally {
      setInitLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleValueChange = (id: string, val: string) => {
    setValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleSaveItem = async (item: ContentItem) => {
    setSavingId(item._id);
    setSaveSuccess(null);
    try {
      await api.put(`/content/${item._id}`, {
        value: values[item._id] ?? item.value,
      });
      setSaveSuccess(`Updated "${item.label}" successfully! Changes reflect instantly.`);
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update content');
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteItem = async (item: ContentItem) => {
    if (!confirm(`Delete content key "${item.key}" from ${item.group}?`)) return;
    try {
      await api.delete(`/content/${item._id}`);
      await fetchContent();
    } catch (err: any) {
      alert(err.message || 'Failed to delete content');
    }
  };

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup || !newKey || !newLabel) {
      alert('Group, Key, and Label are required');
      return;
    }

    setCreating(true);
    try {
      await api.post('/content', {
        group: newGroup,
        key: newKey.trim(),
        label: newLabel.trim(),
        value: newValue,
        type: newType,
        description: newDesc,
      });

      setIsAddModalOpen(false);
      setNewKey('');
      setNewLabel('');
      setNewValue('');
      setNewDesc('');
      await fetchContent();
    } catch (err: any) {
      alert(err.message || 'Failed to create content item');
    } finally {
      setCreating(false);
    }
  };

  const filteredItems = items.filter((i) => i.group === activeGroup);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-6 h-6 text-ieee-blue" />
              Dynamic Site Content Manager
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Strict Non-Negotiable Rule: Zero Hardcoding. Every text, headline, label, image, and footer
              detail is saved in the database and editable here in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(isSuperAdmin || hasPermission('site_content', 'create')) && (
              <>
                <button
                  onClick={handleInitSchema}
                  disabled={initLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                >
                  <Database className="w-3.5 h-3.5 text-ieee-blue" />
                  <span>{initLoading ? 'Initializing...' : 'Initialize Schema Slots'}</span>
                </button>
                <button
                  onClick={() => {
                    setNewGroup(activeGroup);
                    setIsAddModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Content Key
                </button>
              </>
            )}
          </div>
        </div>

        {saveSuccess && (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Group Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2">
          {GROUPS.map((g) => (
            <button
              key={g.key}
              onClick={() => setActiveGroup(g.key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeGroup === g.key
                  ? 'bg-ieee-blue text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Content Items List */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-ieee-blue animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={`No Content Keys in "${activeGroup}"`}
            description="Initialize standard empty content slots or create custom keys for this section to display on the public website."
            actionLabel="Initialize Schema Slots"
            onAction={handleInitSchema}
          />
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.label}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.group}.{item.key}
                      </span>
                      {item.description && (
                        <span className="text-xs text-slate-500">{item.description}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveItem(item)}
                      disabled={savingId === item._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ieee-blue hover:bg-ieee-dark text-white rounded-md text-xs font-semibold transition disabled:opacity-50"
                    >
                      {savingId === item._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      <span>Save</span>
                    </button>
                    {isSuperAdmin && (
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                        title="Delete Key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Input depending on type */}
                {item.type === 'image' ? (
                  <ImageUploadField
                    label=""
                    value={values[item._id] || ''}
                    onChange={(url) => handleValueChange(item._id, url)}
                    folder="branding"
                  />
                ) : item.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    value={values[item._id] || ''}
                    onChange={(e) => handleValueChange(item._id, e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                ) : (
                  <input
                    type="text"
                    value={values[item._id] || ''}
                    onChange={(e) => handleValueChange(item._id, e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add New Content Key */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-ieee-blue" />
                  <h2 className="text-base font-bold text-slate-900">Add New Dynamic Content Key</h2>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateContent} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Section Group *
                  </label>
                  <select
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  >
                    {GROUPS.map((g) => (
                      <option key={g.key} value={g.key}>
                        {g.label} ({g.key})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Identifier Key *
                  </label>
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="e.g. hero_heading, college_name, copyright"
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Display Label *
                  </label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g. Hero Main Heading"
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Field Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  >
                    <option value="text">Single Line Text</option>
                    <option value="textarea">Multi-line Text / Paragraph</option>
                    <option value="image">Image / Media File</option>
                    <option value="url">External Link URL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Initial Value
                  </label>
                  {newType === 'image' ? (
                    <ImageUploadField
                      label=""
                      value={newValue}
                      onChange={(url) => setNewValue(url)}
                      folder="content"
                    />
                  ) : newType === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Enter content..."
                      className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  ) : (
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Enter content..."
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-5 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {creating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Create Key</span>
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

