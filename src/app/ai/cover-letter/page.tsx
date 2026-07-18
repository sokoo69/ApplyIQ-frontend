"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useMyApplications } from '@/hooks/useMyApplications';
import { aiApi, GenerateCoverLetterPayload } from '@/lib/api/ai';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2, FileText, Sparkles, AlertCircle, CheckCircle2, Copy } from 'lucide-react';

export default function CoverLetterGeneratorPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { applications, isLoading: isAppsLoading } = useMyApplications();

  const [formData, setFormData] = useState<GenerateCoverLetterPayload>({
    applicationId: '',
    tone: 'Professional',
    length: 'Medium',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicationId) {
      setErrorMsg('Please select a job application first.');
      return;
    }

    setErrorMsg('');
    setGeneratedLetter('');
    setIsGenerating(true);

    try {
      const response = await aiApi.generateCoverLetter(formData);
      setGeneratedLetter(response.outputText);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const hasResume = !!user?.resumeText && user.resumeText.trim().length > 10;

  return (
    <div className="min-h-screen bg-[var(--color-neutral-bg)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-[family-name:var(--font-heading)] flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-[var(--color-primary)]" />
            AI Cover Letter Generator
          </h1>
          <p className="mt-2 text-gray-600">
            Generate highly personalized cover letters tailored to specific job applications using your resume.
          </p>
        </div>

        {!hasResume && (
          <div className="mb-8 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Resume Required</h3>
              <p className="text-amber-700 text-sm mt-1">
                You need to add your resume to your profile before you can generate cover letters.
              </p>
              <Link href="/profile" className="inline-block mt-3">
                <Button size="sm" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">
                  Add Resume to Profile
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Settings Panel */}
          <div className="lg:col-span-4">
            <Card className="sticky top-24 shadow-sm border-gray-200">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Settings</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleGenerate} className="space-y-6">
                  
                  {errorMsg && (
                    <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="applicationId">
                      Target Job <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="applicationId"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white disabled:bg-gray-50"
                      value={formData.applicationId}
                      onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                      disabled={!hasResume || isAppsLoading}
                    >
                      <option value="" disabled>Select a tracked application...</option>
                      {applications.map(app => {
                        const title = app.title || (app.job as any)?.title || 'Unknown Role';
                        const company = (app.job as any)?.company || 'Custom';
                        return (
                          <option key={app._id} value={app._id}>
                            {title} at {company}
                          </option>
                        );
                      })}
                    </select>
                    {applications.length === 0 && !isAppsLoading && (
                      <p className="mt-1 text-xs text-red-500">You must track at least one job first.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tone">
                      Tone
                    </label>
                    <select
                      id="tone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white"
                      value={formData.tone}
                      onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
                      disabled={!hasResume}
                    >
                      <option value="Professional">Professional & Formal</option>
                      <option value="Confident">Confident & Assertive</option>
                      <option value="Friendly">Friendly & Enthusiastic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="length">
                      Length
                    </label>
                    <select
                      id="length"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white"
                      value={formData.length}
                      onChange={(e) => setFormData({ ...formData, length: e.target.value as any })}
                      disabled={!hasResume}
                    >
                      <option value="Short">Short (Concise)</option>
                      <option value="Medium">Medium (Standard)</option>
                      <option value="Long">Long (Detailed)</option>
                    </select>
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary"
                    className="w-full gap-2 mt-4"
                    disabled={isGenerating || !hasResume || !formData.applicationId}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> {generatedLetter ? 'Regenerate' : 'Generate'}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-8 flex flex-col">
            <Card className="flex-1 shadow-sm border-gray-200 min-h-[500px] flex flex-col">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" /> Output
                </CardTitle>
                {generatedLetter && (
                  <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 h-8">
                    {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </Button>
                )}
              </CardHeader>
              
              <CardContent className="flex-1 p-0 relative">
                {isGenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
                    <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary)] mb-4" />
                    <p className="text-gray-600 font-medium animate-pulse">Analyzing your resume and the job description...</p>
                    <p className="text-sm text-gray-500 mt-2">Writing the perfect cover letter. This may take a few seconds.</p>
                  </div>
                ) : null}

                {generatedLetter ? (
                  <div className="p-6 h-full overflow-y-auto">
                    <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap font-serif">
                      {generatedLetter}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 max-w-sm">
                      Select a job application and click generate to create your AI-powered cover letter.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
