"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { applicationsApi } from '@/lib/api/applications';
import { CreateApplicationPayload } from '@/types/application';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Calendar, AlertCircle } from 'lucide-react';

export default function AddItemPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState<CreateApplicationPayload>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    priority: 'Medium',
    deadline: '',
    imageUrl: '',
  });

  // Client-side route protection
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Handle URL validation
  const isValidUrl = (urlString: string) => {
    if (!urlString) return true; // Optional field
    try { 
      return Boolean(new URL(urlString)); 
    }
    catch(e){ 
      return false; 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    // Basic Validation
    if (!formData.title || !formData.shortDescription || !formData.fullDescription || !formData.deadline) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      setFormError('Please enter a valid URL for the image.');
      return;
    }

    setIsSubmitting(true);

    try {
      await applicationsApi.createApplication(formData);
      setSuccessMsg('Item added successfully! Redirecting...');
      
      // Redirect to manage page after brief delay to show success message
      setTimeout(() => {
        router.push('/items/manage');
      }, 1500);

    } catch (err: any) {
      setFormError(err.message || 'Failed to create item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show nothing or redirecting state while checking auth
  if (isLoading || !isAuthenticated) {
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
      <div className="container mx-auto max-w-3xl">
        
        <Link href="/items/manage" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pipeline
        </Link>

        <Card>
          <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-heading)]">
              Track New Job Application
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Manually add a job to your pipeline to track its progress.
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Messages */}
              {formError && (
                <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm border border-green-200 font-medium">
                  {successMsg}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="shortDescription">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <input
                  id="shortDescription"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  placeholder="Brief summary of the role or company"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullDescription">
                  Full Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="fullDescription"
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-y"
                  placeholder="Paste the full job description here. Our AI will use this later to generate a match score and cover letter."
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                />
              </div>

              {/* Priority and Deadline Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="priority">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="priority"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="deadline">
                    Application Deadline <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="deadline"
                      type="date"
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Optional Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="imageUrl">
                  Company Logo URL (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="imageUrl"
                    type="url"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Provide a direct link to an image file.</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/items/manage')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  className="gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Application
                    </>
                  )}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
