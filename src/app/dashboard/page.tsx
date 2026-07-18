"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { dashboardApi } from '@/lib/api/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Briefcase, 
  PlusCircle, 
  Target, 
  FileText, 
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      dashboardApi.getSummary()
        .then(res => {
          setData(res);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [isAuthenticated]);

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-neutral-bg)] p-8">
        <div className="container mx-auto max-w-6xl space-y-6">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Pre-process recharts data
  const statusPieData = data ? [
    { name: 'Saved', value: data.statusCounts.Saved || 0, color: '#94a3b8' }, // slate-400
    { name: 'Applied', value: data.statusCounts.Applied || 0, color: 'var(--color-primary)' }, // indigo
    { name: 'Interview', value: data.statusCounts.Interview || 0, color: 'var(--color-secondary)' }, // amber
    { name: 'Offer', value: data.statusCounts.Offer || 0, color: 'var(--color-accent)' }, // emerald
    { name: 'Rejected', value: data.statusCounts.Rejected || 0, color: '#f87171' }, // red-400
  ].filter(d => d.value > 0) : [];

  // If entirely empty, show a blank gray donut
  if (statusPieData.length === 0) {
    statusPieData.push({ name: 'No Data', value: 1, color: '#e2e8f0' });
  }

  // Map weeks for bar chart
  const weekMap = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
  const barData = data?.weeklyTracking.map((w: any, idx: number) => ({
    name: `Week ${w._id}`,
    count: w.count
  })) || [];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Offer': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'Rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Interview': return <MessageSquare className="h-4 w-4 text-amber-500" />;
      case 'Applied': return <Briefcase className="h-4 w-4 text-indigo-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-neutral-bg)] py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-[family-name:var(--font-heading)]">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="mt-2 text-gray-600">Here is a snapshot of your job search progress.</p>
        </header>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          </div>
        ) : (
          <>
            {/* Quick Actions Row */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link href="/jobs">
                <Button variant="primary" className="gap-2 rounded-full">
                  <Briefcase className="h-4 w-4" /> Explore Jobs
                </Button>
              </Link>
              <Link href="/items/add">
                <Button variant="outline" className="gap-2 bg-white rounded-full">
                  <PlusCircle className="h-4 w-4" /> Track Manual Job
                </Button>
              </Link>
              <Link href="/ai/match">
                <Button variant="secondary" className="gap-2 rounded-full">
                  <Target className="h-4 w-4" /> Check Match
                </Button>
              </Link>
              <Link href="/ai/cover-letter">
                <Button variant="secondary" className="gap-2 rounded-full">
                  <FileText className="h-4 w-4" /> Write Cover Letter
                </Button>
              </Link>
              <Link href="/ai/interview-coach">
                <Button variant="secondary" className="gap-2 rounded-full">
                  <MessageSquare className="h-4 w-4" /> Mock Interview
                </Button>
              </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="border-l-4 border-l-indigo-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Tracked</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-1">{data?.totalApplications}</h3>
                    </div>
                    <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Interviews</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-1">{data?.statusCounts?.Interview || 0}</h3>
                    </div>
                    <div className="h-10 w-10 bg-amber-50 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Upcoming Deadlines</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-1">{data?.upcomingDeadlinesCount || 0}</h3>
                    </div>
                    <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Status</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusPieData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="flex justify-center gap-4 mt-2">
                    {statusPieData.map((entry: any, idx: number) => {
                      if (entry.name === 'No Data') return null;
                      return (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                          {entry.name}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Velocity (Last 8 Weeks)</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.recentActivity?.length > 0 ? (
                  <div className="space-y-0">
                    {data.recentActivity.map((activity: any, idx: number) => (
                      <div key={idx} className={`py-4 flex items-start gap-4 ${idx !== data.recentActivity.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <div className="mt-1 flex-shrink-0">
                          {getStatusIcon(activity.status)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Status changed to <span className="font-semibold">{activity.status}</span>
                          </p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                    No recent activity found. 
                  </div>
                )}
              </CardContent>
            </Card>

          </>
        )}
      </div>
    </div>
  );
}
