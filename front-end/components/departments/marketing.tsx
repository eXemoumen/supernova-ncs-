"use client"

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
} from "lucide-react"

import { DepartmentChatbot } from "@/components/department-chatbot"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AgentForm } from "@/components/agent-form"

interface MarketingProps {
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

interface ContentIdea {
  id: number
  title: string
  type: "blog" | "social" | "email" | "video"
  status: "new" | "in-progress" | "approved"
  priority: "low" | "medium" | "high"
  client: string
  niche: string
}

interface MarketingDataPoint {
  month: string
  revenue: number
  spend: number
  roi: number
  client: string
  niche: string
}

export default function Marketing({
  onBack,
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
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<string[]>([])
  const [contextData, setContextData] = useState("")
  const { toast } = useToast()

  const [selectedClient, setSelectedClient] = useState("")
  const [selectedNiche, setSelectedNiche] = useState("")
  const [clients, setClients] = useState<any[]>([]);
  const [niches, setNiches] = useState<any[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingNiches, setLoadingNiches] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const response = await fetch("/api/clients");
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoadingClients(false);
      }
    };

    const fetchNiches = async () => {
      setLoadingNiches(true);
      try {
        const response = await fetch("/api/niches");
        const data = await response.json();
        setNiches(data);
      } catch (error) {
        console.error("Error fetching niches:", error);
      } finally {
        setLoadingNiches(false);
      }
    };

    fetchClients();
    fetchNiches();
  }, []);

  const campaigns: Campaign[] = [
    { id: 1, name: "Summer Sale 2024", status: "active", performance: 85, budget: "$5,000", startDate: "2024-07-01", endDate: "2024-07-31", targetAudience: "Young Adults", channels: ["Social Media", "Email"], roi: 150, client: "Client A", niche: "Digital Marketing" },
    { id: 2, name: "Product Launch", status: "draft", performance: 0, budget: "$8,000", startDate: "2024-08-15", endDate: "2024-09-15", targetAudience: "Tech Enthusiasts", channels: ["Website", "PR"], roi: 0, client: "Client B", niche: "Technology" },
    { id: 3, name: "Brand Awareness", status: "completed", performance: 92, budget: "$3,500", startDate: "2024-05-01", endDate: "2024-05-31", targetAudience: "General Public", channels: ["Display Ads", "Content Marketing"], roi: 120, client: "Client A", niche: "Digital Marketing" },
  ]

  const contentIdeas: ContentIdea[] = [
    { id: 1, title: "10 Tips for Better Productivity", type: "blog", status: "new", priority: "medium", client: "Client A", niche: "Digital Marketing" },
    { id: 2, title: "Industry Trends Report 2024", type: "email", status: "in-progress", priority: "high", client: "Client B", niche: "Technology" },
    { id: 3, title: "Customer Success Stories", type: "social", status: "approved", priority: "low", client: "Client A", niche: "Digital Marketing" },
    { id: 4, title: "Behind the Scenes Content", type: "video", status: "new", priority: "medium", client: "Client C", niche: "Healthcare" },
  ]

  const marketingData: MarketingDataPoint[] = [
    { month: "Jan", revenue: 65000, spend: 25000, roi: 160, client: "Client A", niche: "Digital Marketing" },
    { month: "Feb", revenue: 70000, spend: 28000, roi: 150, client: "Client A", niche: "Digital Marketing" },
    { month: "Mar", revenue: 75000, spend: 30000, roi: 150, client: "Client B", niche: "Technology" },
    { month: "Apr", revenue: 80000, spend: 32000, roi: 150, client: "Client B", niche: "Technology" },
    { month: "May", revenue: 85000, spend: 34000, roi: 150, client: "Client A", niche: "Digital Marketing" },
    { month: "Jun", revenue: 90000, spend: 36000, roi: 150, client: "Client C", niche: "Healthcare" },
  ]

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
      const response = await fetch("/api/gemini-chat", {
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Active Campaigns</p>
                      <p className="text-2xl font-bold text-white">{filteredCampaigns.filter(c => c.status === 'active').length}</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Total ROI</p>
                      <p className="text-2xl font-bold text-white">{filteredCampaigns.reduce((sum, c) => sum + c.roi, 0)}%</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Engagement Rate</p>
                      <p className="text-2xl font-bold text-white">4.2%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Content Ideas</p>
                      <p className="text-2xl font-bold text-white">{filteredContentIdeas.length}</p>
                    </div>
                    <PenTool className="h-8 w-8 text-amber-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign Performance Trends Chart */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <LineChart className="h-5 w-5 text-blue-400" />
                  <span>Marketing Performance Trends</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Monthly overview of revenue, spend, and ROI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={filteredMarketingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} name="Revenue" />
                      <Line type="monotone" dataKey="spend" stroke="#EF4444" strokeWidth={3} name="Spend" />
                      <Line type="monotone" dataKey="roi" stroke="#10B981" strokeWidth={3} name="ROI" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Campaigns */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  <span>Recent Campaigns</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Overview of your latest marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCampaigns.map((campaign) => (
                    <div key={campaign.id} className="p-4 border border-slate-700 rounded-lg bg-slate-900/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">{campaign.name}</h3>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Performance: {campaign.performance}%</span>
                        <span>Budget: {campaign.budget}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => onSectionChange?.("campaign-management")}>
                  <Target className="h-4 w-4 mr-2" />
                  View All Campaigns
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case "campaign-management":
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Campaign Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage and monitor your marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCampaigns.map((campaign) => (
                    <div key={campaign.id} className="p-4 border border-slate-700 rounded-lg bg-slate-900/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">{campaign.name}</h3>
                        <Badge
                          className={getStatusColor(campaign.status)}
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Performance: {campaign.performance}%</span>
                        <span>Budget: {campaign.budget}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400 mt-2">
                        <span>Start: {campaign.startDate}</span>
                        <span>End: {campaign.endDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400 mt-2">
                        <span>Audience: {campaign.targetAudience}</span>
                        <span>Channels: {campaign.channels.join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  <Target className="h-4 w-4 mr-2" />
                  Create New Campaign
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case "content-creation":
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">AI Content Generator</CardTitle>
                <CardDescription className="text-slate-400">Generate content ideas and copy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter topic or keyword..."
                  className="border-slate-600 bg-slate-900/50 text-white"
                />
                <Textarea
                  placeholder="Describe your content requirements..."
                  className="border-slate-600 bg-slate-900/50 text-white"
                />
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <PenTool className="h-4 w-4 mr-2" />
                  Generate Content
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Content Ideas</CardTitle>
                <CardDescription className="text-slate-400">AI-suggested content topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredContentIdeas.map((idea, index) => (
                    <div key={idea.id} className="p-3 bg-slate-900/50 rounded-lg text-sm text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>{idea.title}</span>
                        <Badge className={getStatusColor(idea.status)}>{idea.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                        <span>Type: {idea.type}</span>
                        <span>Priority: {idea.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "campaign-configuration":
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Campaign Configuration</CardTitle>
                <CardDescription className="text-slate-400">Configure AI module for marketing campaigns</CardDescription>
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
                <BarChart3 className="h-5 w-5 text-blue-400" />
                <span>Marketing Hub Section</span>
              </CardTitle>
              <CardDescription className="text-slate-400">This section is under development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-10 w-10 text-blue-400" />
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
                <div className="p-2.5 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-xl shadow-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Marketing Hub</h1>
                  <p className="text-sm text-slate-400">AI-Powered Campaign Management & Content Creation</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-medium">
                <Zap className="h-3 w-3 mr-1" />
                AI Enabled
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-medium">
                {campaigns.filter(c => c.status === 'active').length} Active Campaigns
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
                      {loadingClients ? (
                        <SelectItem value="loading" disabled>Loading clients...</SelectItem>
                      ) : clients.length === 0 ? (
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
                      {loadingNiches ? (
                        <SelectItem value="loading" disabled>Loading niches...</SelectItem>
                      ) : niches.length === 0 ? (
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
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Marketing Strategist</h3>
                  <p className="text-sm text-slate-400">Your intelligent marketing assistant</p>
                </div>
              </div>
            </div>

            {/* Context Input */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="context-data" className="text-sm font-medium text-slate-300 mb-2 block">
                    Marketing Brief
                  </Label>
                  <Textarea
                    id="context-data"
                    value={contextData}
                    onChange={(e) => setContextData(e.target.value)}
                    placeholder="Campaign goals, target audience, brand guidelines..."
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
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
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
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
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
                    placeholder="Describe your marketing requirements..."
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    className="flex-1 border-slate-600 bg-slate-900/50 text-white focus:border-blue-400 text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() && attachedFiles.length === 0 || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-4"
                  >
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
