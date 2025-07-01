"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Bot, User, Info, AlertCircle, RefreshCw, Trash2, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: "user" | "agi";
  content: string;
  timestamp: Date;
  tool?: string;
}

const AgiChat = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "agi",
      content: "Welcome! I'm your AI assistant. I can help you manage clients through natural language commands. Try asking me to:\n\n- List all clients\n- Add a new client\n- Update client information\n- Delete a client\n- Type 'help' to see all available commands",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showConversationTools, setShowConversationTools] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load session ID from localStorage on component mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem('agi-session-id');
    if (savedSessionId) {
      setSessionId(savedSessionId);
      fetchConversationHistory(savedSessionId);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  // Fetch conversation history for an existing session
  const fetchConversationHistory = async (sid: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:8000/conversation/${sid}`);
      
      if (!res.ok) {
        // If session not found or expired, don't show an error
        if (res.status === 404) {
          return;
        }
        throw new Error(`Server responded with ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.history && data.history.length > 0) {
        // Convert the history to our message format
        const historyMessages: Message[] = data.history.flatMap((turn: any) => {
          const messages = [];
          
          // Add user message
          messages.push({
            id: `user-${new Date(turn.timestamp).getTime()}`,
            role: "user",
            content: turn.user_message,
            timestamp: new Date(turn.timestamp),
          });
          
          // Add AGI response
          messages.push({
            id: `agi-${new Date(turn.timestamp).getTime()}`,
            role: "agi",
            content: turn.agent_response,
            timestamp: new Date(turn.timestamp),
            tool: turn.tool_used,
          });
          
          return messages;
        });
        
        // Replace welcome message with history
        setMessages([messages[0], ...historyMessages]);
        
        toast({
          title: "Session Restored",
          description: `Restored conversation with ${historyMessages.length / 2} previous exchanges.`,
        });
      }
    } catch (error) {
      console.error("Error fetching conversation history:", error);
      toast({
        title: "History Error",
        description: "Failed to load conversation history.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear the current conversation
  const clearConversation = async () => {
    if (sessionId) {
      try {
        await fetch(`http://localhost:8000/conversation/${sessionId}`, {
          method: 'DELETE',
        });
        
        // Reset messages to just the welcome message
        setMessages([
          {
            id: "welcome",
            role: "agi",
            content: "Conversation cleared. How else can I help you today?",
            timestamp: new Date(),
          },
        ]);
        
        toast({
          title: "Conversation Cleared",
          description: "Your conversation history has been cleared.",
        });
      } catch (error) {
        console.error("Error clearing conversation:", error);
        toast({
          title: "Error",
          description: "Failed to clear conversation history.",
          variant: "destructive",
        });
      }
    } else {
      // If no session yet, just reset the messages
      setMessages([
        {
          id: "welcome",
          role: "agi",
          content: "Welcome! I'm your AI assistant. How can I help you today?",
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Start a new conversation with a fresh session
  const startNewConversation = () => {
    // Clear the session ID
    localStorage.removeItem('agi-session-id');
    setSessionId(null);
    
    // Reset messages
    setMessages([
      {
        id: "welcome",
        role: "agi",
        content: "Welcome to a new conversation! How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    
    toast({
      title: "New Conversation",
      description: "Started a new conversation session.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    try {
      const requestBody: any = { prompt: userMessage.content };
      
      // Include session ID if we have one
      if (sessionId) {
        requestBody.session_id = sessionId;
      }
      
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        mode: "cors",
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}: ${await res.text()}`);
      }

      const data = await res.json();
      
      // Save the session ID if we got a new one
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
        localStorage.setItem('agi-session-id', data.session_id);
      }
      
      const agiMessage: Message = {
        id: `agi-${Date.now()}`,
        role: "agi",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agiMessage]);
    } catch (error) {
      console.error("Error:", error);
      
      const errorMessage: Message = {
        id: `agi-error-${Date.now()}`,
        role: "agi",
        content: "I'm having trouble connecting to my brain. Please make sure the AGI service is running at http://localhost:8000.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to the AGI service.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col overflow-hidden border-slate-700/50 bg-slate-800/30">
        <CardHeader className="bg-slate-900/70 border-b border-slate-700/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">AGI Assistant</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  {sessionId ? 'Conversation in progress' : 'New conversation'}
                </CardDescription>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-400 hover:text-white"
              onClick={() => setShowConversationTools(!showConversationTools)}
            >
              <History className="h-4 w-4" />
            </Button>
          </div>
          
          {showConversationTools && (
            <div className="flex gap-2 mt-2 pt-2 border-t border-slate-700/50">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs bg-slate-800/70 border-slate-600/50 hover:bg-slate-700"
                onClick={clearConversation}
              >
                <Trash2 className="h-3 w-3 mr-1" /> Clear Conversation
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs bg-slate-800/70 border-slate-600/50 hover:bg-slate-700"
                onClick={startNewConversation}
              >
                <RefreshCw className="h-3 w-3 mr-1" /> New Session
              </Button>
            </div>
          )}
        </CardHeader>
        <ScrollArea 
          className="flex-1 p-4 overflow-y-auto" 
          ref={scrollAreaRef}
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700/60 border border-slate-600/50 text-slate-100"
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.role === "agi" ? (
                      <Bot className="h-4 w-4 mr-1.5 text-blue-400" />
                    ) : (
                      <User className="h-4 w-4 mr-1.5 text-blue-200" />
                    )}
                    <span className="text-xs opacity-70">
                      {message.role === "agi" ? "AGI" : "You"}
                      {" • "}
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {message.tool && (
                        <span className="ml-1 text-blue-300/70">[{message.tool}]</span>
                      )}
                    </span>
                  </div>
                  <div className={`text-sm ${message.role === "agi" ? "prose prose-invert max-w-none" : ""}`}>
                    {message.role === "agi" ? (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-slate-700/60 border border-slate-600/50 text-slate-100">
                  <div className="flex items-center">
                    <Bot className="h-4 w-4 mr-1.5 text-blue-400" />
                    <span className="text-xs opacity-70">AGI</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-3 border-t border-slate-700/50 bg-slate-800/50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Type your command..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-slate-700/30 border-slate-600/50 text-white placeholder:text-slate-400 focus-visible:ring-blue-600"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !prompt.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <div className="flex items-center mt-2 text-xs text-slate-400">
            <Info className="h-3 w-3 mr-1" />
            <span>Try commands like "list clients" or "add a new client named Acme Inc"</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AgiChat;
