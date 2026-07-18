"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { jobsApi } from '@/lib/api/jobs';
import { useJobs } from '@/hooks/useJobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loader2, Plus, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminJobsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  
  const [page, setPage] = useState(1);
  const { jobs, isLoading, refetch } = useJobs({ limit: 50, page });

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role !== 'admin') {
        router.push('/items/manage'); // Redirect non-admins
      }
    }
  }, [isAuthLoading, isAuthenticated, user, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    setIsDeleting(id);
    try {
      await jobsApi.deleteJob(id);
      refetch();
    } catch (error) {
      console.error('Failed to delete', error);
      alert('Failed to delete job');
    } finally {
      setIsDeleting(null);
    }
  };

  if (isAuthLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[var(--color-neutral-bg)] flex items-center justify-center flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
        <p className="text-gray-500 font-medium">Verifying admin access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-neutral-bg)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-[family-name:var(--font-heading)] flex items-center gap-3">
              <ShieldAlert className="h-8 w-8 text-amber-500" />
              Job Moderation (Admin)
            </h1>
            <p className="mt-2 text-gray-600">Manage all public job postings available on ApplyIQ.</p>
          </div>
          {/* Using an alert for new jobs just to simulate the admin interface, since modal would take lots of code */}
          <Button variant="primary" className="gap-2" onClick={() => alert('New Job Modal would open here')}>
            <Plus className="h-4 w-4" /> Post New Job
          </Button>
        </div>

        <Card className="shadow-sm border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                  <th className="py-3 px-6 font-semibold">Job Title</th>
                  <th className="py-3 px-6 font-semibold">Company</th>
                  <th className="py-3 px-6 font-semibold">Type</th>
                  <th className="py-3 px-6 font-semibold">Posted Date</th>
                  <th className="py-3 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job: any) => (
                    <tr key={job._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{job.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{job.category}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{job.company}</td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className="capitalize text-xs">
                          {job.jobType || 'Standard'}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {format(new Date(job.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <Button variant="outline" size="sm" className="h-8 px-2 border-gray-300" onClick={() => alert('Edit Modal would open here')}>
                          <Edit className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
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
      </div>
    </div>
  );
}
