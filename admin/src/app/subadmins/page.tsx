'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
  AlertCircle,
  KeyRound,
  X,
  Mail,
  Lock,
  User,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth, RoleData } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { EmptyState } from '../../components/EmptyState';

interface SubAdminUser {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  roleId?: RoleData;
  createdAt: string;
}

export default function SubAdminsPage() {
  const { isSuperAdmin } = useAuth();
  const [subadmins, setSubadmins] = useState<SubAdminUser[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Provision Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adminsRes, rolesRes] = await Promise.all([
        api.get('/auth/subadmins'),
        api.get('/roles'),
      ]);

      if (adminsRes.success && adminsRes.data) {
        setSubadmins(adminsRes.data);
      }
      if (rolesRes.success && rolesRes.data) {
        setRoles(rolesRes.data);
        if (rolesRes.data.length > 0) {
          setSelectedRoleId(rolesRes.data[0]._id);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sub-admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !selectedRoleId) {
      alert('Please fill out all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/auth/subadmins', {
        name,
        email,
        password,
        roleId: selectedRoleId,
      });

      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to provision sub-admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: SubAdminUser) => {
    try {
      await api.put(`/auth/subadmins/${user._id}`, {
        isActive: !user.isActive,
      });
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleDeleteSubAdmin = async (id: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to deactivate and remove privileges for ${userEmail}?`)) {
      return;
    }
    try {
      await api.delete(`/auth/subadmins/${id}`);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to remove sub-admin');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-ieee-blue" />
              Sub-Admin Accounts Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Issue credentials and assign functional administrative roles (Social Media Head, Membership Lead, etc.).
            </p>
          </div>

          {isSuperAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <UserPlus className="w-4 h-4" />
              Provision Sub-Admin Account
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Sub-Admins Table */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-ieee-blue animate-spin" />
          </div>
        ) : subadmins.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Sub-Admin Accounts Found"
            description="Provision your first sub-admin with assigned roles such as Membership Lead or Social Media Head."
            actionLabel="Provision Sub-Admin"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 font-semibold text-slate-600">
                <tr>
                  <th className="py-3.5 px-6">Name & Email</th>
                  <th className="py-3.5 px-6">Assigned Role</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Created On</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {subadmins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{admin.name}</p>
                          <p className="text-[11px] text-slate-500">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {admin.isSuperAdmin ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold">
                          <Shield className="w-3 h-3 text-amber-600" /> Super Admin
                        </span>
                      ) : admin.roleId ? (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-ieee-blue border border-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                          <Shield className="w-3 h-3" /> {admin.roleId.name}
                        </span>
                      ) : (
                        <span className="text-slate-400">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {admin.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                          <XCircle className="w-3 h-3 text-red-600" /> Deactivated
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {!admin.isSuperAdmin && isSuperAdmin && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(admin)}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                              admin.isActive
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {admin.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteSubAdmin(admin._id, admin.email)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                            title="Revoke Admin Access"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: Provision Sub-Admin */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-ieee-blue" />
                  <h2 className="text-base font-bold text-slate-900">Provision Sub-Admin</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubAdmin} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      required
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="lead@ieee.org"
                      required
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Temporary Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    The user will log in with this password and can update it anytime.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Assign Role *
                  </label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                  >
                    {roles
                      .filter((r) => r.name !== 'Super Admin')
                      .map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.name} — {r.description || 'Functional Lead Role'}
                        </option>
                      ))}
                  </select>
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
                      <KeyRound className="w-4 h-4" />
                    )}
                    <span>Issue Credentials</span>
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

