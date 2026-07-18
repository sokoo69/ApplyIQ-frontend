"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '@/lib/api/users';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2, Save, User as UserIcon, FileText, CheckCircle2, Upload } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    resumeText: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (user) {
      setFormData({
        name: user.name || '',
        resumeText: user.resumeText || '',
      });
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await usersApi.updateProfile({
        name: formData.name,
        resumeText: formData.resumeText,
      });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }

    setIsExtracting(true);

    try {
      const data = await usersApi.uploadResumePdf(file);
      setFormData(prev => ({ ...prev, resumeText: data.text }));
      toast.success('Resume text extracted successfully. Please review before saving.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to extract text from PDF');
    } finally {
      setIsExtracting(false);
      e.target.value = '';
    }
  };

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
        
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-[family-name:var(--font-heading)] mb-8">
          My Profile
        </h1>

        <Card>
          <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-6">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-gray-500" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-50 text-gray-500"
                  value={user?.email || ''}
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed.</p>
              </div>

              {user?.role !== 'admin' && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <h3 className="text-lg font-medium text-gray-900">Resume Content</h3>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        disabled={isExtracting}
                        title="Upload Resume PDF"
                      />
                      <Button type="button" variant="outline" size="sm" className="gap-2 pointer-events-none">
                        {isExtracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {isExtracting ? 'Extracting...' : 'Upload PDF'}
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    Paste the text of your resume here or upload a PDF to auto-fill. This will be used by ApplyIQ's AI to generate tailored cover letters and match scores for jobs.
                  </p>
                  <textarea
                    id="resumeText"
                    rows={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-y font-mono text-sm"
                    placeholder="Experience&#10;Software Engineer at Tech Corp&#10;- Built web applications using React..."
                    value={formData.resumeText}
                    onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                  />
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button 
                  type="submit" 
                  variant="primary"
                  className="gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Profile
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
