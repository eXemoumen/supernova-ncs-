import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
} from "lucide-react"

import { DepartmentChatbot } from "@/components/department-chatbot"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AgentForm } from "@/components/agent-form"

interface SupportProps { // Renamed from MarketingProps
  onBack: () => void
  department: any
  activeSection?: string
  onSectionChange?: (section: string) => void
}

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  attachments?: string[]
}

interface Campaign {
  id: number
  name: string
  status: "active" | "draft" | "completed"
  performance: number
  budget: string
  startDate: string
  endDate: string
  targetAudience: string
  channels: string[]
  roi: number
  client: string
  niche: string
}

interface SupportContent { // Renamed from ContentIdea
  id: string;
  title: string;
  type: "response" | "article" | "faq" | "other"; // Adapted for support content
  status: "draft" | "ready" | "published" | "deleted"; // Adapted for support content
  priority: "low" | "medium" | "high";
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

export default function Support({ // Renamed from Marketing
  onBack,
  department,
  activeSection = "dashboard",
  onSectionChange,
}: SupportProps) { // Renamed from MarketingProps
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Welcome to OmniDesk Support Center! I'm your AI Support Assistant. I can help you with ticket management, knowledge base articles, and customer responses. How can I assist you today?", // Updated initial message
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [contextData, setContextData] = useState("");
  const [topicPrompt, setTopicPrompt] = useState(""); // This will be for support content generation
  const [generatedContentIdeas, setGeneratedContentIdeas] = useState<SupportContent[]>([]); // Renamed from generatedContentIdeas
  const [approvedContentIdeas, setApprovedContentIdeas] = useState<SupportContent[]>([]); // Renamed from approvedContentIdeas
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false); // Renamed from isGeneratingTopics
  const [generatedCampaigns, setGeneratedCampaigns] = useState<Campaign[]>([]);
  const [isGeneratingCampaigns, setIsGeneratingCampaigns] = useState(false);
  const { toast } = useToast();

  const [selectedClient, setSelectedClient] = useState("")
  const [selectedNiche, setSelectedNiche] = useState("")
  const [clients, setClients] = useState<any[]>([
    { id: "client-a", name: "Client A", avatar: "/placeholder-user.jpg", industry: "Tech", satisfaction: 4.5, tier: "Premium" },
    { id: "client-b", name: "Client B", avatar: "/placeholder-user.jpg", industry: "Retail", satisfaction: 3.8, tier: "Standard" },
    { id: "client-c", name: "Client C", avatar: "/placeholder-user.jpg", industry: "Healthcare", satisfaction: 4.9, tier: "Enterprise" },
  ]);
  const [niches, setNiches] = useState<any[]>([
    { value: "Digital Marketing", label: "Digital Marketing", icon: "📊" },
    { value: "Technology", label: "Technology", icon: "💻" },
    { value: "Healthcare", label: "Healthcare", icon: "⚕️" },
    { value: "Finance", label: "Finance", icon: "💰" },
    { value: "Education", label: "Education", icon: "📚" },
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contentIdeas, setContentIdeas] = useState<SupportContent[]>([]); // Changed type to SupportContent
  const [marketingData, setMarketingData] = useState<MarketingDataPoint[]>([]);

  const filteredCampaigns = campaigns.filter(campaign => {
    return (!selectedClient || campaign.client === selectedClient) &&
           (!selectedNiche || campaign.niche === selectedNiche);
  });

  const filteredContentIdeas = contentIdeas.filter(idea => {
    return (!selectedClient || idea.client === selectedClient) &&
           (!selectedNiche || idea.niche === selectedNiche);
  });

  const filteredMarketingData = marketingData.filter(dataPoint => {
    return (!selectedClient || dataPoint.client === selectedClient) &&
           (!selectedNiche || dataPoint.niche === selectedNiche);
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && attachedFiles.length === 0) return

    const userMessage: ChatMessage = {
      id: `user-${chatMessages.length}-${Date.now()}`,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    }

    setChatMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setAttachedFiles([])
    setIsTyping(true)

    try {
      const response = await fetch("/api/support-chat", { // Updated API endpoint
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
        content: "Sorry, I'm having trouble connecting to the AI. Please try again later.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  const handleGenerateSupportContent = async () => { // Renamed from handleGenerateTopics
    if (!topicPrompt.trim()) return;

    setIsGeneratingTopics(true); // Keep this state name for now, will refactor later
    setGeneratedContentIdeas([]); // Clear previous content pieces

    try {
      const response = await fetch("/api/generate-support-content", { // Updated API endpoint
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
      const parsedContentPieces = data.supportContent.split('\n').map((line: string) => line.replace(/^\d+\.\s*/, '')).filter((line: string) => line.trim() !== '');
      const newContentIdeas: SupportContent[] = parsedContentPieces.map((piece: string) => ({
        id: `support-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: piece,
        type: "other", // Default type, can be refined later
        status: "draft", // Default status for support content
        priority: "medium", // Default priority, can be refined later
        client: selectedClient,
        niche: selectedNiche,
      }));
      setGeneratedContentIdeas(prev => [...prev, ...newContentIdeas]);
    } catch (error) {
      console.error("Error generating support content:", error);
      toast({
        title: "Error",
        description: "Failed to generate support content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTopics(false);
    }
  };

  const handleApproveIdea = (id: string) => {
    setGeneratedContentIdeas(prev => {
      const ideaToApprove = prev.find(idea => idea.id === id);
      if (ideaToApprove) {
        const updatedIdea: SupportContent = { ...ideaToApprove, status: "published" as const };
        setApprovedContentIdeas(approvedPrev => [...approvedPrev, updatedIdea]);
        toast({
          title: "Support Content Approved", // Updated toast message
          description: `"${ideaToApprove.title}" has been approved.`,
        });
        return prev.filter(idea => idea.id !== id);
      }
      return prev;
    });
  };

  const handleDeleteIdea = (id: string, section: "generated" | "approved") => {
    if (section === "generated") {
      setGeneratedContentIdeas(prev => {
        const ideaToDelete = prev.find(idea => idea.id === id);
        if (ideaToDelete) {
          toast({
            title: "Support Content Deleted", // Updated toast message
            description: `"${ideaToDelete.title}" has been deleted.`,
          });
          return prev.filter(idea => idea.id !== id);
        }
        return prev;
      });
    } else if (section === "approved") {
      setApprovedContentIdeas(prev => {
        const ideaToDelete = prev.find(idea => idea.id === id);
        if (ideaToDelete) {
          toast({
            title: "Support Content Deleted", // Updated toast message
            description: `"${ideaToDelete.title}" has been deleted from approved support content.`,
          });
          return prev.filter(idea => idea.id !== id);
        }
        return prev;
      });
    }
  };

  const handleFileUpload = (type: string) => {
    const fileName = `${type}-${Date.now()}.${type === "image" ? "jpg" : type === "video" ? "mp4" : "pdf"}`
    setAttachedFiles((prev) => [...prev, fileName])
    toast({
      title: "File Attached Successfully",
      description: `${fileName} has been attached to your message.`,
    })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      draft: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      completed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      new: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      "in-progress": "bg-orange-500/20 text-orange-300 border-orange-500/30",
      approved: "bg-green-500/20 text-green-300 border-green-500/30",
      published: "bg-green-500/20 text-green-300 border-green-500/30", // Added for support content
    }
    return colors[status as keyof typeof colors] || colors.active
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500/20 text-red-300 border-red-500/30",
      medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Cards - Adapted for Support */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Open Tickets</p>
                      <p className="text-2xl font-bold text-white">12</p> {/* Placeholder */}
                    </div>
                    <MessageSquare className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Avg. Response Time</p>
                      <p className="text-2xl font-bold text-white">2h 30m</p> {/* Placeholder */}
                    </div>
                    <Clock className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Knowledge Base Articles</p>
                      <p className="text-2xl font-bold text-white">{approvedContentIdeas.length}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Customer Satisfaction</p>
                      <p className="text-2xl font-bold text-white">92%</p> {/* Placeholder */}
                    </div>
                    <Star className="h-8 w-8 text-amber-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Support Performance Trends Chart - Placeholder for now */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <LineChart className="h-5 w-5 text-blue-400" />
                  <span>Support Performance Trends</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Monthly overview of ticket resolution and response times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center text-slate-400">
                  <p>Support performance chart coming soon!</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Support Content - Placeholder for now */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                  <span>Recent Support Interactions</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Overview of your latest support responses or knowledge base updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-400">Recent support content will appear here.</p>
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => onSectionChange?.("content-creation")}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Generate Support Content
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case "content-creation": // This section is now for generating support content
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">AI Support Content Generator</CardTitle>
                <CardDescription className="text-slate-400">Generate customer responses or knowledge base articles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Describe the support content you want to generate (e.g., 'a response for a refund request', 'an FAQ about product setup')..."
                  className="border-slate-600 bg-slate-900/50 text-white"
                  value={topicPrompt}
                  onChange={(e) => setTopicPrompt(e.target.value)}
                />
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={handleGenerateSupportContent}
                  disabled={isGeneratingTopics || !topicPrompt.trim()}
                >
                  {isGeneratingTopics ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <PenTool className="h-4 w-4 mr-2" />
                      Generate Support Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Generated Support Content</CardTitle>
                <CardDescription className="text-slate-400">Review and approve AI-suggested support content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generatedContentIdeas.length > 0 ? (
                    generatedContentIdeas.map((idea) => (
                      <Card key={idea.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <CardContent className="p-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white">{idea.title}</h4>
                            <Badge className={getStatusColor(idea.status)}>{idea.status}</Badge>
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
                              onClick={() => handleDeleteIdea(idea.id, "generated")}
                            >
                              <XCircle className="h-4 w-4 mr-2" /> Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-slate-400">No new support content. Generate some above!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Approved Support Content</CardTitle>
                <CardDescription className="text-slate-400">Content ready for publishing or customer use</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {approvedContentIdeas.length > 0 ? (
                    approvedContentIdeas.map((idea) => (
                      <Card key={idea.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <CardContent className="p-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white">{idea.title}</h4>
                            <Badge className={getStatusColor(idea.status)}>{idea.status}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                            <span>Type: {idea.type}</span>
                            <span>Priority: {idea.priority}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600"
                            onClick={() => handleDeleteIdea(idea.id, "approved")}
                          >
                            <XCircle className="h-4 w-4 mr-2" /> Delete
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-slate-400">No approved support content yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "campaign-configuration": // This section will be for Support specific configuration
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Support Configuration</CardTitle>
                <CardDescription className="text-slate-400">Configure AI module for support content generation</CardDescription>
              </CardHeader>
              <CardContent>
                <AgentForm department={department} onClose={onBack} />
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <MessageSquare className="h-5 w-5 text-emerald-400" /> {/* Updated icon */}
                <span>Support Center Section</span>
              </CardTitle>
              <CardDescription className="text-slate-400">This section is under development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="h-10 w-10 text-emerald-400" /> {/* Updated icon */}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  This section is under development. Stay tuned for exciting new features!
                </p>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Professional Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-xl shadow-lg"> {/* Updated colors */}
                  <MessageSquare className="h-5 w-5 text-white" /> {/* Updated icon */}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Support Center</h1> {/* Updated title */}
                  <p className="text-sm text-slate-400">AI-Powered Customer Support & Knowledge Base</p> {/* Updated description */}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="text-slate-300 bg-transparent border-slate-600 hover:bg-slate-700"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
              </Button>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-medium"> {/* Updated colors */}
                <Zap className="h-3 w-3 mr-1" />
                AI Enabled
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-medium">
                {approvedContentIdeas.length} Published Articles {/* Updated text */}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="text-slate-300 bg-transparent border-slate-600 hover:bg-slate-700"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Content Area */}
          <div className="flex-1 p-8 overflow-y-auto">{renderMainContent()}</div>

          {/* AI Assistant Panel */}
          <div className="w-96 bg-slate-900/95 backdrop-blur-md border-l border-slate-700/50 shadow-lg flex flex-col">
            {/* Client and Niche Selection */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="client-select-ai" className="text-sm font-medium text-slate-300 mb-2 block">
                    Select Client
                  </Label>
                  <Select value={selectedClient || ""} onValueChange={setSelectedClient}>
                    <SelectTrigger id="client-select-ai" className="h-11 border-slate-600 bg-slate-900/50 text-white focus:border-blue-400">
                      <SelectValue placeholder="Choose a client" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-600 bg-slate-800">
                      {clients.length === 0 ? (
                        <SelectItem value="no-clients" disabled>No clients available</SelectItem>
                      ) : (
                        clients.map((client) => (
                          <SelectItem key={client.id} value={client.name} className="py-3 text-white">
                            <div className="flex items-center space-x-3 w-full">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={client.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
                                  {client.name.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-medium text-white">{client.name}</div>
                                <div className="text-xs text-slate-400 flex items-center space-x-2">
                                  <span>{client.industry}</span>
                                  <span>•</span>
                                  <span className="flex items-center">
                                    <Star className="h-3 w-3 text-amber-400 mr-1" />
                                    {client.satisfaction}
                                  </span>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                                {client.tier}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="niche-select-ai" className="text-sm font-medium text-slate-300 mb-2 block">
                    Select Niche
                  </Label>
                  <Select value={selectedNiche || ""} onValueChange={setSelectedNiche}>
                    <SelectTrigger id="niche-select-ai" className="h-11 border-slate-600 bg-slate-900/50 text-white focus:border-blue-400">
                      <SelectValue placeholder="Select a niche" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-600 bg-slate-800">
                      {niches.length === 0 ? (
                        <SelectItem value="no-niches" disabled>No niches available</SelectItem>
                      ) : (
                        niches.map((niche) => (
                          <SelectItem key={niche.value} value={niche.value} className="py-2 text-white">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{niche.icon}</span>
                              <span className="font-medium">{niche.label}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {/* AI Assistant Header */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg"> {/* Updated colors */}
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Support Assistant</h3> {/* Updated title */}
                  <p className="text-sm text-slate-400">Your intelligent customer support partner</p> {/* Updated description */}
                </div>
              </div>
            </div>

            {/* Context Input */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="context-data" className="text-sm font-medium text-slate-300 mb-2 block">
                    Support Brief
                  </Label>
                  <Textarea
                    id="context-data"
                    value={contextData}
                    onChange={(e) => setContextData(e.target.value)}
                    placeholder="Customer issue, product details, desired tone..."
                    className="min-h-[80px] border-slate-600 bg-slate-900/50 text-white focus:border-blue-400 resize-none text-sm"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-2 block">Attach Files</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: "document", label: "Doc", icon: FileText },
                      { type: "image", label: "Image", icon: ImageIcon },
                      { type: "video", label: "Video", icon: Video },
                    ].map((item) => (
                      <Button
                        key={item.type}
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileUpload(item.type)}
                        className="flex flex-col items-center p-3 h-auto border-slate-600 hover:border-blue-400 hover:bg-blue-500/20 bg-transparent text-slate-300"
                      >
                        <item.icon className="h-4 w-4 mb-1 text-slate-400" />
                        <span className="text-xs font-medium">{item.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {attachedFiles.length > 0 && (
                  <div className="space-y-2">
                    {attachedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg border border-slate-700"
                      >
                        <div className="flex items-center space-x-2">
                          <Paperclip className="h-3 w-3 text-slate-500" />
                          <span className="text-xs text-slate-300 font-medium">{file}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== index))}
                          className="h-5 w-5 p-0 text-slate-400 hover:text-red-400"
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex items-start space-x-3 max-w-[85%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      <Avatar className="h-7 w-7 flex-shrink-0">
                        {message.type === "user" ? (
                          <AvatarFallback className="bg-blue-600 text-white text-xs">
                            <User className="h-3 w-3" />
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-500 text-white text-xs"> {/* Updated colors */}
                            <Bot className="h-3 w-3" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div
                        className={`p-3 rounded-xl text-sm ${
                          message.type === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800/50 text-slate-300 border border-slate-700"
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        {message.attachments && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((file, index) => (
                              <div
                                key={index}
                                className={`text-xs flex items-center space-x-1 ${
                                  message.type === "user" ? "text-blue-200" : "text-slate-500"
                                }`}
                              >
                                <Paperclip className="h-3 w-3" />
                                <span>{file}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className={`text-xs mt-2 ${message.type === "user" ? "text-blue-200" : "text-slate-500"}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-500 text-white"> {/* Updated colors */}
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-6 border-t border-slate-700/50">
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Describe your support requirements..."
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    className="flex-1 border-slate-600 bg-slate-900/50 text-white focus:border-blue-400 text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() && attachedFiles.length === 0 || isTyping}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 px-4"> {/* Updated colors */}
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}