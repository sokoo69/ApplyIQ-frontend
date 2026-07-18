import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, DollarSign, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: any;
}

export default function JobCard({ job }: JobCardProps) {
  // Truncate description
  const truncatedDesc = job.description.length > 120 
    ? job.description.substring(0, 120) + '...'
    : job.description;

  const timeAgo = formatDistanceToNow(new Date(job.createdAt), { addSuffix: true });

  const formatSalary = (min: number, max: number) => {
    const kMin = Math.round(min / 1000);
    const kMax = Math.round(max / 1000);
    return `৳${kMin}k - ${kMax}k`;
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

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
              <Image 
                src={job.companyLogoUrl} 
                alt={`${job.company} logo`}
                fill
                className="object-cover"
                unoptimized
              />
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
            <span>{formatSalary(job.salaryRange.min, job.salaryRange.max)}/mo</span>
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
      
      <CardFooter className="pt-0 mt-auto">
        <Link href={`/jobs/${job._id || job.id}`} className="w-full">
          <Button variant="outline" className="w-full text-sm">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
