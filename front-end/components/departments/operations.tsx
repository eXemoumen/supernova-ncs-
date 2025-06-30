"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Settings,
  Truck,
  Factory,
  MessageSquare,
  ClipboardCheck,
  Wrench,
  Zap,
  Bell,
  Activity,
  PlusCircle,
  Bot,
  Send,
  Paperclip,
  AlertCircle,
  Clock,
  Eye,
  Download,
  RotateCcw,
  CheckCircle,
  XCircle,
  Layout,
  Briefcase,
  BookOpen,
  Shield,
  Archive,
  Users,
  Search,
  Calendar,
  User,
  Building2,
} from "lucide-react"
import { DepartmentChatbot } from "@/components/department-chatbot"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface OperationsProps {
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

interface Process {
  id: number
  name: string
  status: "active" | "monitoring" | "completed"
  efficiency: number
  lastUpdated: string
}

interface OptimizationSuggestion {
  id: number
  message: string
  impact: string
}

export default function Operations({
  onBack,
  department,
  activeSection = "dashboard",
  onSectionChange,
}: OperationsProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Welcome to OmniDesk Operations Hub! I'm your AI Operations Manager. I can help you with process optimization, logistics, and resource management. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<string[]>([])
  const [contextData, setContextData] = useState("")
  const { toast } = useToast()

  const processes: Process[] = [
    { id: 1, name: "Order Fulfillment", status: "active", efficiency: 95, lastUpdated: "2 days ago" },
    { id: 2, name: "Supply Chain Management", status: "monitoring", efficiency: 88, lastUpdated: "1 day ago" },
    { id: 3, name: "Quality Control", status: "active", efficiency: 98, lastUpdated: "5 hours ago" },
    { id: 4, name: "Inventory Management", status: "monitoring", efficiency: 92, lastUpdated: "3 days ago" },
  ]

  const optimizationSuggestions: OptimizationSuggestion[] = [
    { id: 1, message: "Automate invoice processing for 15% efficiency gain", impact: "Time Savings" },
    { id: 2, message: "Optimize warehouse layout for faster picking", impact: "Cost Reduction" },
    { id: 3, message: "Implement predictive maintenance for key machinery", impact: "Reduced Downtime" },
  ]

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
      const aiResponse: ChatMessage = {
        id: `ai-${chatMessages.length}-${Date.now()}`,
        type: "ai",
        content: `I've received your operations query: "${userMessage.content}". I'm processing your request and will provide a detailed response shortly.`, // Placeholder AI response
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleFileUpload = (type: string) => {
    const fileName = `${type}-${Date.now()}.${type === "image" ? "jpg" : type === "video" ? "mp4" : "pdf"}`
    setAttachedFiles((prev) => [...prev, fileName])
    toast({
      title: "File Attached Successfully",
      description: `${fileName} has been attached to your message.`,
    })
  }

  const getProcessStatusColor = (status: string) => {
    const colors = {
      active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      monitoring: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      completed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    }
    return colors[status as keyof typeof colors] || colors.active
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
                      <p className="text-sm text-slate-400">Active Processes</p>
                      <p className="text-2xl font-bold text-white">{processes.filter(p => p.status === 'active' || p.status === 'monitoring').length}</p>
                    </div>
                    <Settings className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Deliveries On-Time</p>
                      <p className="text-2xl font-bold text-white">98%</p>
                    </div>
                    <Truck className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Production Output</p>
                      <p className="text-2xl font-bold text-white">1.2M Units</p>
                    </div>
                    <Factory className="h-8 w-8 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Maintenance Tickets</p>
                      <p className="text-2xl font-bold text-white">3</p>
                    </div>
                    <Wrench className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Processes */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-orange-400" />
                  <span>Recent Processes</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Overview of your latest operational processes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processes.slice(0, 5).map((process) => (
                    <div key={process.id} className="p-4 border border-slate-700 rounded-lg bg-slate-900/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">{process.name}</h3>
                        <Badge className={getProcessStatusColor(process.status)}>
                          {process.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Efficiency: {process.efficiency}%</span>
                        <span>Last Updated: {process.lastUpdated}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700" onClick={() => onSectionChange?.("process-management")}>
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  View All Processes
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case "process-management":
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Process Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Monitor and optimize your operational processes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processes.map((process) => (
                    <div key={process.id} className="p-4 border border-slate-700 rounded-lg bg-slate-900/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">{process.name}</h3>
                        <Badge
                          className={getProcessStatusColor(process.status)}
                        >
                          {process.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Efficiency: {process.efficiency}%</span>
                        <span>Last Updated: {process.lastUpdated}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "process-optimization":
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">AI Process Optimizer</CardTitle>
                <CardDescription className="text-slate-400">Identify bottlenecks and suggest improvements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Describe a process..."
                  className="border-slate-600 bg-slate-900/50 text-white"
                />
                <Textarea
                  placeholder="Enter process details for optimization..."
                  className="border-slate-600 bg-slate-900/50 text-white"
                />
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Settings className="h-4 w-4 mr-2" />
                  Analyze Process
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Optimization Suggestions</CardTitle>
                <CardDescription className="text-slate-400">AI-powered recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {optimizationSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-3 bg-slate-900/50 rounded-lg text-sm text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>{suggestion.message}</span>
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                          {suggestion.impact}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Settings className="h-5 w-5 text-orange-400" />
                <span>Operations Hub Section</span>
              </CardTitle>
              <CardDescription className="text-slate-400">This section is under development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <div className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Settings className="h-10 w-10 text-orange-400" />
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
                <div className="p-2.5 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-xl shadow-lg">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Operations Hub</h1>
                  <p className="text-sm text-slate-400">AI-Powered Process Optimization & Logistics</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 font-medium">
                <Zap className="h-3 w-3 mr-1" />
                AI Enabled
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-medium">
                {processes.filter(p => p.status === 'active').length} Active Processes
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
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Operations Manager</h3>
                  <p className="text-sm text-slate-400">Your intelligent operations assistant</p>
                </div>
              </div>
            </div>

            {/* Context Input */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="context-data" className="text-sm font-medium text-slate-300 mb-2 block">
                    Operations Brief
                  </Label>
                  <Textarea
                    id="context-data"
                    value={contextData}
                    onChange={(e) => setContextData(e.target.value)}
                    placeholder="Process details, logistics challenges, resource allocation..."
                    className="min-h-[80px] border-slate-600 bg-slate-900/50 text-white focus:border-orange-400 resize-none text-sm"
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
                        className="flex flex-col items-center p-3 h-auto border-slate-600 hover:border-orange-400 hover:bg-orange-500/20 bg-transparent text-slate-300"
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
                          <AvatarFallback className="bg-orange-600 text-white text-xs">
                            <User className="h-3 w-3" />
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs">
                            <Bot className="h-3 w-3" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div
                        className={`p-3 rounded-xl text-sm ${
                          message.type === "user"
                            ? "bg-orange-600 text-white"
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
                                  message.type === "user" ? "text-orange-200" : "text-slate-500"
                                }`}
                              >
                                <Paperclip className="h-3 w-3" />
                                <span>{file}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className={`text-xs mt-2 ${message.type === "user" ? "text-orange-200" : "text-slate-500"}`}>
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
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
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
                    placeholder="Describe your operations query..."
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    className="flex-1 border-slate-600 bg-slate-900/50 text-white focus:border-orange-400 text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() && attachedFiles.length === 0 || isTyping}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-4"
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
