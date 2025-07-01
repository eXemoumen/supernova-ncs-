"use client";

import AgiChat from '@/components/agi-chat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, Database, AlertCircle, Zap, Code, Terminal, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const AgiPage = () => {
  const router = useRouter();
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/dashboard')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">AGI Command Center</h1>
            <p className="text-muted-foreground">
              Your AI-powered assistant that can help you manage clients, campaigns, and content through natural language commands.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Database className="h-5 w-5 text-blue-500" />
                <CardTitle>Client Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="text-sm">
                <Badge variant="outline" className="mb-2">Example Commands</Badge>
                <ul className="space-y-1 pl-5 list-disc text-muted-foreground">
                  <li>"List all clients"</li>
                  <li>"Add a new client named Acme Corp with niche technology"</li>
                  <li>"Update client with id 1 set name to TechCorp"</li>
                  <li>"Delete client with id 3"</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <CardTitle>Tips & Tricks</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="text-sm text-muted-foreground">
                <ul className="space-y-1 pl-5 list-disc">
                  <li>Be specific when adding new clients</li>
                  <li>Always include the ID when updating or deleting</li>
                  <li>Confirmation is required for destructive actions</li>
                  <li>Use natural language - the AI understands context</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Terminal className="h-5 w-5 text-green-500" />
                <CardTitle>System Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Zap className="h-3 w-3 mr-1" />
                  AGI Service
                </Badge>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Database className="h-3 w-3 mr-1" />
                  Database
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Services running on localhost:8000 and localhost:3001
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="h-[calc(100vh-16rem)]">
        <AgiChat />
      </div>
      
      <div className="mt-6 text-center text-xs text-muted-foreground">
        <p>AGI Assistant is in beta. For issues, please contact support.</p>
      </div>
    </div>
  );
};

export default AgiPage;
