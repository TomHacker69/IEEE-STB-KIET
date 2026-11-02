'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Save,
  X,
  AlertCircle,
  Quote,
  Linkedin,
  Github,
  Mail,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { ImageUploadField } from '../../components/ImageUploadField';
import { EmptyState } from '../../components/EmptyState';

interface MemberItem {
  _id: string;
  name: string;
  designation: string;
  tier: 'core_team' | 'regular_member' | 'content_member';
  photoUrl: string;
  quote?: string;
  email?: string;
  department?: string;
  membershipId?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
  orderIndex: number;
  isActive: boolean;
}

export default function MembersPage() {
  const { isSuperAdmin, hasPermission } = useAuth();
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [activeTier, setActiveTier] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [tier, setTier] = useState<'core_team' | 'regular_member' | 'content_member'>('core_team');
  const [photoUrl, setPhotoUrl] = useState('');
  const [quote, setQuote] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [membershipId, setMembershipId] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/members/admin');
      if (res.success && res.data) {
        setMembers(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setDesignation('');
    setTier('core_team');
    setPhotoUrl('');
    setQuote('');
    setEmail('');
    setDepartment('ECE');
    setMembershipId('');
    setLinkedin('');
    setGithub('');
    setOrderIndex(members.length);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MemberItem) => {
    setEditingId(item._id);
    setName(item.name);
    setDesignation(item.designation);
    setTier(item.tier);
    setPhotoUrl(item.photoUrl);
    setQuote(item.quote || '');
    setEmail(item.email || '');
    setDepartment(item.department || '');
    setMembershipId(item.membershipId || '');
    setLinkedin(item.socialLinks?.linkedin || '');
    setGithub(item.socialLinks?.github || '');
    setOrderIndex(item.orderIndex);
    setIsActive(item.isActive);
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
        tier,
        photoUrl,
        quote: tier === 'core_team' ? quote.trim() : '',
        email: email.trim(),
        department: department.trim(),
        membershipId: membershipId.trim(),
        socialLinks: {
          linkedin: linkedin.trim(),
          github: github.trim(),
          email: email.trim(),
        },
        orderIndex: Number(orderIndex),
        isActive,
      };

      if (editingId) {
        await api.put(`/members/${editingId}`, payload);
      } else {
        await api.post('/members', payload);
      }

      setIsModalOpen(false);
      await fetchMembers();
    } catch (err: any) {
      alert(err.message || 'Failed to save member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (!confirm(`Delete member "${memberName}"?`)) return;
    try {
      await api.delete(`/members/${id}`);
      await fetchMembers();
    } catch (err: any) {
      alert(err.message || 'Failed to delete member');
    }
  };

  const filteredMembers =
    activeTier === 'all' ? members : members.filter((m) => m.tier === activeTier);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-ieee-blue" />
              Team & Members Directory
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage Core Team, Regular Members, and Content Members. Quotes are exclusively supported for Core Team.
            </p>
          </div>

          {(isSuperAdmin || hasPermission('members', 'create')) && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tier Filter Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          {[
            { key: 'all', label: 'All Members' },
            { key: 'core_team', label: 'Core Team' },
            { key: 'regular_member', label: 'Regular Members' },
            { key: 'content_member', label: 'Content Team' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTier(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTier === tab.key
                  ? 'bg-ieee-blue text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Member Grid */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-ieee-blue animate-spin" />
          </div>
        ) : filteredMembers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Members Found"
            description="Add your first core team member or approved student branch member."
            actionLabel="Add Member"
            onAction={openCreateModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMembers.map((m) => (
              <div
                key={m._id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center gap-4">
                    {m.photoUrl ? (
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0 border border-slate-200">
                        {m.name.charAt(0)}
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{m.name}</h3>
                      <p className="text-xs font-semibold text-ieee-blue">{m.designation}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {m.tier.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {m.tier === 'core_team' && m.quote && (
                    <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-xs italic text-slate-600 flex items-start gap-1.5">
                      <Quote className="w-3 h-3 text-ieee-cyan shrink-0 mt-0.5" />
                      <span>&quot;{m.quote}&quot;</span>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Dept: {m.department || 'ECE'}</span>
                    <span className={m.isActive ? 'text-emerald-600 font-medium' : 'text-slate-400'}>
                      {m.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(m)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  {(isSuperAdmin || hasPermission('members', 'delete')) && (
                    <button
                      onClick={() => handleDelete(m._id, m.name)}
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

        {/* Modal: Create/Edit Member */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-ieee-blue" />
                  <h2 className="text-base font-bold text-slate-900">
                    {editingId ? 'Edit Member Details' : 'Add New Member'}
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
                      placeholder="e.g. Ankit Sharma"
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
                      placeholder="e.g. Chairperson, Webmaster"
                      required
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Member Tier *
                    </label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    >
                      <option value="core_team">Core Team (Quotes Enabled)</option>
                      <option value="regular_member">Regular Member</option>
                      <option value="content_member">Content Team Member</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. ECE / Electronics"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Member Avatar / Photo"
                  value={photoUrl}
                  onChange={(url) => setPhotoUrl(url)}
                  folder="members"
                />

                {tier === 'core_team' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Quote on IEEE (Core Team Exclusive)
                    </label>
                    <textarea
                      rows={2}
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      placeholder="e.g. IEEE gives students hands-on leadership and technical growth."
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@college.edu"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      IEEE Member ID
                    </label>
                    <input
                      type="text"
                      value={membershipId}
                      onChange={(e) => setMembershipId(e.target.value)}
                      placeholder="e.g. 98765432"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Order / Priority
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
                      id="isActiveMemberCheck"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-ieee-blue rounded border-slate-300 focus:ring-ieee-blue"
                    />
                    <label htmlFor="isActiveMemberCheck" className="text-xs font-semibold text-slate-700">
                      Active Member
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
                    <span>Save Member</span>
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

