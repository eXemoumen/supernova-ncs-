"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  MessageCircle, 
  MinusCircle, 
  Maximize2, 
  ChevronRight, 
  Paperclip,
  ImageIcon,
  Video,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DepartmentChatbotProps {
  department: string;
  onCloseAction?: () => void;
  specialization: string;
  displayMode?: 'overlay' | 'integrated';
}

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  attachments?: string[];
}

interface Client {
  id: string;
  name: string;
  niche: string;
}

export function DepartmentChatbot({
  department,
  onCloseAction,
  specialization,
  displayMode = 'overlay',
}: DepartmentChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: `Hello! I'm your specialized AI assistant for ${department}. I can help you with ${specialization}. What would you like to work on today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const { toast } = useToast();
  const [uniqueId, setUniqueId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Additional state for the rich chat experience
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [contextData, setContextData] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

  // Initialize state based on display mode
  useEffect(() => {
    // If integrated mode, always show the chatbot
    if (displayMode === 'integrated') {
      setIsMinimized(false);
      setIsExpanded(true);
    }
  }, [displayMode]);

  useEffect(() => {
    // Fetch clients data
    const fetchClients = async () => {
      try {
        // Mocking client data for now
        const mockClients = [
          { id: "1", name: "TechNova", niche: "SaaS Technology" },
          { id: "2", name: "GreenLife", niche: "Sustainable Products" },
          { id: "3", name: "FinEdge", niche: "Financial Services" },
        ];
        setClients(mockClients);
        if (mockClients.length > 0) {
          setSelectedClientId(mockClients[0].id);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          title: "Error",
          description: "Failed to load clients. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    fetchClients();
  }, []);

  useEffect(() => {
    setUniqueId(`user-${messages.length}-${Date.now()}`);
  }, [messages.length]);

  useEffect(() => {
    // Scroll to bottom of messages when new message is added or when expanded
    if (messagesEndRef.current && (!isMinimized || displayMode === 'integrated')) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMinimized, isExpanded, displayMode]);

  const handleSend = async () => {
    if (!input.trim() && attachedFiles.length === 0) return;

    const userMessage: Message = {
      id: uniqueId,
      type: "user",
      content: input,
      timestamp: new Date(),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachedFiles([]);
    setIsTyping(true);

    // Get selected client info
    const selectedClient = clients.find(client => client.id === selectedClientId);
    const clientContext = selectedClient ? `for ${selectedClient.name} (${selectedClient.niche})` : '';

    // Simulate AI response based on department
    setTimeout(() => {
      let aiResponse = "";

      switch (department.toLowerCase()) {
        case "marketing hub":
          aiResponse = `Great question about "${input}" ${clientContext}! For marketing, I recommend focusing on data-driven strategies. Would you like me to help you create a campaign plan or analyze your current metrics?`;
          break;
        case "support center":
          aiResponse = `I understand you need help with "${input}" ${clientContext}. For customer support, I can help you draft responses, categorize tickets, or suggest resolution strategies. What specific aspect would you like to focus on?`;
          break;
        case "hr management":
          aiResponse = `Regarding "${input}" in HR management ${clientContext}, I can assist with employee onboarding processes, performance evaluation frameworks, or recruitment strategies. Which area interests you most?`;
          break;
        case "finance":
          aiResponse = `For your finance query about "${input}" ${clientContext}, I can help with budget analysis, expense categorization, or financial reporting. Would you like me to create a financial template or analyze spending patterns?`;
          break;
        case "operations":
          aiResponse = `Your operations question about "${input}" ${clientContext} is interesting! I can help optimize workflows, create process documentation, or suggest automation opportunities. What's your priority?`;
          break;
        case "content studio":
          aiResponse = `Thanks for your question about "${input}" in content creation ${clientContext}. I can help you generate ideas, draft content outlines, or optimize existing content. Which would you like to focus on first?`;
          break;
        default:
          aiResponse = `I can help you with "${input}" ${clientContext}. Let me provide some specialized insights for your ${department} department.`;
      }

      if (userMessage.attachments && userMessage.attachments.length > 0) {
        aiResponse = `I've analyzed the ${userMessage.attachments.length} file(s) you shared. ${aiResponse}`;
      }

      if (contextData.trim()) {
        aiResponse += `\n\nI've also considered the additional context you've provided about: "${contextData.substring(0, 50)}..."`;
      }

      const aiMessage: Message = {
        id: `ai-${messages.length}-${Date.now()}`,
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFileUpload = (type: string) => {
    const fileName = `${type}-${Date.now()}.${
      type === "image" ? "jpg" : type === "video" ? "mp4" : "pdf"
    }`;
    setAttachedFiles((prev) => [...prev, fileName]);
    toast({
      title: "File Attached",
      description: `${fileName} has been attached to your message.`,
    });
  };

  const toggleMinimized = () => {
    // Only allow minimizing in overlay mode
    if (displayMode === 'overlay') {
      if (isMinimized) {
        setIsMinimized(false);
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
        // Slight delay to allow collapse animation before minimizing
        setTimeout(() => {
          setIsMinimized(true);
        }, 300);
      }
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Render the chat content (used by both overlay and integrated modes)
  const renderChatContent = () => {
  return (
      <>
          {/* Messages */}
        <div className={cn(
          "flex-1 overflow-y-auto space-y-3 sm:space-y-4",
          displayMode === 'overlay' ? "p-3 sm:p-4" : "p-4"
        )}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                className={`flex items-start space-x-1.5 sm:space-x-2 max-w-[85%] ${
                    message.type === "user"
                    ? "flex-row-reverse space-x-reverse sm:space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                  className={`p-1.5 sm:p-2 rounded-full ${
                      message.type === "user"
                        ? "bg-blue-600"
                        : "bg-gradient-to-r from-purple-500 to-pink-500"
                    }`}
                  >
                    {message.type === "user" ? (
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    ) : (
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    )}
                  </div>
                  <div
                  className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-900 border"
                    }`}
                  >
                  <p className="leading-relaxed break-words">{message.content}</p>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.attachments.map((file, index) => (
                        <Badge key={index} variant="secondary" className="text-[10px] sm:text-xs py-0">
                          <FileText className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                          {file}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                    <p
                      className={`text-xs mt-1 ${
                        message.type === "user"
                          ? "text-blue-100"
                          : "text-slate-500"
                      }`}
                    >
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
              <div className="flex items-start space-x-1.5 sm:space-x-2">
                <div className="p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                  <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                <div className="p-2 sm:p-3 rounded-lg bg-slate-100 border">
                    <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          <div ref={messagesEndRef} />
        </div>

        {/* Additional Context */}
        <div className="border-t p-3 sm:p-4">
          <Label htmlFor="context" className="text-xs sm:text-sm mb-1 block">Additional Context (Optional)</Label>
          <Textarea 
            id="context"
            placeholder="Add any relevant context or background information..."
            className="text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
            value={contextData}
            onChange={(e) => setContextData(e.target.value)}
          />
          </div>

          {/* Input */}
        <div className="border-t p-3 sm:p-4">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask your ${department} AI assistant...`}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 text-xs sm:text-sm"
              />
              <Button
                onClick={handleSend}
              disabled={(!input.trim() && attachedFiles.length === 0) || isTyping}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              size={displayMode === 'overlay' && isMobile ? "sm" : "default"}
              >
              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
          
          {/* File attachments */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex space-x-1">
              {attachedFiles.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {attachedFiles.length} file(s)
                </Badge>
              )}
            </div>
            
            <div className="flex space-x-1">
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "rounded-full",
                  displayMode === 'overlay' && isMobile ? "h-7 w-7 p-0" : "h-8 w-8 p-0"
                )}
                onClick={() => handleFileUpload("image")}
              >
                <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "rounded-full",
                  displayMode === 'overlay' && isMobile ? "h-7 w-7 p-0" : "h-8 w-8 p-0"
                )}
                onClick={() => handleFileUpload("document")}
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              {!(displayMode === 'overlay' && isMobile) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => handleFileUpload("video")}
                >
                  <Video className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-2 sm:mt-3">
              <Badge variant="outline" className="text-xs">
              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                Powered by Advanced AI
              </Badge>
            </div>
          </div>
      </>
    );
  };

  // Overlay mode (floating button that expands to slide-in panel)
  if (displayMode === 'overlay') {
    return (
      <>
        <AnimatePresence>
          {!isMinimized && (
            <motion.div 
              className="fixed right-0 top-0 h-full bg-black/10 backdrop-blur-sm z-40 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => toggleMinimized()}
            />
          )}
        </AnimatePresence>

        <motion.div 
          className={cn(
            "fixed z-50",
            isMinimized 
              ? "w-auto h-auto bottom-20 right-6" 
              : "top-0 right-0 h-full w-[95%] sm:w-[450px] md:w-[550px]"
          )}
          initial={isMinimized ? { x: 0 } : { x: "100%" }}
          animate={isMinimized 
            ? { x: 0 } 
            : { x: 0 }
          }
          exit={isMinimized ? { x: 0 } : { x: "100%" }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30
          }}
        >
          {isMinimized ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                toggleMinimized();
              }}
              className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg flex items-center justify-center p-0"
            >
              <Bot className="h-6 w-6 text-white" />
            </Button>
          ) : (
            <Card className="w-full h-full flex flex-col shadow-2xl border-slate-700/50">
              <CardHeader className="flex flex-row items-center justify-between flex-shrink-0 border-b p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                    <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">{department} AI Assistant</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Specialized AI for {specialization}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMinimized();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <div className="p-3 sm:p-4 border-b bg-slate-50/5">
                <Select value={selectedClientId || ""} onValueChange={setSelectedClientId}>
                  <SelectTrigger className="w-full text-xs sm:text-sm">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.niche}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <CardContent className="flex-1 flex flex-col p-0">
                {renderChatContent()}
        </CardContent>
      </Card>
          )}
        </motion.div>
      </>
    );
  }

  // Integrated mode (full-height component within parent container)
  return (
    <Card className="w-full h-full flex flex-col shadow-md border-slate-700/50">
      <CardHeader className="flex flex-row items-center justify-between flex-shrink-0 border-b p-4">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">{department} AI Assistant</CardTitle>
            <CardDescription className="text-sm">
              Specialized AI for {specialization}
            </CardDescription>
          </div>
        </div>
        {onCloseAction && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onCloseAction}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      <div className="p-4 border-b bg-slate-50/5">
        <Select value={selectedClientId || ""} onValueChange={setSelectedClientId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name} - {client.niche}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
    </div>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {renderChatContent()}
      </CardContent>
    </Card>
  );
}
