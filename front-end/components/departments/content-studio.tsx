"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Send,
  Bot,
  User,
  FileText,
  ImageIcon,
  Video,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Share2,
  Sparkles,
  Target,
  RotateCcw,
  Building2,
  Zap,
  Star,
  Calendar,
  Search,
  Paperclip,
  AlertCircle,
  TrendingUp,
  Bell,
  Activity,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContentStudioProps {
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

interface ContentResult {
  id: string
  type: "text" | "image" | "video" | "social" | "email" | "blog"
  title: string
  content: string
  status: "pending" | "approved" | "rejected" | "revision" | "in-review"
  createdAt: Date
  client: string
  niche: string
  assignee?: string
  priority: "low" | "medium" | "high"
  wordCount?: number
  estimatedTime?: string
}

export default function ContentStudio({
  onBack,
  department,
  activeSection = "workspace",
  onSectionChange,
}: ContentStudioProps) {
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedNiche, setSelectedNiche] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Welcome to OmniDesk Content Studio! I'm your AI Content Strategist. To create exceptional content that resonates with your audience, please select your client and target niche. I'll then provide personalized recommendations and generate content that aligns with your brand guidelines and objectives.",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<string[]>([])
  const [contextData, setContextData] = useState("")
  const [contentResults, setContentResults] = useState<ContentResult[]>([
    {
      id: "1",
      type: "social",
      title: "LinkedIn Thought Leadership Post",
      content:
        "🚀 The future of business lies in intelligent automation. At TechCorp, we're not just adapting to change—we're driving it. Our latest AI solutions have helped 500+ companies transform their operations, resulting in 40% efficiency gains and $2M+ in cost savings. Ready to lead the digital revolution? #Innovation #AI #BusinessTransformation",
      status: "pending",
      createdAt: new Date(),
      client: "TechCorp Inc.",
      niche: "Technology",
      assignee: "Sarah Chen",
      priority: "high",
      wordCount: 67,
      estimatedTime: "2 min read",
    },
    {
      id: "2",
      type: "blog",
      title: "The Complete Guide to Digital Transformation",
      content:
        "In today's rapidly evolving business landscape, digital transformation isn't just an option—it's a necessity. Organizations that embrace digital innovation are 23% more profitable than their competitors. This comprehensive guide explores proven strategies, real-world case studies, and actionable insights to help your business thrive in the digital age...",
      status: "approved",
      createdAt: new Date(),
      client: "StartupXYZ",
      niche: "Business Consulting",
      assignee: "Mike Johnson",
      priority: "medium",
      wordCount: 1250,
      estimatedTime: "5 min read",
    },
    {
      id: "3",
      type: "email",
      title: "Product Launch Announcement Email",
      content:
        "Subject: Introducing Revolutionary Healthcare Solutions 🏥\n\nDear [Name],\n\nWe're excited to announce the launch of our groundbreaking healthcare platform that's already transforming patient care across 200+ facilities. With 99.9% uptime and HIPAA compliance, we're setting new standards in healthcare technology...",
      status: "in-review",
      createdAt: new Date(),
      client: "HealthPlus",
      niche: "Healthcare",
      assignee: "Lisa Wang",
      priority: "high",
      wordCount: 180,
      estimatedTime: "1 min read",
    },
  ])
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

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

    setTimeout(() => {
      const selectedClientData = clients.find((c) => c.name === selectedClient)
      const selectedNicheData = niches.find((n) => n.value === selectedNiche)

      const aiResponse: ChatMessage = {
        id: `ai-${chatMessages.length}-${Date.now()}`,
        type: "ai",
        content: `Excellent! I'm analyzing your request for ${selectedClientData?.name || "your client"} in the ${selectedNicheData?.label || "selected niche"} sector. Based on their ${selectedClientData?.tier} tier status and ${selectedClientData?.satisfaction}/5 satisfaction rating, I'm crafting content that aligns with their brand voice and audience preferences.

Key considerations for this content:
• Target audience engagement patterns
• Industry-specific terminology and trends  
• Brand voice consistency
• SEO optimization opportunities
• Conversion-focused messaging

Your content will be ready for review in the workspace. I've optimized it for maximum impact and engagement.`,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)

      const contentTypeOptions = ["blog", "social", "email", "video"]
      const randomType = contentTypeOptions[0]

      const newResult: ContentResult = {
        id: `content-${contentResults.length}-${Date.now()}`,
        type: randomType as any,
        title: `AI-Generated ${randomType.charAt(0).toUpperCase() + randomType.slice(1)} Content`,
        content: generateSampleContent(randomType, selectedClient, selectedNiche, inputMessage),
        status: "pending",
        createdAt: new Date(),
        client: selectedClient || "Selected Client",
        niche: selectedNicheData?.label || "Selected Niche",
        assignee: "AI Assistant",
        priority: "medium",
        wordCount: 300,
        estimatedTime: `3 min read`,
      }
      setContentResults((prev) => [newResult, ...prev])

      toast({
        title: "Content Generated Successfully",
        description: "Your AI-generated content is ready for review in the workspace.",
      })
    }, 2500)
  }

  const generateSampleContent = (type: string, client: string, niche: string, request: string) => {
    const templates = {
      blog: `# ${request}\n\nIn today's competitive ${niche} landscape, ${client} stands at the forefront of innovation. This comprehensive analysis explores key trends, strategic insights, and actionable recommendations that drive measurable results.\n\n## Key Insights\n- Industry-leading practices\n- Data-driven strategies\n- Future-focused solutions\n\n*This content has been optimized for SEO and engagement.*`,
      social: `🚀 ${request}\n\n${client} is revolutionizing the ${niche} industry with cutting-edge solutions that deliver real results. Join thousands of satisfied customers who've already transformed their business.\n\n✨ Key benefits:\n• Increased efficiency\n• Cost optimization\n• Scalable growth\n\n#Innovation #${niche.replace(/\s+/g, "")} #BusinessGrowth`,
      email: `Subject: ${request} - Exclusive Insights from ${client}\n\nDear [Name],\n\nWe're excited to share exclusive insights about ${request} that are transforming the ${niche} industry. Our latest research reveals breakthrough strategies that leading companies are using to stay ahead.\n\nBest regards,\nThe ${client} Team`,
      video: `[SCENE 1: Opening Hook]\n"${request}" - This question is reshaping the ${niche} industry.\n\n[SCENE 2: Problem Statement]\nAt ${client}, we understand the challenges you face...\n\n[SCENE 3: Solution]\nOur innovative approach delivers...\n\n[SCENE 4: Call to Action]\nReady to transform your business? Contact us today.`,
    }
    return (
      templates[type as keyof typeof templates] ||
      `Generated content for ${request} targeting ${niche} audience for ${client}.`
    )
  }

  const handleFileUpload = (type: string) => {
    const fileName = `${type}-${Date.now()}.${type === "image" ? "jpg" : type === "video" ? "mp4" : "pdf"}`
    setAttachedFiles((prev) => [...prev, fileName])
    toast({
      title: "File Attached Successfully",
      description: `${fileName} has been attached to your message.`,
    })
  }

  const handleContentAction = (contentId: string, action: "approve" | "reject" | "revision" | "in-review") => {
    setContentResults((prev) =>
      prev.map((result) =>
        result.id === contentId
          ? {
              ...result,
              status: action as any,
              assignee: action === "approve" ? "Approved" : action === "reject" ? "Rejected" : result.assignee,
            }
          : result,
      ),
    )

    const actionMessages = {
      approve: "Content approved and ready for publication",
      reject: "Content rejected and moved to drafts",
      revision: "Content sent back for revision",
      "in-review": "Content moved to review queue",
    }

    toast({
      title: `Content ${action.charAt(0).toUpperCase() + action.slice(1)}d`,
      description: actionMessages[action],
    })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      approved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      rejected: "bg-red-500/20 text-red-300 border-red-500/30",
      revision: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      "in-review": "bg-blue-500/20 text-blue-300 border-blue-500/30",
      pending: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      approved: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
      revision: <RotateCcw className="h-4 w-4" />,
      "in-review": <Eye className="h-4 w-4" />,
      pending: <Clock className="h-4 w-4" />,
    }
    return icons[status as keyof typeof icons] || icons.pending
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500/20 text-red-300 border-red-500/30",
      medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  const getContentTypeIcon = (type: string) => {
    const icons = {
      blog: <FileText className="h-4 w-4" />,
      social: <Share2 className="h-4 w-4" />,
      email: <MessageSquare className="h-4 w-4" />,
      video: <Video className="h-4 w-4" />,
      image: <ImageIcon className="h-4 w-4" />,
      text: <FileText className="h-4 w-4" />,
    }
    return icons[type as keyof typeof icons] || icons.text
  }

  const filteredResults = contentResults.filter((result) => {
    const matchesStatus = filterStatus === "all" || result.status === filterStatus
    const matchesSearch =
      searchQuery === "" ||
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Total Content</p>
                      <p className="text-3xl font-bold text-white">{contentResults.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Pending Approval</p>
                      <p className="text-3xl font-bold text-white">
                        {contentResults.filter((r) => r.status === "pending").length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-amber-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Approved Content</p>
                      <p className="text-3xl font-bold text-white">
                        {contentResults.filter((r) => r.status === "approved").length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Active Clients</p>
                      <p className="text-3xl font-bold text-white">{clients.length}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Activity className="h-5 w-5 text-indigo-400" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Latest updates and content changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentResults.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        {getContentTypeIcon(item.type)}
                        <div>
                          <p className="font-medium text-white">{item.title}</p>
                          <p className="text-sm text-slate-400">
                            {item.client} • {item.assignee}
                          </p>
                        </div>
                      </div>
                      <div className="ml-auto flex items-center space-x-2">
                        <Badge variant="outline" className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <span className="text-sm text-slate-500">{item.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "workspace":
        return (
          <div className="space-y-6">
            {/* Project Configuration */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Building2 className="h-5 w-5 text-indigo-400" />
                  <span>Project Configuration</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure client parameters and content strategy
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="client-select" className="text-sm font-medium text-slate-300 mb-2 block">
                    Client Selection
                  </Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger className="h-11 border-slate-600 bg-slate-900/50 text-white focus:border-indigo-400">
                      <SelectValue placeholder="Choose your client" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-600 bg-slate-800">
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.name} className="py-3 text-white">
                          <div className="flex items-center space-x-3 w-full">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={client.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-indigo-600 text-white text-xs font-medium">
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
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="niche-select" className="text-sm font-medium text-slate-300 mb-2 block">
                    Target Niche
                  </Label>
                  <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                    <SelectTrigger className="h-11 border-slate-600 bg-slate-900/50 text-white focus:border-indigo-400">
                      <SelectValue placeholder="Select content niche" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-600 bg-slate-800">
                      {niches.map((niche) => (
                        <SelectItem key={niche.value} value={niche.value} className="py-2 text-white">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{niche.icon}</span>
                            <span className="font-medium">{niche.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Content Results */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <TrendingUp className="h-5 w-5 text-indigo-400" />
                      <span>Generated Content</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      AI-generated content ready for review and optimization
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 h-9 border-slate-600 bg-slate-900/50 text-white"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40 h-9 border-slate-600 bg-slate-900/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-slate-600 bg-slate-800">
                        <SelectItem value="all" className="text-white">
                          All Status
                        </SelectItem>
                        <SelectItem value="pending" className="text-white">
                          Pending
                        </SelectItem>
                        <SelectItem value="approved" className="text-white">
                          Approved
                        </SelectItem>
                        <SelectItem value="in-review" className="text-white">
                          In Review
                        </SelectItem>
                        <SelectItem value="revision" className="text-white">
                          Revision
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {filteredResults.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Bot className="h-10 w-10 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Ready to Create Amazing Content</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                      Configure your project settings and start a conversation with our AI Content Strategist to
                      generate professional content.
                    </p>
                  </div>
                ) : (
                  filteredResults.map((result) => (
                    <div key={result.id} className="border border-slate-700 rounded-xl p-6 bg-slate-900/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="flex items-center space-x-2">
                              {getContentTypeIcon(result.type)}
                              <h3 className="font-semibold text-white text-lg">{result.title}</h3>
                            </div>
                            <Badge variant="outline" className={getStatusColor(result.status)}>
                              {getStatusIcon(result.status)}
                              <span className="ml-1 capitalize">{result.status.replace("-", " ")}</span>
                            </Badge>
                            <Badge className={getPriorityColor(result.priority)} variant="secondary">
                              {result.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-slate-400 mb-4">
                            <span className="flex items-center space-x-1">
                              <Building2 className="h-4 w-4" />
                              <span className="font-medium">{result.client}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Target className="h-4 w-4" />
                              <span>{result.niche}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{result.assignee}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{result.createdAt.toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700 mb-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span>{result.wordCount} words</span>
                            <span>•</span>
                            <span>{result.estimatedTime}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 text-slate-400 hover:text-white">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{result.content}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContentAction(result.id, "approve")}
                            className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContentAction(result.id, "in-review")}
                            className="text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContentAction(result.id, "revision")}
                            className="text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Revise
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContentAction(result.id, "reject")}
                            className="text-red-400 border-red-500/30 hover:bg-red-500/20"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <span>Content Studio Section</span>
              </CardTitle>
              <CardDescription className="text-slate-400">This section is under development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <div className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-indigo-400" />
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
                <div className="p-2.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Content Studio</h1>
                  <p className="text-sm text-slate-400">AI-Powered Content Creation & Workflow Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-medium">
                <Zap className="h-3 w-3 mr-1" />
                AI Enabled
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-medium">
                {contentResults.filter((r) => r.status === "pending").length} Pending Review
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
            {/* AI Assistant Header */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Content Strategist</h3>
                  <p className="text-sm text-slate-400">Your intelligent content assistant</p>
                </div>
              </div>
            </div>

            {/* Context Input */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="context-data" className="text-sm font-medium text-slate-300 mb-2 block">
                    Content Brief
                  </Label>
                  <Textarea
                    id="context-data"
                    value={contextData}
                    onChange={(e) => setContextData(e.target.value)}
                    placeholder="Brand guidelines, target audience insights, campaign objectives..."
                    className="min-h-[80px] border-slate-600 bg-slate-900/50 text-white focus:border-purple-400 resize-none text-sm"
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
                        className="flex flex-col items-center p-3 h-auto border-slate-600 hover:border-purple-400 hover:bg-purple-500/20 bg-transparent text-slate-300"
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
                          <AvatarFallback className="bg-indigo-600 text-white text-xs">
                            <User className="h-3 w-3" />
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
                            <Bot className="h-3 w-3" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div
                        className={`p-3 rounded-xl text-sm ${
                          message.type === "user"
                            ? "bg-indigo-600 text-white"
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
                                  message.type === "user" ? "text-indigo-200" : "text-slate-500"
                                }`}
                              >
                                <Paperclip className="h-3 w-3" />
                                <span>{file}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className={`text-xs mt-2 ${message.type === "user" ? "text-indigo-200" : "text-slate-500"}`}>
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
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
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
                    placeholder="Describe your content requirements..."
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    className="flex-1 border-slate-600 bg-slate-900/50 text-white focus:border-indigo-400 text-sm"
                    disabled={!selectedClient || !selectedNiche}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      (!inputMessage.trim() && attachedFiles.length === 0) ||
                      isTyping ||
                      !selectedClient ||
                      !selectedNiche
                    }
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {(!selectedClient || !selectedNiche) && (
                  <div className="flex items-center space-x-2 text-xs text-amber-400 bg-amber-500/20 p-2 rounded-lg border border-amber-500/30">
                    <AlertCircle className="h-3 w-3" />
                    <span>Please configure your project to enable AI assistance</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
