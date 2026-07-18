"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useMyApplications } from '@/hooks/useMyApplications';
import { Application } from '@/types/application';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Loader2, Plus, Briefcase, Calendar, MapPin, Trash2, Edit2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function ManageItemsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { applications, isLoading, updateStatus, deleteApplication } = useMyApplications();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteApplication(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete application:', error);
      alert('Failed to delete application. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status.');
    }
  };

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-neutral-bg)] flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Checking authorization...</span>
        </div>
      </div>
    );
  }

  const filteredApps = filterStatus === 'All' 
    ? applications 
    : applications.filter(a => a.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Saved': return 'default';
      case 'Applied': return 'primary';
      case 'Interview': return 'accent';
      case 'Offer': return 'secondary';
      case 'Rejected': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-neutral-bg)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-[family-name:var(--font-heading)]">
              My Pipeline
            </h1>
            <p className="mt-2 text-gray-600">Track and manage all your job applications in one place.</p>
          </div>
          <Link href="/items/add">
            <Button variant="primary" className="gap-2">
              <Plus className="h-4 w-4" /> Add Application
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', 'Saved', 'Applied', 'Interview', 'Offer', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === status 
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              {filterStatus === 'All' 
                ? "You haven't tracked any applications yet. Add one manually or save a job from the Explore page."
                : `You don't have any applications in the "${filterStatus}" stage.`}
            </p>
            {filterStatus === 'All' ? (
              <Link href="/items/add">
                <Button variant="outline">Track First Application</Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={() => setFilterStatus('All')}>View All</Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredApps.map((app) => {
              // Handle mapped custom fields vs populated job fields
              const title = app.title || (app.job as any)?.title || 'Unknown Title';
              const company = (app.job as any)?.company || 'Custom Tracking';
              const location = (app.job as any)?.location || 'Not specified';
              const logoUrl = app.imageUrl || (app.job as any)?.companyLogoUrl || `https://ui-avatars.com/api/?name=${company}&background=random&color=fff`;
              const isPublicJob = !!app.job;

              return (
                <Card key={app._id} className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex flex-col h-full">
                    
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                          <Image src={logoUrl} alt={company} fill className="object-cover" unoptimized />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 line-clamp-1" title={title}>{title}</h3>
                          <p className="text-sm text-gray-500">{company}</p>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(app.status)} className="capitalize">
                        {app.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-xs text-gray-500 gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{location}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Added on {format(new Date(app.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Update Status:</span>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="text-sm border border-gray-300 rounded-md py-1 pl-2 pr-6 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                        >
                          <option value="Saved">Saved</option>
                          <option value="Applied">Applied</option>
                          <option value="Interview">Interview</option>
                          <option value="Offer">Offer</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        {isPublicJob ? (
                          <Link href={`/jobs/${(app.job as any)?._id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full text-xs gap-1 h-9">
                              <ExternalLink className="h-3 w-3" /> View Job
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="outline" size="sm" className="flex-1 text-xs gap-1 h-9" disabled>
                            <Edit2 className="h-3 w-3" /> Custom Job
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="px-3 h-9 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => setDeleteId(app._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Application"
        description="Are you sure you want to delete this tracked application? This action cannot be undone and you will lose your status history and generated cover letters associated with it."
        confirmText="Delete"
        isConfirming={isDeleting}
      />
    </div>
  );
}
