"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  MessageSquare,
  TrendingUp,
  PenTool,
  Target,
  Share2,
  Zap,
  Bell,
  Activity,
  PlusCircle,
  Bot,
  Search,
  Layout,
  Briefcase,
  BookOpen,
  Shield,
  Archive,
  Users,
  Clock,
  Eye,
  Download,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Building2,
  FileText,
  ImageIcon,
  Video,
  Paperclip,
  Send,
  DollarSign,
  LineChart,
  Star,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import { DepartmentChatbot } from "@/components/department-chatbot";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AgentForm } from "@/components/agent-form";
import { useIsMobile } from "@/hooks/use-mobile";

interface HRProps {
  onBackAction: () => void;
  department: any;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  attachments?: string[];
}

interface Campaign {
  id: number;
  name: string;
  status: "active" | "draft" | "completed";
  performance: number;
  budget: string;
  startDate: string;
  endDate: string;
  targetAudience: string;
  channels: string[];
  roi: number;
  client: string;
  niche: string;
}

interface HRContent {
  id: string;
  title: string;
  type:
    | "policy"
    | "job_description"
    | "performance_review"
    | "onboarding_material"
    | "other";
  status: "draft" | "review" | "finalized" | "archived";
  priority: "urgent" | "high" | "medium" | "low";
  client?: string;
  niche?: string;
}

interface MarketingDataPoint {
  month: string;
  revenue: number;
  spend: number;
  roi: number;
  client: string;
  niche: string;
}

export default function HR({
  onBackAction,
  department,
  activeSection = "dashboard",
  onSectionChange,
}: HRProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Welcome to OmniDesk HR Management! I'm your AI HR Assistant. I can help you with employee management, recruitment, and performance tracking. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [contextData, setContextData] = useState("");
  const [topicPrompt, setTopicPrompt] = useState("");
  const [generatedContentIdeas, setGeneratedContentIdeas] = useState<
    HRContent[]
  >([]);
  const [approvedContentIdeas, setApprovedContentIdeas] = useState<HRContent[]>(
    []
  );
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const [generatedCampaigns, setGeneratedCampaigns] = useState<Campaign[]>([]);
  const [isGeneratingCampaigns, setIsGeneratingCampaigns] = useState(false);
  const { toast } = useToast();

  const [selectedClient, setSelectedClient] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [clients, setClients] = useState<any[]>([
    {
      id: "client-a",
      name: "Client A",
      avatar: "/placeholder-user.jpg",
      industry: "Tech",
      satisfaction: 4.5,
      tier: "Premium",
    },
    {
      id: "client-b",
      name: "Client B",
      avatar: "/placeholder-user.jpg",
      industry: "Retail",
      satisfaction: 3.8,
      tier: "Standard",
    },
    {
      id: "client-c",
      name: "Client C",
      avatar: "/placeholder-user.jpg",
      industry: "Healthcare",
      satisfaction: 4.9,
      tier: "Enterprise",
    },
  ]);
  const [niches, setNiches] = useState<any[]>([
    { value: "Digital Marketing", label: "Digital Marketing", icon: "📊" },
    { value: "Technology", label: "Technology", icon: "💻" },
    { value: "Healthcare", label: "Healthcare", icon: "⚕️" },
    { value: "Finance", label: "Finance", icon: "💰" },
    { value: "Education", label: "Education", icon: "📚" },
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contentIdeas, setContentIdeas] = useState<HRContent[]>([]);
  const [marketingData, setMarketingData] = useState<MarketingDataPoint[]>([]);

  const filteredCampaigns = campaigns.filter((campaign) => {
    return (
      (!selectedClient || campaign.client === selectedClient) &&
      (!selectedNiche || campaign.niche === selectedNiche)
    );
  });

  const filteredContentIdeas = contentIdeas.filter((idea) => {
    return (
      (!selectedClient || idea.client === selectedClient) &&
      (!selectedNiche || idea.niche === selectedNiche)
    );
  });

  const filteredMarketingData = marketingData.filter((dataPoint) => {
    return (
      (!selectedClient || dataPoint.client === selectedClient) &&
      (!selectedNiche || dataPoint.niche === selectedNiche)
    );
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && attachedFiles.length === 0) return;

    const userMessage: ChatMessage = {
      id: `user-${chatMessages.length}-${Date.now()}`,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setAttachedFiles([]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/hr-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: contextData,
          client: selectedClient,
          niche: selectedNiche,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse: ChatMessage = {
        id: `ai-${chatMessages.length}-${Date.now()}`,
        type: "ai",
        content: data.response,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error sending message to Gemini API:", error);
      const errorMessage: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        type: "ai",
        content:
          "Sorry, I'm having trouble connecting to the AI. Please try again later.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateHRContent = async () => {
    if (!topicPrompt.trim()) return;

    setIsGeneratingTopics(true);
    setGeneratedContentIdeas([]);

    try {
      const response = await fetch("/api/generate-hr-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: topicPrompt,
          client: selectedClient,
          niche: selectedNiche,
          brief: contextData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const parsedContentPieces = data.hrContent
        .split("\n")
        .map((line: string) => line.replace(/^\d+\.\s*/, ""))
        .filter((line: string) => line.trim() !== "");
      const newContentIdeas: HRContent[] = parsedContentPieces.map(
        (piece: string) => ({
          id: `hr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: piece,
          type: "other",
          status: "draft",
          priority: "medium",
          client: selectedClient,
          niche: selectedNiche,
        })
      );
      setGeneratedContentIdeas((prev) => [...prev, ...newContentIdeas]);
    } catch (error) {
      console.error("Error generating HR content:", error);
      toast({
        title: "Error",
        description: "Failed to generate HR content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTopics(false);
    }
  };

  const handleApproveIdea = (id: string) => {
    setGeneratedContentIdeas((prev) => {
      const ideaToApprove = prev.find((idea) => idea.id === id);
      if (ideaToApprove) {
        const updatedIdea: HRContent = {
          ...ideaToApprove,
          status: "finalized" as const,
        };
        setApprovedContentIdeas((approvedPrev) => [
          ...approvedPrev,
          updatedIdea,
        ]);
        toast({
          title: "HR Content Approved",
          description: `"${ideaToApprove.title}" has been approved.`,
        });
        return prev.filter((idea) => idea.id !== id);
      }
      return prev;
    });
  };

  const handleDeleteIdea = (id: string, section: "generated" | "approved") => {
    if (section === "generated") {
      setGeneratedContentIdeas((prev) => {
        const ideaToDelete = prev.find((idea) => idea.id === id);
        if (ideaToDelete) {
          toast({
            title: "HR Content Deleted",
            description: `"${ideaToDelete.title}" has been deleted.`,
          });
          return prev.filter((idea) => idea.id !== id);
        }
        return prev;
      });
    } else if (section === "approved") {
      setApprovedContentIdeas((prev) => {
        const ideaToDelete = prev.find((idea) => idea.id === id);
        if (ideaToDelete) {
          toast({
            title: "HR Content Deleted",
            description: `"${ideaToDelete.title}" has been deleted from approved HR content.`,
          });
          return prev.filter((idea) => idea.id !== id);
        }
        return prev;
      });
    }
  };

  const handleFileUpload = (type: string) => {
    const fileName = `${type}-${Date.now()}.${
      type === "image" ? "jpg" : type === "video" ? "mp4" : "pdf"
    }`;
    setAttachedFiles((prev) => [...prev, fileName]);
    toast({
      title: "File Attached Successfully",
      description: `${fileName} has been attached to your message.`,
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      draft: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      completed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      new: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      "in-progress": "bg-orange-500/20 text-orange-300 border-orange-500/30",
      approved: "bg-green-500/20 text-green-300 border-green-500/30",
      finalized: "bg-green-500/20 text-green-300 border-green-500/30",
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500/20 text-red-300 border-red-500/30",
      medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Total Employees</p>
                      <p className="text-2xl font-bold text-white">150</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Open Positions</p>
                      <p className="text-2xl font-bold text-white">5</p>
                    </div>
                    <Briefcase className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Policies Finalized
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {approvedContentIdeas.length}
                      </p>
                    </div>
                    <Shield className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Avg. Performance Score
                      </p>
                      <p className="text-2xl font-bold text-white">4.1</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <LineChart className="h-5 w-5 text-blue-400" />
                  <span>HR Performance Trends</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Monthly overview of key HR metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center text-slate-400">
                  <p>HR performance chart coming soon!</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <span>Recent HR Documents</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Overview of your latest HR policies or documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-400">
                    Recent HR documents will appear here.
                  </p>
                </div>
                <Button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => onSectionChange?.("content-creation")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate HR Content
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "content-creation":
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  AI HR Content Generator
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Generate HR policies, job descriptions, or performance reviews
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Describe the HR content you want to generate (e.g., 'a policy for remote work', 'a job description for a software engineer')..."
                  className="border-slate-600 bg-slate-900/50 text-white"
                  value={topicPrompt}
                  onChange={(e) => setTopicPrompt(e.target.value)}
                />
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={handleGenerateHRContent}
                  disabled={isGeneratingTopics || !topicPrompt.trim()}
                >
                  {isGeneratingTopics ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                      Generating...
                    </>
                  ) : (
                    <>
                      <PenTool className="h-4 w-4 mr-2" />
                      Generate HR Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  Generated HR Content
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Review and approve AI-suggested HR content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generatedContentIdeas.length > 0 ? (
                    generatedContentIdeas.map((idea) => (
                      <Card
                        key={idea.id}
                        className="p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                      >
                        <CardContent className="p-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white">
                              {idea.title}
                            </h4>
                            <Badge className={getStatusColor(idea.status)}>
                              {idea.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                            <span>Type: {idea.type}</span>
                            <span>Priority: {idea.priority}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                              onClick={() => handleApproveIdea(idea.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" /> Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600"
                              onClick={() =>
                                handleDeleteIdea(idea.id, "generated")
                              }
                            >
                              <XCircle className="h-4 w-4 mr-2" /> Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-slate-400">
                      No new HR content. Generate some above!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  Approved HR Documents
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Documents ready for implementation or distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {approvedContentIdeas.length > 0 ? (
                    approvedContentIdeas.map((idea) => (
                      <Card
                        key={idea.id}
                        className="p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                      >
                        <CardContent className="p-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white">
                              {idea.title}
                            </h4>
                            <Badge className={getStatusColor(idea.status)}>
                              {idea.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                            <span>Type: {idea.type}</span>
                            <span>Priority: {idea.priority}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600"
                            onClick={() =>
                              handleDeleteIdea(idea.id, "approved")
                            }
                          >
                            <XCircle className="h-4 w-4 mr-2" /> Delete
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-slate-400">
                      No approved HR documents yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "campaign-configuration":
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">HR Configuration</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure AI module for HR content generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AgentForm department={department} onClose={onBackAction} />
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Users className="h-5 w-5 text-green-400" />
                <span>HR Management Section</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                This section is under development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <div className="p-4 bg-gradient-to-br from-green-500/20 to-lime-500/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Coming Soon
                </h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  This section is under development. Stay tuned for exciting new
                  features!
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Professional Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-xl shadow-lg">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base md:text-xl font-semibold text-white truncate">
                    HR Management
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400 hidden sm:block truncate max-w-[200px] md:max-w-xs">
                    AI-Powered Employee & Recruitment Management
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
            {renderMainContent()}
          </div>

          {/* Integrated Chatbot (Desktop Only) */}
          {!isMobile && (
            <div className="w-1/3 border-l border-slate-700/50">
              <DepartmentChatbot 
                department="HR Management"
                specialization="employee management and recruitment"
                displayMode="integrated"
              />
                                </div>
          )}
              </div>
            </div>

      {/* Mobile Chatbot (Overlay Mode) */}
      {isMobile && (
        <DepartmentChatbot 
          department="HR Management"
          specialization="employee management and recruitment"
          displayMode="overlay"
        />
      )}
    </div>
  );
}
