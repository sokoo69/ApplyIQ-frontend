"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, DollarSign, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { applicationsApi } from '@/lib/api/applications';
import { useMyApplications } from '@/hooks/useMyApplications';

interface JobCardProps {
  job: any;
  userRole?: string | null;
}

export default function JobCard({ job, userRole }: JobCardProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isSavedLocal, setIsSavedLocal] = useState(false);
  
  const { applications } = useMyApplications({ enabled: userRole === 'job_seeker' });

  // Check if job is already saved in the user's applications
  const isAlreadySaved = applications?.some(
    (app: any) => app.job?._id === (job._id || job.id) || app.job === (job._id || job.id)
  );
  
  const isSaved = isSavedLocal || isAlreadySaved;

  // Truncate description
  const truncatedDesc = job.description?.length > 120 
    ? job.description.substring(0, 120) + '...'
    : job.description;

  let timeAgo = 'Recently';
  if (job.createdAt) {
    const d = new Date(job.createdAt);
    if (!isNaN(d.getTime())) {
      timeAgo = formatDistanceToNow(d, { addSuffix: true });
    }
  }

  const formatSalary = (min?: number, max?: number) => {
    if (min === undefined || max === undefined) return 'Salary not specified';
    const kMin = Math.round(min / 1000);
    const kMax = Math.round(max / 1000);
    return `৳${kMin}k - ${kMax}k/mo`;
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'remote': return 'accent';
      case 'full-time': return 'default';
      case 'part-time': return 'outline';
      case 'contract': return 'secondary';
      default: return 'outline';
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userRole) {
      router.push('/login');
      return;
    }
    
    setIsSaving(true);
    try {
      await applicationsApi.createApplication({ job: job._id || job.id });
      setIsSavedLocal(true);
    } catch (err: any) {
      if (err.message?.includes("already tracking")) {
         setIsSavedLocal(true);
      } else {
         alert(err.message || 'Failed to save job');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
              {job.companyLogoUrl ? (
                <Image 
                  src={job.companyLogoUrl} 
                  alt={`${job.company} logo`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-gray-400 font-bold text-lg">
                  {job.company?.charAt(0) || 'C'}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 leading-tight line-clamp-1 font-[family-name:var(--font-heading)]" title={job.title}>
                {job.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-1">{job.company}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant={getJobTypeColor(job.jobType || '')} className="capitalize text-[10px] px-2 py-0">
            {job.jobType ? job.jobType.replace('-', ' ') : 'Standard'}
          </Badge>
          <Badge variant="outline" className="text-[10px] px-2 py-0">
            {job.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs text-gray-500 gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500 gap-1.5">
            <DollarSign className="h-3.5 w-3.5" />
            <span>{formatSalary(job.salaryRange?.min, job.salaryRange?.max)}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500 gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Posted {timeAgo}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-3">
          {truncatedDesc}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 mt-auto flex gap-2">
        <Link href={`/jobs/${job._id || job.id}`} className="w-full">
          <Button variant="outline" className="w-full text-sm">
            View Details
          </Button>
        </Link>
        {userRole === 'job_seeker' && (
          <Button 
            variant={isSaved ? "outline" : "primary"} 
            className={`w-full text-sm ${isSaved ? "text-green-600 border-green-200 bg-green-50" : ""}`}
            onClick={handleSave}
            disabled={isSaving || isSaved}
          >
            {isSaving ? "Saving..." : isSaved ? "Saved ✓" : "Save Job"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
