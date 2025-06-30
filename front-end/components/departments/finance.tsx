"use client";

import { useState, useEffect, useRef } from "react";
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
  TrendingDown,
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
  PieChart,
  Upload,
  ChevronRight,
  Settings,
  Filter,
  RefreshCw,
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
import { v4 as uuidv4 } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FinanceProps {
  onBackAction: () => void;
  department: any;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  className?: string;
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

interface FinanceContent {
  id: string;
  title: string;
  type: "report" | "budget" | "invoice" | "analysis" | "other";
  status: "draft" | "reviewed" | "final" | "archived";
  priority: "high" | "medium" | "low";
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

export default function Finance({
  onBackAction,
  department,
  activeSection = "dashboard",
  onSectionChange,
  className,
}: FinanceProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generatedContentIdeas, setGeneratedContentIdeas] = useState<
    FinanceContent[]
  >([]);
  const [approvedContentIdeas, setApprovedContentIdeas] = useState<
    FinanceContent[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [contentIdeas, setContentIdeas] = useState<FinanceContent[]>([]);
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
    if (!inputMessage.trim() && selectedFile === null) return;

    const userMessage: ChatMessage = {
      id: `user-${messages.length}-${Date.now()}`,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
      attachments: selectedFile ? [selectedFile.name] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setSelectedFile(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/finance-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: "",
          client: selectedClient,
          niche: selectedNiche,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse: ChatMessage = {
        id: `ai-${messages.length}-${Date.now()}`,
        type: "ai",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error sending message to Gemini API:", error);
      const errorMessage: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        type: "ai",
        content:
          "Sorry, I'm having trouble connecting to the AI. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFinanceContent = async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    setGeneratedContentIdeas([]);

    try {
      const response = await fetch("/api/generate-finance-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: inputMessage,
          client: selectedClient,
          niche: selectedNiche,
          brief: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const parsedContentPieces = data.financeContent
        .split("\n")
        .map((line: string) => line.replace(/^\d+\.\s*/, ""))
        .filter((line: string) => line.trim() !== "");
      const newContentIdeas: FinanceContent[] = parsedContentPieces.map(
        (piece: string) => ({
          id: `finance-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
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
      console.error("Error generating finance content:", error);
      toast({
        title: "Error",
        description: "Failed to generate finance content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveIdea = (id: string) => {
    setGeneratedContentIdeas((prev) => {
      const ideaToApprove = prev.find((idea) => idea.id === id);
      if (ideaToApprove) {
        const updatedIdea: FinanceContent = {
          ...ideaToApprove,
          status: "final" as const,
        };
        setApprovedContentIdeas((approvedPrev) => [
          ...approvedPrev,
          updatedIdea,
        ]);
        toast({
          title: "Finance Content Approved",
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
            title: "Finance Content Deleted",
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
            title: "Finance Content Deleted",
            description: `"${ideaToDelete.title}" has been deleted from approved finance content.`,
          });
          return prev.filter((idea) => idea.id !== id);
        }
        return prev;
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      toast({
        title: "File Attached Successfully",
        description: `${file.name} has been attached to your message.`,
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      draft: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      completed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      new: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      "in-progress": "bg-orange-500/20 text-orange-300 border-orange-500/30",
      approved: "bg-green-500/20 text-green-300 border-green-500/30",
      final: "bg-green-500/20 text-green-300 border-green-500/30",
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
                      <p className="text-sm text-slate-400">Total Revenue</p>
                      <p className="text-2xl font-bold text-white">$1.2M</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Total Expenses</p>
                      <p className="text-2xl font-bold text-white">$850K</p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Approved Reports</p>
                      <p className="text-2xl font-bold text-white">
                        {approvedContentIdeas.length}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Budget Utilization
                      </p>
                      <p className="text-2xl font-bold text-white">75%</p>
                    </div>
                    <PieChart className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <LineChart className="h-5 w-5 text-blue-400" />
                  <span>Financial Performance Trends</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Monthly overview of revenue, expenses, and profit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center text-slate-400">
                  <p>Financial performance chart coming soon!</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <span>Recent Financial Documents</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Overview of your latest financial reports or budget plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-400">
                    Recent financial documents will appear here.
                  </p>
                </div>
                <Button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => onSectionChange?.("content-creation")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Financial Content
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
                  AI Finance Content Generator
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Generate financial reports, budget plans, or expense analyses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Describe the financial content you want to generate (e.g., 'a quarterly revenue report', 'a budget plan for Q3')..."
                  className="border-slate-600 bg-slate-900/50 text-white"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={handleGenerateFinanceContent}
                  disabled={isLoading || inputMessage.trim() === ""}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                      Generating...
                    </>
                  ) : (
                    <>
                      <PenTool className="h-4 w-4 mr-2" />
                      Generate Financial Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  Generated Financial Content
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Review and approve AI-suggested financial content
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
                      No new financial content. Generate some above!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  Approved Financial Documents
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Documents ready for review or distribution
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
                      No approved financial documents yet.
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
                <CardTitle className="text-white">
                  Finance Configuration
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure AI module for financial content generation
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
                <DollarSign className="h-5 w-5 text-purple-400" />
                <span>Finance Control Section</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                This section is under development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="h-10 w-10 text-purple-400" />
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

  useEffect(() => {
    // Initialize any necessary data or state
  }, []);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 p-6">
        <Tabs defaultValue="chat" className="h-full space-y-6">
          <div className="space-between flex items-center">
            <TabsList>
              <TabsTrigger value="chat">AI Assistant</TabsTrigger>
              <TabsTrigger value="content">Content Generation</TabsTrigger>
              <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="border-none p-0 outline-none">
            <div className="flex h-[600px] flex-col space-y-4">
              <Card className="flex-1 p-4">
                <ScrollArea className="h-full pr-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${
                        message.type === "ai" ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <div className="flex h-full w-full items-center justify-center">
                          {message.type === "ai" ? (
                            <FileText className="h-4 w-4" />
                          ) : (
                            <div className="h-full w-full bg-primary" />
                          )}
                        </div>
                      </Avatar>
                      <div
                        className={`ml-2 rounded-lg px-3 py-2 ${
                          message.type === "ai"
                            ? "bg-muted"
                            : "ml-auto mr-2 bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </Card>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </Button>
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="border-none p-0 outline-none">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Finance Content Generation
                </h2>
                <Button
                  onClick={handleGenerateFinanceContent}
                  disabled={isLoading}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Generate Content
                </Button>
              </div>

              <div className="grid gap-4">
                <Card className="p-4">
                  <h3 className="mb-4 text-lg font-semibold">
                    Generated Ideas
                  </h3>
                  {generatedContentIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="mb-4 flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <h4 className="font-medium">{idea.title}</h4>
                        <div className="mt-1 flex space-x-2">
                          <Badge variant="outline">{idea.type}</Badge>
                          <Badge
                            variant={
                              idea.priority === "high"
                                ? "destructive"
                                : idea.priority === "medium"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {idea.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveIdea(idea.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteIdea(idea.id, "generated")}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </Card>

                <Card className="p-4">
                  <h3 className="mb-4 text-lg font-semibold">
                    Approved Content
                  </h3>
                  {approvedContentIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="mb-4 flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <h4 className="font-medium">{idea.title}</h4>
                        <div className="mt-1 flex space-x-2">
                          <Badge variant="outline">{idea.type}</Badge>
                          <Badge variant="outline">Approved</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="border-none p-0 outline-none">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Financial Reports & Analytics
                </h2>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Revenue</p>
                      <h3 className="text-2xl font-bold">$128,400</h3>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Expenses</p>
                      <h3 className="text-2xl font-bold">$54,200</h3>
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-500" />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Profit Margin</p>
                      <h3 className="text-2xl font-bold">32.5%</h3>
                    </div>
                    <Target className="h-8 w-8 text-blue-500" />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Cash Flow</p>
                      <h3 className="text-2xl font-bold">$74,200</h3>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-500" />
                  </div>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h3 className="mb-4 text-lg font-semibold">
                    Revenue Breakdown
                  </h3>
                  <div className="h-[300px]">
                    <PieChart className="h-full w-full text-muted-foreground" />
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-4 text-lg font-semibold">Monthly Trends</h3>
                  <div className="h-[300px]">
                    <LineChart className="h-full w-full text-muted-foreground" />
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
