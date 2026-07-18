"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useMyApplications } from '@/hooks/useMyApplications';
import { aiApi } from '@/lib/api/ai';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2, Send, Bot, User as UserIcon, Sparkles, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function InterviewCoachContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlJobId = searchParams.get('jobId');

  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { applications, isLoading: isAppsLoading } = useMyApplications();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  
  const [isInitializing, setIsInitializing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [followUpPrompts, setFollowUpPrompts] = useState<string[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const hasResume = !!user?.resumeText && user.resumeText.trim().length > 10;

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // If a jobId is in the URL, try to map it to an application for the selector, or just use it directly
  useEffect(() => {
    if (urlJobId && applications.length > 0 && !selectedAppId) {
      const app = applications.find(a => (a.job as any)?._id === urlJobId || a._id === urlJobId);
      if (app) setSelectedAppId(app._id);
    }
  }, [urlJobId, applications]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming]);

  const startSession = async () => {
    const idToUse = selectedAppId || urlJobId;
    if (!idToUse) {
      setErrorMsg('Please select a job first.');
      return;
    }

    if (!hasResume) {
      setErrorMsg('You need to add a resume to your profile first.');
      return;
    }

    setIsInitializing(true);
    setErrorMsg('');
    setMessages([]);
    setFollowUpPrompts([]);

    try {
      // Determine if id is an application ID or a raw job ID
      // For safety, we just pass applicationId if it matches our list, otherwise jobId
      const isApp = applications.some(a => a._id === idToUse);
      const payload = isApp ? { applicationId: idToUse } : { jobId: idToUse };
      
      const { sessionId: newSessionId } = await aiApi.createChatSession(payload);
      setSessionId(newSessionId);
      
      // Load initial messages (which will trigger the coach to start)
      const session = await aiApi.getChatSession(newSessionId);
      // Filter out system prompt (the first message)
      const visibleMessages = session.messages.slice(1);
      setMessages(visibleMessages);

      // We need the AI to actually answer the first prompt
      // The first prompt was "Hello! I'm ready to start..."
      // Let's trigger a stream for the first response if it's not there
      if (visibleMessages.length === 1 && visibleMessages[0].role === 'user') {
         await streamMessage(newSessionId, "Hello! I'm ready to start the interview. Please greet me and ask the first question.");
      }

    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to start interview session.');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, predefinedContent?: string) => {
    if (e) e.preventDefault();
    
    const contentToSend = predefinedContent || inputMessage;
    if (!contentToSend.trim() || !sessionId || isStreaming) return;

    setInputMessage('');
    setFollowUpPrompts([]);
    
    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', content: contentToSend }]);

    await streamMessage(sessionId, contentToSend);
  };

  const streamMessage = async (sid: string, content: string) => {
    setIsStreaming(true);
    
    // Add empty assistant message that we will stream into
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/ai/chat/sessions/${sid}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      if (!response.body) throw new Error('ReadableStream not supported');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              
              if (data.error) {
                console.error(data.error);
                break;
              }
              
              if (data.text) {
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].content += data.text;
                  return newMsgs;
                });
              }

              if (data.done && data.followUpPrompts) {
                setFollowUpPrompts(data.followUpPrompts);
              }

            } catch (e) {
              console.error('Error parsing SSE chunk', e);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Streaming error:', err);
      // Could show a toast here
    } finally {
      setIsStreaming(false);
    }
  };

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-neutral-bg)] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-neutral-bg)] flex flex-col pt-8 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl flex-1 flex flex-col h-[calc(100vh-120px)]">
        
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-[family-name:var(--font-heading)] flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-[var(--color-primary)]" />
              Interview Coach
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Practice answering questions tailored exactly to your resume and the target role.
            </p>
          </div>
          
          {!sessionId && (
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                className="flex-1 md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                value={selectedAppId || urlJobId || ''}
                onChange={(e) => setSelectedAppId(e.target.value)}
                disabled={isAppsLoading || !hasResume}
              >
                <option value="" disabled>Select target job...</option>
                {applications.map(app => {
                  const title = app.title || (app.job as any)?.title || 'Unknown Role';
                  const company = (app.job as any)?.company || 'Custom';
                  return <option key={app._id} value={app._id}>{title} at {company}</option>;
                })}
              </select>
              <Button 
                onClick={startSession} 
                disabled={isInitializing || !hasResume || (!selectedAppId && !urlJobId)}
                className="flex-shrink-0"
              >
                {isInitializing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Start Interview'}
              </Button>
            </div>
          )}

          {sessionId && (
            <Button variant="outline" size="sm" onClick={() => { setSessionId(null); setMessages([]); }} className="gap-2 text-gray-600">
              <RefreshCw className="h-4 w-4" /> Restart
            </Button>
          )}
        </div>

        {!hasResume && (
          <div className="mb-4 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3 flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Resume Required</h3>
              <p className="text-amber-700 text-sm mt-1">Add your resume to your profile first.</p>
              <Link href="/profile" className="inline-block mt-3">
                <Button size="sm" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">Add Resume</Button>
              </Link>
            </div>
          </div>
        )}
        
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200 flex-shrink-0">
            {errorMsg}
          </div>
        )}

        {/* Chat Area */}
        <Card className="flex-1 shadow-sm border-gray-200 flex flex-col overflow-hidden bg-white">
          
          {!sessionId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
              <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <Bot className="h-10 w-10 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Practice?</h3>
              <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
                Our AI coach acts as the hiring manager. It will ask you realistic questions based on the job description and your exact experience, then give you immediate feedback on your answers.
              </p>
            </div>
          ) : (
            <>
              {/* Message List */}
              <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"
              >
                {messages.map((msg, idx) => {
                  // Skip the first user message if it's the "Hello I'm ready" prompt we auto-sent
                  if (idx === 0 && msg.role === 'user') return null;

                  const isUser = msg.role === 'user';
                  
                  return (
                    <div key={idx} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      
                      {!isUser && (
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mt-1">
                          <Bot className="h-4 w-4 text-[var(--color-primary)]" />
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm sm:text-base leading-relaxed font-serif shadow-sm
                        ${isUser 
                          ? 'bg-[var(--color-primary)] text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200/60'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>

                      {isUser && (
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                          <UserIcon className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mt-1">
                      <Bot className="h-4 w-4 text-[var(--color-primary)]" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Follow up Prompts */}
              {followUpPrompts.length > 0 && !isStreaming && (
                <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-full flex items-center gap-1 mb-1">
                    <Sparkles className="h-3 w-3" /> Suggested Replies
                  </span>
                  {followUpPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(undefined, prompt)}
                      className="text-xs sm:text-sm px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-full hover:bg-indigo-50 transition-colors shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={(e) => handleSendMessage(e)} className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your answer..."
                    disabled={isStreaming}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-colors"
                  />
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="rounded-full px-6 flex-shrink-0"
                    disabled={!inputMessage.trim() || isStreaming}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-2">Send</span>
                  </Button>
                </form>
              </div>
            </>
          )}

        </Card>

      </div>
    </div>
  );
}

export default function InterviewCoachPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-neutral-bg)] flex items-center justify-center">Loading...</div>}>
      <InterviewCoachContent />
    </Suspense>
  );
}
