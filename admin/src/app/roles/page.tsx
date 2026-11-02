'use client';

import React, { useEffect, useState } from 'react';
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Save,
  X,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth, RoleData, SectionPermissions } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { EmptyState } from '../../components/EmptyState';

const SECTIONS = [
  { key: 'site_content', label: 'Dynamic Site Content' },
  { key: 'section_config', label: 'Section Config & Order' },
  { key: 'dignitaries', label: 'Dignitaries (Home Honor Section)' },
  { key: 'members', label: 'Members & Core Team' },
  { key: 'events', label: 'Events' },
  { key: 'activities', label: 'Activities' },
  { key: 'research_papers', label: 'Research Papers' },
  { key: 'social_posts', label: 'Social Media Posts' },
  { key: 'sponsors', label: 'Sponsors' },
  { key: 'recruitment', label: 'Recruitment & Drives' },
  { key: 'certificates', label: 'Certificates' },
  { key: 'dev_corner', label: 'Developers Corner' },
  { key: 'audit_logs', label: 'Audit Logs' },
  { key: 'subadmins', label: 'Sub-Admin Accounts' },
  { key: 'roles', label: 'Role Management' },
];

const ACTIONS: (keyof SectionPermissions)[] = ['view', 'create', 'edit', 'delete', 'publish'];

export default function CustomRoleBuilderPage() {
  const { isSuperAdmin } = useAuth();
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [permissionsMatrix, setPermissionsMatrix] = useState<Record<string, SectionPermissions>>({});
  const [saving, setSaving] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/roles');
      if (res.success && res.data) {
        setRoles(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openCreateModal = () => {
    setEditingRoleId(null);
    setRoleName('');
    setRoleDescription('');
    const emptyMatrix: Record<string, SectionPermissions> = {};
    SECTIONS.forEach((sec) => {
      emptyMatrix[sec.key] = { view: false, create: false, edit: false, delete: false, publish: false };
    });
    setPermissionsMatrix(emptyMatrix);
    setIsModalOpen(true);
  };

  const openEditModal = (role: RoleData) => {
    setEditingRoleId(role._id);
    setRoleName(role.name);
    setRoleDescription(role.description);

    const initialMatrix: Record<string, SectionPermissions> = {};
    SECTIONS.forEach((sec) => {
      initialMatrix[sec.key] = {
        view: Boolean(role.permissions?.[sec.key]?.view),
        create: Boolean(role.permissions?.[sec.key]?.create),
        edit: Boolean(role.permissions?.[sec.key]?.edit),
        delete: Boolean(role.permissions?.[sec.key]?.delete),
        publish: Boolean(role.permissions?.[sec.key]?.publish),
      };
    });
    setPermissionsMatrix(initialMatrix);
    setIsModalOpen(true);
  };

  const togglePermission = (sectionKey: string, action: keyof SectionPermissions) => {
    setPermissionsMatrix((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [action]: !prev[sectionKey]?.[action],
      },
    }));
  };

  const toggleAllForSection = (sectionKey: string) => {
    const current = permissionsMatrix[sectionKey] || {};
    const allChecked = ACTIONS.every((act) => current[act]);
    const updated = {
      view: !allChecked,
      create: !allChecked,
      edit: !allChecked,
      delete: !allChecked,
      publish: !allChecked,
    };
    setPermissionsMatrix((prev) => ({ ...prev, [sectionKey]: updated }));
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      alert('Role name is required');
      return;
    }

    setSaving(true);
    try {
      if (editingRoleId) {
        await api.put(`/roles/${editingRoleId}`, {
          name: roleName.trim(),
          description: roleDescription,
          permissions: permissionsMatrix,
        });
      } else {
        await api.post('/roles', {
          name: roleName.trim(),
          description: roleDescription,
          permissions: permissionsMatrix,
        });
      }
      setIsModalOpen(false);
      await fetchRoles();
    } catch (err: any) {
      alert(err.message || 'Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete custom role "${name}"?`)) return;
    try {
      await api.delete(`/roles/${id}`);
      await fetchRoles();
    } catch (err: any) {
      alert(err.message || 'Failed to delete role');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-6 h-6 text-ieee-blue" />
              Custom Role Builder
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create custom administrative roles from scratch and assign granular permissions per section.
            </p>
          </div>

          {isSuperAdmin && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Create New Role
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Roles List */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-ieee-blue animate-spin" />
          </div>
        ) : roles.length === 0 ? (
          <EmptyState
            icon={Shield}
            title="No Roles Configured"
            description="Run the Super Admin seed script or click 'Create New Role' to build your first custom role template."
            actionLabel="Create New Role"
            onAction={openCreateModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {roles.map((r) => {
              // Count allowed permissions
              let count = 0;
              if (r.name === 'Super Admin') {
                count = SECTIONS.length * ACTIONS.length;
              } else if (r.permissions) {
                Object.values(r.permissions).forEach((sp) => {
                  ACTIONS.forEach((act) => {
                    if (sp?.[act]) count++;
                  });
                });
              }

              return (
                <div
                  key={r._id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900">{r.name}</h3>
                      {r.isSystem ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          System Role
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-ieee-blue px-2 py-0.5 rounded">
                          Custom Role
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                      {r.description || 'No description provided.'}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Permissions Granted:</span>
                      <span className="font-semibold text-slate-800">
                        {r.name === 'Super Admin' ? 'All Unrestricted' : `${count} actions`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(r)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Configure
                    </button>
                    {!r.isSystem && isSuperAdmin && (
                      <button
                        onClick={() => handleDeleteRole(r._id, r.name)}
                        className="px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition"
                        title="Delete Role"
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

        {/* Modal: Create / Edit Role with Granular Permission Matrix */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-8">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-ieee-blue" />
                  <h2 className="text-base font-bold text-slate-900">
                    {editingRoleId ? `Configure Role: ${roleName}` : 'Build New Custom Role'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSaveRole} className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Role Name *
                    </label>
                    <input
                      type="text"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="e.g. Workshop Coordinator"
                      required
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      placeholder="Brief description of responsibilities"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
                    />
                  </div>
                </div>

                {/* Granular Permission Matrix */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Granular Permission Matrix (Per Section)
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      Check specific actions permitted for this role
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                      <thead className="bg-slate-100 font-semibold text-slate-700">
                        <tr>
                          <th className="py-3 px-4">Section / Domain</th>
                          {ACTIONS.map((act) => (
                            <th key={act} className="py-3 px-3 text-center uppercase tracking-wider">
                              {act}
                            </th>
                          ))}
                          <th className="py-3 px-3 text-center">Toggle Row</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {SECTIONS.map((sec) => {
                          const current = permissionsMatrix[sec.key] || {};
                          return (
                            <tr key={sec.key} className="hover:bg-slate-50 transition">
                              <td className="py-2.5 px-4 font-medium text-slate-800">{sec.label}</td>
                              {ACTIONS.map((act) => (
                                <td key={act} className="py-2.5 px-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(current[act])}
                                    onChange={() => togglePermission(sec.key, act)}
                                    className="w-4 h-4 text-ieee-blue rounded border-slate-300 focus:ring-ieee-blue cursor-pointer"
                                  />
                                </td>
                              ))}
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => toggleAllForSection(sec.key)}
                                  className="text-[11px] text-ieee-blue hover:underline font-medium"
                                >
                                  All / None
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer Controls */}
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
                    disabled={saving}
                    className="px-5 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-semibold shadow flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save Role & Permissions</span>
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

