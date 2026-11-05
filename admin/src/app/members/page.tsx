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
  Linkedin,
  Github,
  Mail,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Shield,
  UserCheck,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { ImageUploadField } from '../../components/ImageUploadField';
import { EmptyState } from '../../components/EmptyState';

export type MemberTier = 'core_team' | 'regular_member';

interface MemberItem {
  _id: string;
  name: string;
  designation: string;
  tier: MemberTier;
  photoUrl: string;
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
  const [tier, setTier] = useState<MemberTier>('core_team');
  const [photoUrl, setPhotoUrl] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [membershipId, setMembershipId] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Batch Import State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchRawText, setBatchRawText] = useState('');
  const [batchImporting, setBatchImporting] = useState(false);
  const [batchResult, setBatchResult] = useState<{ success: boolean; message: string } | null>(null);

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

  const handleBatchImport = async () => {
    if (!batchRawText.trim()) {
      alert('Please paste or enter member rows.');
      return;
    }

    const lines = batchRawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));
    const membersToImport = [];

    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      if (parts.length >= 2) {
        const [mName, mEmail, mDesignation, mDepartment, mTier] = parts;
        if (!mName || !mEmail) continue;
        membersToImport.push({
          name: mName,
          email: mEmail.toLowerCase(),
          designation: mDesignation || 'Member',
          department: mDepartment || 'Engineering',
          tier: mTier === 'core_team' ? 'core_team' : 'regular_member',
          orderIndex: i,
        });
      }
    }

    if (membersToImport.length === 0) {
      alert('Could not parse any valid rows. Please follow format: Name, Email, Designation, Department, Tier (core_team / regular_member)');
      return;
    }

    setBatchImporting(true);
    setBatchResult(null);
    try {
      const res = await api.post('/members/batch-import', { members: membersToImport });
      if (res.success) {
        setBatchResult({
          success: true,
          message: res.message || `Successfully imported ${membersToImport.length} members!`,
        });
        await fetchMembers();
        setTimeout(() => {
          setIsBatchModalOpen(false);
          setBatchResult(null);
          setBatchRawText('');
        }, 1500);
      }
    } catch (err: any) {
      setBatchResult({ success: false, message: err.message || 'Batch import failed.' });
    } finally {
      setBatchImporting(false);
    }
  };

  // When clicking Add Member, automatically set the form tier to whichever tab is currently active
  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setDesignation('');
    // Automatically match the currently active tab if on regular_member or core_team
    const initialTier: MemberTier = activeTier === 'regular_member' ? 'regular_member' : 'core_team';
    setTier(initialTier);
    setPhotoUrl('');
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
    setTier(item.tier === 'core_team' ? 'core_team' : 'regular_member');
    setPhotoUrl(item.photoUrl);
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
    activeTier === 'all'
      ? members
      : members.filter((m) =>
          activeTier === 'regular_member'
            ? m.tier === 'regular_member' || (m.tier as any) === 'content_member'
            : m.tier === activeTier
        );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2.5">
              <Users className="w-6 h-6 text-ieee-blue" />
              Team & Members Directory
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage Core Team and Regular Members. (Quotes are exclusively reserved for Dignitaries).
            </p>
          </div>

          {(isSuperAdmin || hasPermission('members', 'create')) && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsBatchModalOpen(true);
                  setBatchResult(null);
                }}
                className="neu-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-ieee-blue transition"
              >
                <UploadCloud className="w-4 h-4 text-slate-500" />
                Batch Import Roster
              </button>
              <button
                onClick={openCreateModal}
                className="neu-btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 neu-inset text-red-600 rounded-2xl text-xs flex items-center gap-2.5 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Two-Tier Filter Tabs in Neumorphic Track */}
        <div className="flex">
          <div className="neu-inset p-1.5 rounded-2xl inline-flex gap-2">
            {[
              { key: 'all', label: 'All Members' },
              { key: 'core_team', label: 'Core Team' },
              { key: 'regular_member', label: 'Regular Members' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTier(tab.key)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTier === tab.key
                    ? 'neu-pill-active text-ieee-blue shadow-[inset_3px_3px_6px_#c4d0e0,inset_-3px_-3px_6px_#ffffff]'
                    : 'neu-btn text-slate-600 hover:text-ieee-blue'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((m) => {
              const isCore = m.tier === 'core_team';
              return (
                <div
                  key={m._id}
                  className="neu-card rounded-3xl p-6 border border-white/60 flex flex-col justify-between hover:shadow-[-8px_-8px_16px_#ffffff,8px_8px_16px_#c4d0e0] transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center gap-4">
                      {m.photoUrl ? (
                        <div className="w-14 h-14 rounded-2xl p-1 neu-inset shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover rounded-xl" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl neu-inset text-ieee-blue font-bold flex items-center justify-center shrink-0 text-lg">
                          {m.name.charAt(0)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-800 truncate">{m.name}</h3>
                        <p className="text-xs font-semibold text-ieee-blue truncate">{m.designation}</p>
                        <span
                          className={`inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                            isCore
                              ? 'neu-pill text-amber-700 bg-amber-50/50'
                              : 'neu-pill text-slate-600'
                          }`}
                        >
                          {isCore ? '★ Core Member' : 'Regular Member'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-300/40 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>Dept: {m.department || 'ECE'}</span>
                      <span className={m.isActive ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {m.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-300/40 flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => openEditModal(m)}
                      className="neu-btn px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-ieee-blue rounded-xl transition flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    {(isSuperAdmin || hasPermission('members', 'delete')) && (
                      <button
                        onClick={() => handleDelete(m._id, m.name)}
                        className="neu-btn p-2 text-slate-400 hover:text-red-600 rounded-xl transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Create/Edit Member with Adaptive Form Version Switcher */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="neu-card-lg rounded-3xl max-w-lg w-full border border-white/80 overflow-hidden my-8 bg-[#e8edf5]">
              <div className="px-6 py-4 border-b border-slate-300/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl neu-card-sm flex items-center justify-center text-ieee-blue">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800">
                      {editingId ? 'Edit Member Details' : 'Add New Member'}
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Configure member profile and portal access
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="neu-btn p-2 rounded-xl text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Version Switcher: Core Member vs Regular Member */}
              <div className="p-6 pb-0">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Select Member Classification
                </label>
                <div className="neu-inset p-1.5 rounded-2xl flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTier('core_team')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                      tier === 'core_team'
                        ? 'neu-pill-active text-amber-800 shadow-[inset_3px_3px_6px_#c4d0e0,inset_-3px_-3px_6px_#ffffff]'
                        : 'neu-btn text-slate-600 hover:text-amber-800'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span>★ Core Member</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTier('regular_member')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                      tier === 'regular_member'
                        ? 'neu-pill-active text-ieee-blue shadow-[inset_3px_3px_6px_#c4d0e0,inset_-3px_-3px_6px_#ffffff]'
                        : 'neu-btn text-slate-600 hover:text-ieee-blue'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-ieee-blue" />
                    <span>● Regular Member</span>
                  </button>
                </div>

                {/* Adaptive Version Indicator */}
                <div className="mt-3 p-3 neu-card-sm rounded-xl border border-white/60 flex items-center gap-2 text-xs">
                  {tier === 'core_team' ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-amber-900 font-bold">
                        Core Council Form: Elevated executive member featured in leadership directory.
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-ieee-blue shrink-0" />
                      <span className="text-slate-700 font-bold">
                        Regular Member Form: Standard student branch member with portal verification.
                      </span>
                    </>
                  )}
                </div>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ankit Sharma"
                      required
                      className="w-full neu-inset rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Designation *
                    </label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder={
                        tier === 'core_team'
                          ? 'e.g. Chairperson, Webmaster, Technical Lead'
                          : 'e.g. Student Member, Associate, Volunteer'
                      }
                      required
                      className="w-full neu-inset rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Electronics and Communication Engineering (ECE)"
                    className="w-full neu-inset rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <ImageUploadField
                  label="Member Avatar / Photo"
                  value={photoUrl}
                  onChange={(url) => setPhotoUrl(url)}
                  folder="members"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@college.edu"
                      required
                      className="w-full neu-inset rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-500 font-medium mt-1">
                      Enables secure login to the Member Dashboard.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      IEEE Member ID
                    </label>
                    <input
                      type="text"
                      value={membershipId}
                      onChange={(e) => setMembershipId(e.target.value)}
                      placeholder="e.g. 98765432"
                      className="w-full neu-inset rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full neu-inset rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full neu-inset rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Order / Priority Index
                    </label>
                    <input
                      type="number"
                      value={orderIndex}
                      onChange={(e) => setOrderIndex(Number(e.target.value))}
                      className="w-full neu-inset rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none"
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
                    <label htmlFor="isActiveMemberCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                      Active Member
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-300/40 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="neu-btn px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="neu-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save {tier === 'core_team' ? 'Core Member' : 'Regular Member'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Batch Import Modal */}
        {isBatchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="neu-card-lg rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/80 p-6 sm:p-8 bg-[#e8edf5]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-300/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl neu-card-sm flex items-center justify-center text-ieee-blue">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800">Batch Import IEEE Roster</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Import multiple members at once (Core or Regular)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsBatchModalOpen(false)}
                  className="neu-btn p-2 rounded-xl text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="my-5 space-y-4">
                <div className="p-4 neu-inset rounded-2xl space-y-2 text-xs text-slate-700">
                  <span className="font-bold text-slate-800">CSV Row Format (One member per line):</span>
                  <code className="block bg-[#e8edf5] p-2.5 rounded-xl neu-inset font-mono text-[11px] text-slate-800">
                    FullName, Email, Designation, Department, Tier
                  </code>
                  <p className="text-[11px] text-slate-500 font-medium">
                    * Tier must be: <code>core_team</code> or <code>regular_member</code>.<br />
                    * Registered emails are automatically authorized to log into the Member Portal.
                  </p>
                </div>

                {batchResult && (
                  <div
                    className={`p-4 rounded-2xl neu-inset text-xs flex items-center gap-2 font-medium ${
                      batchResult.success ? 'text-emerald-800' : 'text-red-700'
                    }`}
                  >
                    {batchResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>{batchResult.message}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Member Data Rows (One per line)
                  </label>
                  <textarea
                    rows={10}
                    value={batchRawText}
                    onChange={(e) => setBatchRawText(e.target.value)}
                    placeholder="FullName, Email, Designation, Department, Tier&#10;Aarav Verma, aarav@kiet.edu, Technical Lead, ECE, core_team&#10;Riya Sharma, riya@kiet.edu, Member, CSE, regular_member"
                    className="w-full neu-inset rounded-2xl p-4 font-mono text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-300/40">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="neu-btn px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBatchImport}
                  disabled={batchImporting || !batchRawText.trim()}
                  className="neu-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition disabled:opacity-50"
                >
                  {batchImporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UploadCloud className="w-4 h-4" />
                  )}
                  <span>{batchImporting ? 'Importing Roster...' : 'Import Roster'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
