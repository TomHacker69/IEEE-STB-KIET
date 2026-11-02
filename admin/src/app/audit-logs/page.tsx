'use client';

import React, { useEffect, useState } from 'react';
import {
  History,
  Shield,
  Loader2,
  AlertCircle,
  Filter,
  Eye,
  X,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { EmptyState } from '../../components/EmptyState';

interface AuditLogItem {
  _id: string;
  userName: string;
  userEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'LOGIN' | 'TOGGLE_DRIVE';
  section: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

export default function AuditLogsPage() {
  const { isSuperAdmin, hasPermission } = useAuth();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');

  // Detail Modal
  const [activeLog, setActiveLog] = useState<AuditLogItem | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = '';
      const params = new URLSearchParams();
      if (selectedSection !== 'all') params.append('section', selectedSection);
      if (selectedAction !== 'all') params.append('action', selectedAction);
      if (params.toString()) query = `?${params.toString()}`;

      const res = await api.get(`/audit-logs${query}`);
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedSection, selectedAction]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'UPDATE':
        return 'bg-blue-50 text-ieee-blue border-blue-200';
      case 'DELETE':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'TOGGLE_DRIVE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <History className="w-6 h-6 text-ieee-blue" />
              Administrative Audit Logs
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Immutable ledger tracking who modified which sections, published events, or altered website content.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white"
            >
              <option value="all">All Sections</option>
              <option value="site_content">Site Content</option>
              <option value="section_config">Section Config</option>
              <option value="events">Events</option>
              <option value="recruitment">Recruitment</option>
              <option value="certificates">Certificates</option>
              <option value="subadmins">Sub-Admins</option>
              <option value="roles">Roles</option>
            </select>

            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white"
            >
              <option value="all">All Actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="TOGGLE_DRIVE">TOGGLE_DRIVE</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Logs Table */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-ieee-blue animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            icon={History}
            title="No Audit Records Found"
            description="All administrative operations (creates, updates, deletes, and drive toggles) will automatically be logged here."
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 font-semibold text-slate-600">
                <tr>
                  <th className="py-3.5 px-6">Timestamp</th>
                  <th className="py-3.5 px-6">Admin User</th>
                  <th className="py-3.5 px-6">Action</th>
                  <th className="py-3.5 px-6">Section</th>
                  <th className="py-3.5 px-6">Resource ID</th>
                  <th className="py-3.5 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900">{log.userName}</p>
                      <p className="text-[11px] text-slate-500">{log.userEmail}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getActionBadge(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-[11px] text-slate-700">
                      {log.section}
                    </td>
                    <td className="py-4 px-6 font-mono text-[11px] text-slate-400">
                      {log.resourceId ? `${log.resourceId.substring(0, 10)}...` : '—'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setActiveLog(log)}
                        className="px-2.5 py-1 text-xs font-semibold text-ieee-blue bg-blue-50 hover:bg-blue-100 rounded transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: View Audit Details */}
        {activeLog && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h2 className="text-base font-bold text-slate-900">Audit Log Record Details</h2>
                <button
                  onClick={() => setActiveLog(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
                  <div>
                    <span className="font-bold text-slate-500 block">User:</span>
                    <span className="font-semibold text-slate-900">{activeLog.userName}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block">Email:</span>
                    <span className="text-slate-800">{activeLog.userEmail}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block">Action:</span>
                    <span className="font-bold text-ieee-blue">{activeLog.action}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block">Section:</span>
                    <span className="font-mono text-slate-800">{activeLog.section}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block">Timestamp:</span>
                    <span className="text-slate-700">
                      {new Date(activeLog.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block">Resource ID:</span>
                    <span className="font-mono text-slate-600">{activeLog.resourceId || 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block mb-1">Payload / Details:</span>
                  <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg overflow-x-auto text-[11px] font-mono">
                    {JSON.stringify(activeLog.details || {}, null, 2)}
                  </pre>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() => setActiveLog(null)}
                    className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

