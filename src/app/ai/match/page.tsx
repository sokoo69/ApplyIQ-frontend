"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { aiApi, MatchScorePayload } from '@/lib/api/ai';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loader2, Zap, AlertCircle, ArrowLeft, CheckCircle2, XCircle, Settings2, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface MatchData {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendation: string;
  agentTrace?: any[];
}

function MatchScoreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [priority, setPriority] = useState<MatchScorePayload['priority']>('balanced');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showTrace, setShowTrace] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  
  const [feedbackState, setFeedbackState] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownRemaining > 0) {
      timer = setInterval(() => {
        setCooldownRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const hasResume = !!user?.resumeText && user.resumeText.trim().length > 10;

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role === 'admin') {
        router.push('/admin/jobs');
      }
    }
  }, [isAuthLoading, isAuthenticated, user, router]);

  const fetchMatchScore = async (forcePriority?: MatchScorePayload['priority']) => {
    if (!jobId) {
      setErrorMsg('No Job ID provided. Please go back and select a job.');
      return;
    }

    if (!hasResume) return; // Need resume to fetch

    setIsGenerating(true);
    setErrorMsg('');
    setMatchData(null);
    setFeedbackState('idle');

    try {
      const result = await aiApi.getMatchScore({ 
        jobId, 
        priority: forcePriority || priority 
      });
      setMatchData(result);
    } catch (err: any) {
      if (err.message === 'AI_RATE_LIMIT') {
        setErrorMsg('AI service is temporarily busy due to free-tier limits. Please wait a minute and try again.');
        setCooldownRemaining(60);
      } else if (err.isRateLimit) {
        const resetTime = new Date(err.resetAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setErrorMsg(`You have reached your daily limit of ${err.limit} match scores. Your limit resets at ${resetTime} (UTC).`);
      } else {
        setErrorMsg(err.message || 'Failed to generate match score. The AI might be temporarily unavailable.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (isAuthenticated && hasResume && jobId && !matchData && !isGenerating && !errorMsg) {
      fetchMatchScore();
    }
  }, [isAuthenticated, hasResume, jobId]);

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriority = e.target.value as MatchScorePayload['priority'];
    setPriority(newPriority);
    fetchMatchScore(newPriority);
  };

  const handleFeedback = async (signal: 'applied' | 'rejected' | 'not_interested' | 'saved') => {
    if (!jobId || !matchData) return;
    
    setFeedbackState('loading');
    try {
      await aiApi.recordMatchFeedback({
        jobId,
        signal,
        matchScoreAtTime: matchData.matchPercentage
      });
      setFeedbackState('success');
      setTimeout(() => setFeedbackState('idle'), 3000);
    } catch (err) {
      console.error('Failed to record feedback', err);
      setFeedbackState('idle');
      alert('Failed to record feedback. Please try again.');
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

  return (
    <div className="min-h-screen bg-[var(--color-neutral-bg)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        
        <Link href={`/jobs/${jobId || ''}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Job Details
        </Link>

        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-[family-name:var(--font-heading)] flex items-center gap-3">
              <Zap className="h-8 w-8 text-[var(--color-primary)]" />
              AI Match Score
            </h1>
            <p className="mt-2 text-gray-600">
              See how well your resume matches this role, powered by AI reasoning.
            </p>
          </div>
          
          {jobId && (
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm">
              <Settings2 className="h-4 w-4 text-gray-400" />
              <select
                value={priority}
                onChange={handlePriorityChange}
                disabled={isGenerating || !hasResume}
                className="text-sm font-medium text-gray-700 bg-transparent focus:outline-none border-none outline-none"
              >
                <option value="balanced">Balanced Priority</option>
                <option value="prioritize_salary">Prioritize Seniority/Compensation</option>
                <option value="prioritize_skills">Strict Technical Skills Overlap</option>
              </select>
            </div>
          )}
        </div>

        {!hasResume && jobId && (
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 flex items-start gap-4 mb-8">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-900 mb-1">Resume Missing</h4>
              <p className="text-xs text-amber-700">You need to add a resume to your profile before you can calculate match scores.</p>
            </div>
            <Link href="/profile">
              <Button size="sm" variant="secondary">Add Resume</Button>
            </Link>
          </div>
        )}

        {!jobId && (
          <div className="mt-8 text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
            <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Job Selected</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Please go to your Jobs or Applications page and click "View Match Score" for a specific role to see your detailed AI analysis.
            </p>
            <Link href="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        )}

        {errorMsg && (
          <div className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Error Generating Score</h3>
              <p className="text-red-700 text-sm mt-1">{errorMsg}</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-3 bg-white" 
                onClick={() => fetchMatchScore()}
                disabled={cooldownRemaining > 0}
              >
                {cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s to Try Again` : 'Try Again'}
              </Button>
            </div>
          </div>
        )}

        {isGenerating && (
          <Card className="min-h-[400px] flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-[var(--color-primary)] mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Calculating Your Score</h3>
            <p className="text-gray-500 text-center max-w-md">
              Our AI is comparing your resume against the job requirements and your past feedback patterns...
            </p>
          </Card>
        )}

        {matchData && !isGenerating && (
          <div className="space-y-6">
            <Card className="border-[var(--color-primary)] border-t-4">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  
                  {/* Gauge Chart */}
                  <div className="w-48 h-48 relative flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart 
                        cx="50%" 
                        cy="50%" 
                        innerRadius="70%" 
                        outerRadius="100%" 
                        barSize={16} 
                        data={[{ name: 'Score', value: matchData.matchPercentage, fill: 'var(--color-primary)' }]}
                        startAngle={90} 
                        endAngle={-270}
                      >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar
                          background={{ fill: 'var(--color-neutral-bg)' }}
                          dataKey="value"
                          cornerRadius={8}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-extrabold text-gray-900 font-[family-name:var(--font-heading)]">
                        {matchData.matchPercentage}%
                      </span>
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Match</span>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">AI Recommendation</h3>
                    <p className="text-lg text-gray-700 leading-relaxed font-serif">
                      "{matchData.recommendation}"
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-100">
                <CardHeader className="border-b border-gray-50 bg-green-50/50 pb-4">
                  <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" /> Matching Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  {matchData.matchingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {matchData.matchingSkills.map((skill, idx) => (
                        <Badge key={idx} variant="default" className="bg-green-100 text-green-800 border-none hover:bg-green-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No strong matching skills found based on the resume provided.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-amber-100">
                <CardHeader className="border-b border-gray-50 bg-amber-50/50 pb-4">
                  <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-amber-500" /> Missing / Gap Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  {matchData.missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {matchData.missingSkills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">You appear to have all the major required skills for this role!</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Agent Trace Section */}
            {matchData.agentTrace && matchData.agentTrace.length > 0 && (
              <Card className="border-gray-200">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setShowTrace(!showTrace)}
                >
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-gray-500" />
                    <h3 className="font-semibold text-gray-900">See how this was calculated</h3>
                  </div>
                  {showTrace ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                </div>
                {showTrace && (
                  <CardContent className="pt-0 pb-4 px-4">
                    <div className="border-t border-gray-100 pt-4 space-y-4">
                      {matchData.agentTrace.map((step, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-md p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[var(--color-primary)] text-white text-xs font-bold px-2 py-0.5 rounded">
                              Step {idx + 1}
                            </span>
                            <h4 className="font-semibold text-gray-900">{step.stepName}</h4>
                          </div>
                          <div className="text-sm text-gray-600 space-y-2">
                            {step.stepName === 'Extract Skills' && (
                              <p>Extracted <strong>{step.output.skills?.length || 0} skills</strong> and determined an experience level of <strong>{step.output.experienceLevel}</strong> ({step.output.yearsOfExperience} years) from your resume.</p>
                            )}
                            {step.stepName === 'Extract Requirements' && (
                              <p>Identified <strong>{step.output.requiredSkills?.length || 0} required skills</strong>, <strong>{step.output.niceToHaveSkills?.length || 0} nice-to-have skills</strong>, and a required experience level of <strong>{step.output.requiredExperienceLevel}</strong> from the job description.</p>
                            )}
                            {step.stepName === 'Compare and Score' && (
                              <p>Compared your profile against the job requirements, factoring in priority settings and your past feedback history, to produce the final <strong>{step.output.matchPercentage}%</strong> match score.</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Feedback Section */}
            <Card className="bg-gray-50 overflow-hidden">
              <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-[var(--color-primary)]" />
                    Help Improve Your Recommendations
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Your feedback trains our AI to better understand your preferences for future matches.
                  </p>
                </div>
                
                {feedbackState === 'success' ? (
                  <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Feedback Recorded!
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => handleFeedback('saved')}
                      disabled={feedbackState === 'loading'}
                      className="bg-white border-gray-300"
                    >
                      Save for Later
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleFeedback('not_interested')}
                      disabled={feedbackState === 'loading'}
                      className="bg-white border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Not Interested
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={() => handleFeedback('applied')}
                      disabled={feedbackState === 'loading'}
                    >
                      I Applied!
                    </Button>
                  </div>
                )}
              </div>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
}

export default function MatchScorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-neutral-bg)] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" /></div>}>
      <MatchScoreContent />
    </Suspense>
  );
}
