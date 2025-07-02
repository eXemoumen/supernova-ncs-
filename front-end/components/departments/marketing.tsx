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
  Settings,
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

interface MarketingProps {
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

interface ContentIdea {
  id: string;
  title: string;
  type: "blog" | "social" | "email" | "video" | "other"; // Added 'other' for flexibility
  status: "new" | "approved" | "deleted";
  priority: "low" | "medium" | "high";
  client?: string; // Optional, as AI might not always provide
  niche?: string; // Optional
}

interface MarketingDataPoint {
  month: string;
  revenue: number;
  spend: number;
  roi: number;
  client: string;
  niche: string;
}

export default function Marketing({
  onBackAction,
  department,
  activeSection = "dashboard",
  onSectionChange,
}: MarketingProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Welcome to OmniDesk Marketing Hub! I'm your AI Marketing Strategist. I can help you with campaign management, content creation, and performance analysis. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [contextData, setContextData] = useState("");
  const [topicPrompt, setTopicPrompt] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const [generatedContentIdeas, setGeneratedContentIdeas] = useState<
    ContentIdea[]
  >([]);
  const [approvedContentIdeas, setApprovedContentIdeas] = useState<
    ContentIdea[]
  >([]);
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const [generatedCampaigns, setGeneratedCampaigns] = useState<Campaign[]>([]);
  const [isGeneratingCampaigns, setIsGeneratingCampaigns] = useState(false);
  const { toast } = useToast();

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);

  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClients(data);
        if (data.length > 0) {
          setSelectedClientId(data[0].id); // Select the first client by default
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

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [marketingData, setMarketingData] = useState<MarketingDataPoint[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("/api/campaigns");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setCampaigns(data);
        } else {
          // Inject fake campaigns if API returns empty
          setCampaigns([
            {
              id: 1,
              name: "Spring Launch",
              status: "active",
              performance: 85,
              budget: "$12,000",
              startDate: "2024-03-01",
              endDate: "2024-06-30",
              targetAudience: "Young professionals",
              channels: ["email", "ads"],
              roi: 2.5,
              client: "Client A",
              niche: "Fashion",
            },
            {
              id: 2,
              name: "Summer Sale",
              status: "draft",
              performance: 60,
              budget: "$8,000",
              startDate: "2024-07-01",
              endDate: "2024-08-31",
              targetAudience: "Students",
              channels: ["social media", "ads"],
              roi: 1.8,
              client: "Client B",
              niche: "Education",
            },
            {
              id: 3,
              name: "Tech Expo",
              status: "completed",
              performance: 92,
              budget: "$25,000",
              startDate: "2023-09-01",
              endDate: "2023-09-30",
              targetAudience: "Tech companies",
              channels: ["email", "seo"],
              roi: 3.1,
              client: "Client C",
              niche: "Technology",
            },
            {
              id: 4,
              name: "Holiday Promo",
              status: "draft",
              performance: 0,
              budget: "$15,000",
              startDate: "2024-11-15",
              endDate: "2024-12-31",
              targetAudience: "Families",
              channels: ["ads", "content marketing"],
              roi: 0,
              client: "Client A",
              niche: "Retail",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast({
          title: "Error",
          description: "Failed to load campaigns. Showing demo data.",
          variant: "destructive",
        });
        // Inject fake campaigns if API fails
        setCampaigns([
          {
            id: 1,
            name: "Spring Launch",
            status: "active",
            performance: 85,
            budget: "$12,000",
            startDate: "2024-03-01",
            endDate: "2024-06-30",
            targetAudience: "Young professionals",
            channels: ["email", "ads"],
            roi: 2.5,
            client: "Client A",
            niche: "Fashion",
          },
          {
            id: 2,
            name: "Summer Sale",
            status: "draft",
            performance: 60,
            budget: "$8,000",
            startDate: "2024-07-01",
            endDate: "2024-08-31",
            targetAudience: "Students",
            channels: ["social media", "ads"],
            roi: 1.8,
            client: "Client B",
            niche: "Education",
          },
          {
            id: 3,
            name: "Tech Expo",
            status: "completed",
            performance: 92,
            budget: "$25,000",
            startDate: "2023-09-01",
            endDate: "2023-09-30",
            targetAudience: "Tech companies",
            channels: ["email", "seo"],
            roi: 3.1,
            client: "Client C",
            niche: "Technology",
          },
          {
            id: 4,
            name: "Holiday Promo",
            status: "draft",
            performance: 0,
            budget: "$15,000",
            startDate: "2024-11-15",
            endDate: "2024-12-31",
            targetAudience: "Families",
            channels: ["ads", "content marketing"],
            roi: 0,
            client: "Client A",
            niche: "Retail",
          },
        ]);
      }
    };

    const fetchContentIdeas = async () => {
      try {
        const response = await fetch("/api/content-ideas");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setContentIdeas(data);
      } catch (error) {
        console.error("Error fetching content ideas:", error);
        toast({
          title: "Error",
          description: "Failed to load content ideas.",
          variant: "destructive",
        });
      }
    };

    const fetchMarketingData = async () => {
      try {
        const response = await fetch("/api/marketing-data");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMarketingData(data);
      } catch (error) {
        console.error("Error fetching marketing data:", error);
        toast({
          title: "Error",
          description: "Failed to load marketing data.",
          variant: "destructive",
        });
      }
    };

    fetchCampaigns();
    fetchContentIdeas();
    fetchMarketingData();
  }, []);

  const selectedClientData = clients.find(
    (client) => client.id === selectedClientId
  );

  const filteredCampaigns = campaigns.filter((campaign) => {
    return (
      (!selectedClientData || campaign.client === selectedClientData.name) &&
      (!selectedClientData || campaign.niche === selectedClientData.niche)
    );
  });

  const filteredContentIdeas = contentIdeas.filter((idea) => {
    return (
      (!selectedClientData || idea.client === selectedClientData.name) &&
      (!selectedClientData || idea.niche === selectedClientData.niche)
    );
  });

  const filteredMarketingData = marketingData.filter((dataPoint) => {
    return (
      (!selectedClientData || dataPoint.client === selectedClientData.name) &&
      (!selectedClientData || dataPoint.niche === selectedClientData.niche)
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
      const response = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: contextData,
          client: selectedClientData?.name,
          niche: selectedClientData?.niche,
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

  const handleGenerateTopics = async () => {
    if (!topicPrompt.trim()) return;

    setIsGeneratingTopics(true);
    setGeneratedContentIdeas([]); // Clear previous topics

    try {
      const response = await fetch("/api/generate-topic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: topicPrompt,
          client: selectedClientData?.name,
          niche: selectedClientData?.niche,
          brief: contextData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const parsedTopics = data.topics
        .split("\n")
        .map((line: string) => line.replace(/^\d+\.\s*/, ""))
        .filter((line: string) => line.trim() !== "");
      const newContentIdeas: ContentIdea[] = parsedTopics.map(
        (topic: string) => ({
          id: `idea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: topic,
          type: "other", // Default type, can be refined later
          status: "new",
          priority: "medium", // Default priority, can be refined later
          client: selectedClientData?.name,
          niche: selectedClientData?.niche,
        })
      );
      setGeneratedContentIdeas((prev) => [...prev, ...newContentIdeas]);
    } catch (error) {
      console.error("Error generating topics:", error);
      toast({
        title: "Error",
        description: "Failed to generate topics. Please try again.",
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
        const updatedIdea: ContentIdea = {
          ...ideaToApprove,
          status: "approved" as const,
        };
        setApprovedContentIdeas((approvedPrev) => [
          ...approvedPrev,
          updatedIdea,
        ]);
        toast({
          title: "Idea Approved",
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
            title: "Idea Deleted",
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
            title: "Idea Deleted",
            description: `"${ideaToDelete.title}" has been deleted from approved ideas.`,
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
    // Handle different sections of the marketing department based on activeSection
    switch (activeSection) {
      case "marketing-dashboard":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Marketing Dashboard
            </h2>
            {renderMarketingDashboard()}
          </div>
        );
      case "campaign-management":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Campaign Management
            </h2>
            {renderCampaignManagement()}
          </div>
        );
      case "content-creation":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Content Creation</h2>
            {renderContentCreation()}
          </div>
        );
      case "campaign-configuration":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Campaign Configuration
            </h2>
            {renderCampaignConfiguration()}
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Marketing Hub</h2>
            {renderMarketingDashboard()}
          </div>
        );
    }
  };

  const renderMarketingDashboard = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <Card className="bg-slate-800/50 border-slate-700/50 col-span-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">
              Revenue & Marketing Spend
            </CardTitle>
            <CardDescription className="text-slate-400">
              Last 6 months performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={marketingData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "#334155" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "#334155" }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#334155",
                      borderRadius: "0.375rem",
                      color: "#f8fafc",
                    }}
                    formatter={(value: any) => [`$${value}`, ""]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4C9AFF"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: "#4C9AFF", stroke: "#1e293b" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="spend"
                    stroke="#FF5630"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: "#FF5630", stroke: "#1e293b" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="roi"
                    stroke="#36B37E"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: "#36B37E", stroke: "#1e293b" }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              <TrendingUp className="inline mr-2 h-5 w-5" /> ROI
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-emerald-400">312%</div>
            <p className="text-slate-400 text-sm mt-2">
              Average campaign return
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              <Target className="inline mr-2 h-5 w-5" /> Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-blue-400">
              {campaigns.filter((c) => c.status === "active").length}
            </div>
            <p className="text-slate-400 text-sm mt-2">Currently running</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              <FileText className="inline mr-2 h-5 w-5" /> Content Ideas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-purple-400">
              {contentIdeas.length}
            </div>
            <p className="text-slate-400 text-sm mt-2">Ready to implement</p>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="bg-slate-800/50 border-slate-700/50 col-span-full">
          <CardHeader>
            <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() =>
                  onSectionChange && onSectionChange("campaign-management")
                }
              >
                <Target className="mr-2 h-5 w-5" /> Manage Campaigns
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() =>
                  onSectionChange && onSectionChange("content-creation")
                }
              >
                <PenTool className="mr-2 h-5 w-5" /> Create Content
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() =>
                  onSectionChange && onSectionChange("campaign-configuration")
                }
              >
                <Settings className="mr-2 h-5 w-5" /> Configure AI
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleGenerateTopics()}
              >
                <Bot className="mr-2 h-5 w-5" /> AI Assist
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCampaignManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-white">Active Campaigns</h3>
            <p className="text-sm text-slate-400">
              Manage your ongoing marketing campaigns
            </p>
          </div>
          <Button onClick={() => setIsGeneratingCampaigns(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
          </Button>
        </div>

        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="bg-slate-800/50 border-slate-700/50"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white">
                        {campaign.name}
                      </h3>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status.charAt(0).toUpperCase() +
                          campaign.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      Client: {campaign.client} • Budget: {campaign.budget}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {campaign.channels.map((channel, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-slate-700/50"
                        >
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Performance</div>
                    <div className="text-xl font-bold text-white">
                      {campaign.performance}%
                    </div>
                    <div className="mt-1 text-xs text-emerald-400">
                      ROI: {campaign.roi}x
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" /> View
                  </Button>
                  <Button variant="outline" size="sm">
                    <PenTool className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderContentCreation = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-white">Content Ideas</h3>
            <p className="text-sm text-slate-400">
              Generate and manage content ideas for your campaigns
            </p>
          </div>
          <div className="flex gap-2">
            <Select
              value={selectedClientId || ""}
              onValueChange={setSelectedClientId}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setTopicPrompt("")}>
              <PlusCircle className="mr-2 h-4 w-4" /> New Idea
            </Button>
          </div>
        </div>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              Generate Content Ideas
            </CardTitle>
            <CardDescription>
              Enter details about your target audience and campaign goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic-prompt">
                  What type of content do you need?
                </Label>
                <Textarea
                  id="topic-prompt"
                  placeholder="E.g., 'Blog posts about sustainable fashion for millennials' or 'Instagram captions for our new product launch'"
                  value={topicPrompt}
                  onChange={(e) => setTopicPrompt(e.target.value)}
                  className="h-24"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleGenerateTopics}
                  disabled={isGeneratingTopics || !topicPrompt}
                >
                  {isGeneratingTopics ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      Generate Ideas
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {generatedContentIdeas.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Generated Ideas</h3>
            {generatedContentIdeas.map((idea) => (
              <Card
                key={idea.id}
                className="bg-slate-800/50 border-slate-700/50"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white">{idea.title}</h3>
                        <Badge className={getPriorityColor(idea.priority)}>
                          {idea.priority.charAt(0).toUpperCase() +
                            idea.priority.slice(1)}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-slate-400">
                        Type: {idea.type}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApproveIdea(idea.id)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteIdea(idea.id, "generated")}
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {approvedContentIdeas.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Approved Ideas</h3>
            {approvedContentIdeas.map((idea) => (
              <Card
                key={idea.id}
                className="bg-slate-800/50 border-slate-700/50"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white">{idea.title}</h3>
                        <Badge className={getPriorityColor(idea.priority)}>
                          {idea.priority.charAt(0).toUpperCase() +
                            idea.priority.slice(1)}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-slate-400">
                        Type: {idea.type}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <PenTool className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteIdea(idea.id, "approved")}
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCampaignConfiguration = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-white">
            AI Campaign Configuration
          </h3>
          <p className="text-sm text-slate-400">
            Configure AI modules for your marketing campaigns
          </p>
        </div>

        <AgentForm department="marketing" onClose={() => {}} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Professional Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-xl shadow-lg">
                  <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base md:text-xl font-semibold text-white truncate">
                    Marketing Hub
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400 hidden sm:block truncate max-w-[200px] md:max-w-xs">
                    AI-Powered Campaign Management & Content Creation
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
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-medium text-xs">
                {campaigns.filter((c) => c.status === "active").length} Active
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Main Content and Chatbot Layout */}
        <div className="flex flex-1 w-full">
          {/* Main Content Area */}
          <div
            className={`${
              isMobile ? "w-full" : "w-2/3"
            } p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto`}
          >
            {renderMainContent()}
          </div>

          {/* Integrated Chatbot (Desktop Only) */}
          {!isMobile && (
            <div className="w-1/3 border-l border-slate-700/50">
              <DepartmentChatbot
                department="Marketing Hub"
                specialization="campaign management and content strategy"
                displayMode="integrated"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Chatbot (Overlay Mode) */}
      {isMobile && (
        <DepartmentChatbot
          department="Marketing Hub"
          specialization="campaign management and content strategy"
          displayMode="overlay"
        />
      )}
    </div>
  );
}
