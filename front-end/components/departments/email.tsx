import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Mail } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { DepartmentChatbot } from '@/components/department-chatbot';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Zap } from 'lucide-react';

interface EmailPageProps {
  onBackAction: () => void;
  department: any;
}

const EmailPage = ({ onBackAction, department }: EmailPageProps) => {
  const [prompt, setPrompt] = useState('');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ title: 'Error', description: 'Prompt cannot be empty.' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email content.');
      }

      const data = await response.json();
      setSubject(data.subject);
      setBody(data.body);
    } catch (error) {
      toast({ title: 'Error', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailContent = () => (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">AI Email Automation</h1>
        <p className="text-sm text-slate-400">Generate professional emails with AI assistance</p>
      </header>
      
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipient" className="text-sm font-medium text-slate-300 mb-1.5 block">
                Recipient's Email
              </Label>
              <Input 
                id="recipient" 
                type="email" 
                value={recipient} 
                onChange={(e) => setRecipient(e.target.value)} 
                className="border-slate-600 bg-slate-900/50 text-white focus:border-blue-400" 
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="prompt" className="text-sm font-medium text-slate-300 mb-1.5 block">
                Email Prompt
              </Label>
              <Input 
                id="prompt" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="e.g., Follow-up on last week's demo" 
                className="border-slate-600 bg-slate-900/50 text-white focus:border-blue-400" 
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleGenerate} 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Email
                </>
              )}
            </Button>
          </div>
          
          <div className="pt-4 border-t border-slate-700/50">
            <div className="mb-4">
              <Label htmlFor="subject" className="text-sm font-medium text-slate-300 mb-1.5 block">
                Subject
              </Label>
              <Input 
                id="subject" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                className="border-slate-600 bg-slate-900/50 text-white focus:border-blue-400"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="body" className="text-sm font-medium text-slate-300 mb-1.5 block">
                Body
              </Label>
              <Textarea 
                id="body" 
                value={body} 
                onChange={(e) => setBody(e.target.value)} 
                rows={isMobile ? 8 : 12}
                className="min-h-[200px] border-slate-600 bg-slate-900/50 text-white focus:border-blue-400 resize-none" 
              />
            </div>
            
            <div className="flex justify-end">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Professional Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 rounded-xl shadow-lg">
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base md:text-xl font-semibold text-white truncate">
                    Email Automation
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400 hidden sm:block truncate max-w-[200px] md:max-w-xs">
                    AI-Powered Email Generation & Management
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="text-slate-300 bg-transparent border-slate-600 hover:bg-slate-700 h-8 px-2 sm:px-3"
                onClick={onBackAction}
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-medium text-xs hidden sm:inline-flex">
                <Zap className="h-3 w-3 mr-1" />
                AI Enabled
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Main Content and Chatbot Layout */}
        <div className="flex flex-1 w-full">
          {/* Main Content Area */}
          <div className={`${isMobile ? 'w-full' : 'w-2/3'} p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto`}>
            {renderEmailContent()}
          </div>
          
          {/* Integrated Chatbot (Desktop Only) */}
          {!isMobile && (
            <div className="w-1/3 border-l border-slate-700/50">
              <DepartmentChatbot 
                department="Email Automation"
                specialization="email writing and automation"
                displayMode="integrated"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Chatbot (Overlay Mode) */}
      {isMobile && (
        <DepartmentChatbot 
          department="Email Automation"
          specialization="email writing and automation"
          displayMode="overlay"
        />
      )}
    </div>
  );
};

export default EmailPage;