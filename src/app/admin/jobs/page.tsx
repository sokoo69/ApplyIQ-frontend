"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { adminApi } from '@/lib/api/admin';
import { jobsApi } from '@/lib/api/jobs';
import { useJobs } from '@/hooks/useJobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loader2, Plus, Edit, Trash2, ShieldAlert, Briefcase, Users, BarChart3, BotMessageSquare, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type Tab = 'jobs' | 'audit' | 'users' | 'charts';

const EMPTY_JOB = {
  title: '', company: '', companyLogoUrl: '', location: '', category: '',
  jobType: 'full-time', description: '', requirements: '', deadline: '',
};

const formatDateSafe = (dateInput: any, fmt: string, fallback = '—') => {
  if (!dateInput) return fallback;
  const d = new Date(dateInput);
  return isNaN(d.getTime()) ? fallback : format(d, fmt);
};

export default function AdminJobsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>('jobs');
  const [page, setPage] = useState(1);
  const { jobs, isLoading: jobsLoading, refetch } = useJobs({ limit: 50, page });

  // Stats
  const [stats, setStats] = useState<any>(null);

  // Audit
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isAuditLoading, setIsAuditLoading] = useState(false);

  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);

  // Job modal
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [jobForm, setJobForm] = useState({ ...EMPTY_JOB });
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Applicants Modal
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isApplicantsLoading, setIsApplicantsLoading] = useState(false);

  const openApplicants = async (jobId: string) => {
    setSelectedJobId(jobId);
    setShowApplicantsModal(true);
    setIsApplicantsLoading(true);
    try {
      const data = await adminApi.getJobApplications(jobId);
      setApplicants(data);
    } catch (e) {
      console.error(e);
      alert('Failed to load applicants');
    } finally {
      setIsApplicantsLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      await adminApi.updateApplicationStatus(applicationId, newStatus);
      setApplicants(prev => prev.map(a => a._id === applicationId ? { ...a, status: newStatus } : a));
    } catch (e) {
      console.error(e);
      alert('Failed to update status');
    }
  };

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) router.push('/login');
      else if (user?.role !== 'admin') router.push('/dashboard');
    }
  }, [isAuthLoading, isAuthenticated, user, router]);

  // ── Load stats on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      adminApi.getStats().then(setStats).catch(console.error);
    }
  }, [isAuthenticated, user]);

  // ── Tab data loaders ────────────────────────────────────────────────────────
  const fetchAuditLogs = useCallback(async () => {
    setIsAuditLoading(true);
    try { setAuditLogs((await adminApi.getAuditLogs({ limit: 50 })).logs); }
    catch (e) { console.error(e); }
    finally { setIsAuditLoading(false); }
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsUsersLoading(true);
    try { setUsers((await adminApi.getUsers({ limit: 30 })).users); }
    catch (e) { console.error(e); }
    finally { setIsUsersLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === 'audit' && auditLogs.length === 0) fetchAuditLogs();
    if (activeTab === 'users' && users.length === 0) fetchUsers();
  }, [activeTab]);

  // ── Job form helpers ────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingJob(null);
    setJobForm({ ...EMPTY_JOB });
    setFormError('');
    setShowJobModal(true);
  };

  const openEdit = (job: any) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || '',
      company: job.company || '',
      companyLogoUrl: job.companyLogoUrl || '',
      location: job.location || '',
      category: job.category || '',
      jobType: job.jobType || 'full-time',
      description: job.description || '',
      requirements: (job.requirements || []).join('\n'),
      deadline: job.deadline ? formatDateSafe(job.deadline, 'yyyy-MM-dd', '') : '',
    });
    setFormError('');
    setShowJobModal(true);
  };

  const handleSaveJob = async () => {
    if (!jobForm.title || !jobForm.company || !jobForm.description) {
      setFormError('Title, Company and Description are required.');
      return;
    }
    setIsSaving(true);
    setFormError('');
    try {
      const payload = {
        ...jobForm,
        requirements: jobForm.requirements.split('\n').map((r: string) => r.trim()).filter(Boolean),
        deadline: jobForm.deadline ? new Date(jobForm.deadline).toISOString() : undefined,
      };
      if (editingJob) {
        await adminApi.updateJob(editingJob._id, payload);
      } else {
        await adminApi.createJob(payload);
      }
      setShowJobModal(false);
      refetch();
      // Refresh stats
      adminApi.getStats().then(setStats).catch(console.error);
    } catch (e: any) {
      setFormError(e.message || 'Failed to save job');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job? This cannot be undone.')) return;
    setIsDeleting(id);
    try {
      await adminApi.deleteJob(id);
      refetch();
      adminApi.getStats().then(setStats).catch(console.error);
    } catch (e) { alert('Failed to delete job'); }
    finally { setIsDeleting(null); }
  };

  if (isAuthLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[var(--color-neutral-bg)] flex items-center justify-center flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
        <p className="text-gray-500 font-medium">Verifying admin access...</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'jobs', label: 'Manage Jobs' },
    { id: 'audit', label: 'Audit Log' },
    { id: 'users', label: 'Users' },
    { id: 'charts', label: 'Platform Charts' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-neutral-bg)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-[family-name:var(--font-heading)] flex items-center gap-3">
              <ShieldAlert className="h-8 w-8 text-amber-500" />
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">Platform management — Jobs, Users &amp; Audit Log.</p>
          </div>
          {activeTab === 'jobs' && (
            <Button variant="primary" className="gap-2" onClick={openCreate}>
              <Plus className="h-4 w-4" /> Post New Job
            </Button>
          )}
        </div>

        {/* Platform Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Jobs', value: stats?.totalJobs, icon: Briefcase, color: 'indigo' },
            { label: 'Registered Users', value: stats?.totalUsers, icon: Users, color: 'emerald' },
            { label: 'Total Applications', value: stats?.totalApplications, icon: BarChart3, color: 'amber' },
            { label: 'AI Calls Today', value: stats?.aiUsageToday, icon: BotMessageSquare, color: 'violet' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className={`border-l-4 border-l-${color}-500`}>
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {value !== undefined ? value.toLocaleString() : <Loader2 className="h-6 w-6 animate-spin text-gray-400 mt-1" />}
                    </p>
                  </div>
                  <div className={`h-10 w-10 bg-${color}-50 rounded-full flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 text-${color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 flex gap-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === t.id
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Jobs ── */}
        {activeTab === 'jobs' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                    <th className="py-3 px-6 font-semibold">Job Title</th>
                    <th className="py-3 px-6 font-semibold">Company</th>
                    <th className="py-3 px-6 font-semibold">Type</th>
                    <th className="py-3 px-6 font-semibold">Posted</th>
                    <th className="py-3 px-6 font-semibold">Deadline</th>
                    <th className="py-3 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobsLoading ? (
                    <tr><td colSpan={6} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" /></td></tr>
                  ) : jobs.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-gray-500">No jobs found. Post the first one!</td></tr>
                  ) : (
                    jobs.map((job: any) => (
                      <tr key={job._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{job.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{job.category || 'Uncategorized'}</div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{job.company}</td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className="capitalize text-xs">{job.jobType || 'Standard'}</Badge>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {formatDateSafe(job.createdAt, 'MMM dd, yyyy', 'Unknown')}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {job.deadline && !isNaN(new Date(job.deadline).getTime()) ? (
                            <span className={`font-medium ${new Date(job.deadline) < new Date() ? 'text-red-500' : 'text-gray-700'}`}>
                              {formatDateSafe(job.deadline, 'MMM dd, yyyy')}
                              {new Date(job.deadline) < new Date() && ' (expired)'}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                          <Button variant="outline" size="sm" className="h-8 px-2 border-gray-300" title="View Applicants" onClick={() => openApplicants(job._id)}>
                            <Users className="h-4 w-4 text-[var(--color-primary)]" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 px-2 border-gray-300" title="Edit Job" onClick={() => openEdit(job)}>
                            <Edit className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="outline" size="sm"
                            className="h-8 px-2 border-red-200 hover:bg-red-50 text-red-600"
                            onClick={() => handleDelete(job._id)}
                            disabled={isDeleting === job._id}
                          >
                            {isDeleting === job._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ── Tab: Audit Log ── */}
        {activeTab === 'audit' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                    <th className="py-3 px-6 font-semibold">Admin</th>
                    <th className="py-3 px-6 font-semibold">Action</th>
                    <th className="py-3 px-6 font-semibold">Changes</th>
                    <th className="py-3 px-6 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isAuditLoading ? (
                    <tr><td colSpan={4} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" /></td></tr>
                  ) : auditLogs.length === 0 ? (
                    <tr><td colSpan={4} className="py-12 text-center text-gray-500">No audit logs yet.</td></tr>
                  ) : (
                    auditLogs.map((log: any) => (
                      <tr key={log._id} className="hover:bg-gray-50/50">
                        <td className="py-4 px-6 text-sm">
                          <div className="font-medium text-gray-900">{log.adminUser?.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{log.adminUser?.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className={`capitalize text-xs ${log.action === 'delete_job' ? 'border-red-200 text-red-700' : log.action === 'create_job' ? 'border-green-200 text-green-700' : 'border-blue-200 text-blue-700'}`}>
                            {log.action.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-700 max-w-xs truncate" title={log.changesSummary}>{log.changesSummary}</td>
                        <td className="py-4 px-6 text-sm text-gray-500">{formatDateSafe(log.timestamp, 'MMM dd, yyyy HH:mm')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ── Tab: Users ── */}
        {activeTab === 'users' && (
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base text-gray-600 font-normal">
                Showing account-level info only. No personal data (resumes, cover letters) is displayed here.
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                    <th className="py-3 px-6 font-semibold">Name</th>
                    <th className="py-3 px-6 font-semibold">Email</th>
                    <th className="py-3 px-6 font-semibold">Role</th>
                    <th className="py-3 px-6 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isUsersLoading ? (
                    <tr><td colSpan={4} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" /></td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={4} className="py-12 text-center text-gray-500">No users found.</td></tr>
                  ) : (
                    users.map((u: any) => (
                      <tr key={u._id} className="hover:bg-gray-50/50">
                        <td className="py-4 px-6 font-medium text-gray-900">{u.name}</td>
                        <td className="py-4 px-6 text-gray-600">{u.email}</td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className={`text-xs capitalize ${u.role === 'admin' ? 'border-amber-300 text-amber-700 bg-amber-50' : 'border-gray-200 text-gray-600'}`}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">{formatDateSafe(u.createdAt, 'MMM dd, yyyy')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ── Tab: Platform Charts ── */}
        {activeTab === 'charts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Jobs Posted by Category</CardTitle></CardHeader>
              <CardContent className="h-72">
                {stats?.jobsByCategory?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.jobsByCategory}>
                      <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">No category data yet</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Applications by Job Category</CardTitle></CardHeader>
              <CardContent className="h-72">
                {stats?.appsByCategory?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.appsByCategory}>
                      <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="count" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">No application data yet</div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

      </div>

      {/* ── Job Create/Edit Modal ── */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editingJob ? 'Edit Job' : 'Post New Job'}</h2>
              <button onClick={() => setShowJobModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200">{formError}</div>
              )}

              {[
                { label: 'Job Title *', key: 'title', placeholder: 'e.g. Senior Frontend Developer' },
                { label: 'Company *', key: 'company', placeholder: 'e.g. Acme Inc.' },
                { label: 'Company Logo URL', key: 'companyLogoUrl', placeholder: 'e.g. https://example.com/logo.png (Optional)' },
                { label: 'Location', key: 'location', placeholder: 'e.g. Remote / Dhaka, BD' },
                { label: 'Category', key: 'category', placeholder: 'e.g. Engineering, Design, Marketing' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
                    placeholder={placeholder}
                    value={(jobForm as any)[key]}
                    onChange={e => setJobForm(f => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                    value={jobForm.jobType}
                    onChange={e => setJobForm(f => ({ ...f, jobType: e.target.value }))}
                  >
                    {['full-time', 'part-time', 'remote', 'contract'].map(t => (
                      <option key={t} value={t} className="capitalize">{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                    value={jobForm.deadline}
                    onChange={e => setJobForm(f => ({ ...f, deadline: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none"
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  value={jobForm.description}
                  onChange={e => setJobForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line)</label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none font-mono"
                  placeholder="3+ years React experience&#10;TypeScript proficiency&#10;REST API design"
                  value={jobForm.requirements}
                  onChange={e => setJobForm(f => ({ ...f, requirements: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <Button variant="outline" onClick={() => setShowJobModal(false)} disabled={isSaving}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveJob} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {editingJob ? 'Save Changes' : 'Post Job'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* ── Applicants Modal ── */}
      {showApplicantsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900">Job Applicants</h2>
              <button onClick={() => setShowApplicantsModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {isApplicantsLoading ? (
                <div className="py-12 text-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)] mx-auto" /></div>
              ) : applicants.length === 0 ? (
                <div className="py-12 text-center text-gray-500">No one has applied to this job yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                        <th className="py-3 px-4 font-semibold">Applicant</th>
                        <th className="py-3 px-4 font-semibold">Applied At</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {applicants.map((app) => (
                        <tr key={app._id}>
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{app.user?.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{app.user?.email || ''}</div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {formatDateSafe(app.createdAt, 'MMM dd, yyyy')}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                              value={app.status}
                              onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                            >
                              <option value="Saved">Saved</option>
                              <option value="Applied">Applied</option>
                              <option value="Interview">Interview</option>
                              <option value="Offer">Offer</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
