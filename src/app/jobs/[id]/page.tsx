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

import { useJob } from '@/hooks/useJob';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import JobCard from '@/components/jobs/JobCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  const { data, isLoading, isError } = useJob(id);

  const formatSalary = (min: number, max: number) => {
    const kMin = Math.round(min / 1000);
    const kMax = Math.round(max / 1000);
    return `৳${kMin}k - ${kMax}k`;
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

  if (isError || (data && !data.job)) {
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

  if (!data || !data.job) return null;

  const { job } = data;
  const timeAgo = job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : '';
  const deadlineFormatted = job.deadline ? format(new Date(job.deadline), 'MMM dd, yyyy') : 'No deadline';

  return (
    <div className="min-h-screen bg-[var(--color-neutral-bg)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        
        <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>

        {/* Header Section */}
        <Card className="p-6 md:p-8 mb-8 border-t-4 border-t-[var(--color-primary)]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="h-20 w-20 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
                <Image 
                  src={job.companyLogoUrl} 
                  alt={`${job.company} logo`}
                  fill
                  className="object-cover"
                  unoptimized
                />
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
                    <span>{formatSalary(job.salaryRange.min, job.salaryRange.max)}/mo</span>
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

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Button variant="primary" className="w-full gap-2">
                <Send className="h-4 w-4" /> Apply Now
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Bookmark className="h-4 w-4" /> Save Job
              </Button>
            </div>
          </div>

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
              <Link href={`/ai/match?jobId=${job._id || job.id}`} className="w-full sm:w-auto">
                <Button variant="primary" className="w-full">
                  Check My Match Score
                </Button>
              </Link>
            </div>
          </div>
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
                  {job.requirements.map((req, idx) => (
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
                    {job.requirements.map((req, idx) => (
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
