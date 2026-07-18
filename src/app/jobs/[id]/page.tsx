"use client";

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar, 
  Briefcase, 
  Bookmark, 
  Send,
  Target,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useJob } from '@/hooks/useJob';
import { useJobs } from '@/hooks/useJobs';
import { useMyApplications } from '@/hooks/useMyApplications';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import JobCard from '@/components/jobs/JobCard';
import { applicationsApi } from '@/lib/api/applications';
import { useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  const { job, isLoading, isError } = useJob(id);
  const { user, isAuthenticated } = useAuth();
  const { applications } = useMyApplications();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const formatSalary = (min?: number, max?: number) => {
    if (min === undefined || max === undefined) return 'Salary not specified';
    const kMin = Math.round(min / 1000);
    const kMax = Math.round(max / 1000);
    return `৳${kMin}k - ${kMax}k/mo`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-neutral-bg)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl space-y-6">
          <Skeleton className="h-10 w-32 mb-6" /> {/* Back button */}
          
          {/* Header Skeleton */}
          <Card className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-6">
                <Skeleton className="h-20 w-20 rounded-md" />
                <div className="space-y-3">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-5 w-48" />
                  <div className="flex gap-4 mt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <Skeleton className="h-10 w-full md:w-32" />
                <Skeleton className="h-10 w-full md:w-32" />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="p-6 md:p-8 space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            </div>
            <div className="md:col-span-1 space-y-6">
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || (!isLoading && !job)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-neutral-bg)] px-4">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md border border-gray-200">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-500 mb-6">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/jobs')} className="w-full">
            Back to Explore Jobs
          </Button>
        </div>
      </div>
    );
  }

  if (!job) return null;
  let timeAgo = '';
  if (job.createdAt) {
    const d = new Date(job.createdAt);
    if (!isNaN(d.getTime())) {
      timeAgo = formatDistanceToNow(d, { addSuffix: true });
    }
  }
  const deadlineFormatted = job.deadline ? format(new Date(job.deadline), 'MMM dd, yyyy') : 'No deadline';

  const getActionLink = (type: 'match' | 'manage') => {
    if (!isAuthenticated) return '/login';
    if (type === 'manage') return `/my-applications`;
    if (type === 'match') return `/ai/match?jobId=${job._id || job.id}`;
    return '#';
  };

  const handleQuickAction = async (action: 'save' | 'apply') => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (action === 'apply' && job.applyUrl) {
      window.open(job.applyUrl, '_blank');
      // Still proceed to track it internally
    }

    setIsActionLoading(true);
    try {
      const app = await applicationsApi.createApplication({ job: job._id || job.id });
      if (action === 'apply') {
        await applicationsApi.updateApplicationStatus(app._id, 'Applied');
      }
      window.location.reload(); 
    } catch (e: any) {
      alert(e.message || 'Failed to save job');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-neutral-bg)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        
        <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>

        {user?.role === 'admin' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md flex justify-between items-center">
            <div>
              <p className="text-sm text-yellow-700 font-medium">Admin View</p>
              <p className="text-xs text-yellow-600">You are viewing this job as an administrator.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/jobs')}>
                Edit Job
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => router.push('/admin/jobs')}>
                Delete Job
              </Button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <Card className="p-6 md:p-8 mb-8 border-t-4 border-t-[var(--color-primary)]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="h-20 w-20 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm flex items-center justify-center">
                {job.companyLogoUrl ? (
                  <Image 
                    src={job.companyLogoUrl} 
                    alt={`${job.company} logo`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-gray-400 font-bold text-3xl">
                    {job.company?.charAt(0) || 'C'}
                  </span>
                )}
              </div>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight font-[family-name:var(--font-heading)] mb-1">
                  {job.title}
                </h1>
                <p className="text-lg text-gray-600 mb-4 font-medium">{job.company}</p>
                
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatSalary(job.salaryRange?.min, job.salaryRange?.max)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>Posted {timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-red-500" />
                    <span className="text-red-600 font-medium">Deadline: {deadlineFormatted}</span>
                  </div>
                </div>
              </div>
            </div>

            {user?.role !== 'admin' && (
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                {(() => {
                  const existingApp = applications?.find(
                    (app: any) => app.job?._id === (job._id || job.id) || app.job === (job._id || job.id)
                  );
                  
                  if (existingApp) {
                    const statusText = existingApp.status === 'Applied' ? 'Applied ✓' 
                                     : existingApp.status === 'Saved' ? 'Saved ✓'
                                     : `${existingApp.status} ✓`;
                    return (
                      <Link href={getActionLink('manage')} className="w-full">
                        <Button variant="outline" className="w-full gap-2 text-green-600 border-green-200 bg-green-50 hover:bg-green-100 whitespace-nowrap">
                          {statusText}
                        </Button>
                      </Link>
                    );
                  }
                  
                  return (
                    <>
                      <Button 
                        variant="primary" 
                        className="w-full gap-2 whitespace-nowrap" 
                        onClick={() => handleQuickAction('apply')}
                        disabled={isActionLoading}
                      >
                        <Send className="h-4 w-4 shrink-0" /> Apply Now
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full gap-2 whitespace-nowrap"
                        onClick={() => handleQuickAction('save')}
                        disabled={isActionLoading}
                      >
                        <Bookmark className="h-4 w-4 shrink-0" /> Save Job
                      </Button>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {user?.role !== 'admin' && (
            <div className="mt-8 pt-6 border-t border-gray-100 bg-blue-50/50 -mx-6 md:-mx-8 px-6 md:px-8 pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Want to know if you're a fit?</h4>
                    <p className="text-xs text-gray-600">Our AI will compare your resume to this job description.</p>
                  </div>
                </div>
                <Link href={getActionLink('match')} className="w-full sm:w-auto">
                  <Button variant="primary" className="w-full">
                    Check My Match Score
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Card>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 font-[family-name:var(--font-heading)]">Overview</h2>
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-4">
                <p>{job.description}</p>
                {/* Normally we'd render HTML here if it was rich text from backend */}
                <p>
                  At {job.company}, we are committed to providing an exceptional work environment. We value diversity, creativity, and the relentless pursuit of excellence. Join us and help shape the future of our industry.
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-[family-name:var(--font-heading)]">Requirements</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  {job.requirements?.map((req: string, idx: number) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-[family-name:var(--font-heading)]">Key Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Job Type</p>
                  <Badge variant="default" className="capitalize">
                    {job.jobType ? job.jobType.replace('-', ' ') : 'Standard'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Category</p>
                  <Badge variant="outline">
                    {job.category}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Required Skills</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.requirements?.map((req: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

        </div>
        
        {/* Related Jobs Section */}
        <RelatedJobs category={job.category} currentJobId={job._id || job.id} />
      </div>
    </div>
  </div>
  );
}

function RelatedJobs({ category, currentJobId }: { category: string, currentJobId: string }) {
  const { jobs, isLoading } = useJobs({ category, limit: 5 });
  
  if (isLoading) return null;
  
  // Filter out the current job and limit to 4
  const relatedJobs = jobs
    .filter((j: any) => (j._id || j.id) !== currentJobId)
    .slice(0, 4);
    
  if (relatedJobs.length === 0) return null;
  
  return (
    <div className="mt-16 border-t border-gray-200 pt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 font-[family-name:var(--font-heading)]">Related Jobs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedJobs.map((job: any) => (
          <JobCard key={job._id || job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
