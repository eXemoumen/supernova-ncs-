"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Zap,
  Bell,
  Activity,
  Bot,
  Send,
  Paperclip,
  Eye,
  Download,
  RotateCcw,
  User,
  Layout,
  Briefcase,
  BookOpen,
  Shield,
  Archive,
  Users,
  Calendar,
  Building2,
  ClipboardCheck,
  FileText,
  ImageIcon,
  Video,
  XCircle
} from "lucide-react"
import { DepartmentChatbot } from "@/components/department-chatbot"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface SupportProps {
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

interface Ticket {
  id: string
  customer: string
  issue: string
  priority: "high" | "medium" | "low"
  status: "open" | "in-progress" | "resolved"
  time: string
  description: string
}

export default function Support({
  onBack,
  department,
  activeSection = "dashboard",
  onSectionChange,
}: SupportProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Welcome to OmniDesk Support Center! I'm your AI Support Assistant. I can help you with ticket management, customer inquiries, and knowledge base management. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<string[]>([])
  const [contextData, setContextData] = useState("")
  const { toast } = useToast()

  const tickets: Ticket[] = [
    { id: "#T001", customer: "John Doe", issue: "Login Issues", priority: "high", status: "open", time: "2h ago", description: "Customer unable to log in after password reset." },
    { id: "#T002", customer: "Jane Smith", issue: "Payment Problem", priority: "medium", status: "in-progress", time: "4h ago", description: "Recurring payment failed for subscription." },
    { id: "#T003", customer: "Bob Wilson", issue: "Feature Request", priority: "low", status: "resolved", time: "1d ago", description: "Request for new reporting feature." },
    { id: "#T004", customer: "Alice Brown", issue: "Account Suspension", priority: "high", status: "open", time: "1h ago", description: "Account suspended due to suspicious activity." },
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
        content: `I've received your support query: "${userMessage.content}". I'm processing your request and will provide a detailed response shortly.`, // Placeholder AI response
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

  const getTicketPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500/20 text-red-300 border-red-500/30",
      medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      low: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  const getTicketStatusColor = (status: string) => {
    const colors = {
      open: "bg-red-500/20 text-red-300 border-red-500/30",
      "in-progress": "bg-amber-500/20 text-amber-300 border-amber-500/30",
      resolved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    }
    return colors[status as keyof typeof colors] || colors.open
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
                      <p className="text-sm text-slate-400">Open Tickets</p>
                      <p className="text-2xl font-bold text-white">{tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Resolved Today</p>
                      <p className="text-2xl font-bold text-white">{tickets.filter(t => t.status === 'resolved').length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Avg Response</p>
                      <p className="text-2xl font-bold text-white">12m</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Satisfaction</p>
                      <p className="text-2xl font-bold text-white">4.8/5</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Tickets */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-emerald-400" />
                  <span>Recent Tickets</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Overview of your latest customer support tickets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="p-4 border border-slate-700 rounded-lg bg-slate-900/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">{ticket.issue}</h3>
                        <Badge className={getTicketStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Customer: {ticket.customer}</span>
                        <span>Priority: {ticket.priority}</span>
                        <span>Time: {ticket.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700" onClick={() => onSectionChange?.("ticket-management")}>
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  View All Tickets
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case "ticket-management":
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Ticket Management</CardTitle>
                    <CardDescription className="text-slate-400">Manage customer support tickets</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New Ticket
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      className="pl-10 pr-4 py-2 w-full rounded-md bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Issue</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Priority</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {tickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td className="px-4 py-2 text-white font-mono">{ticket.id}</td>
                          <td className="px-4 py-2 text-slate-200">{ticket.customer}</td>
                          <td className="px-4 py-2 text-slate-200">{ticket.issue}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              getTicketPriorityColor(ticket.priority)
                            }`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              getTicketStatusColor(ticket.status)
                            }`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-slate-400">{ticket.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                <MessageSquare className="h-5 w-5 text-emerald-400" />
                <span>Support Center Section</span>
              </CardTitle>
              <CardDescription className="text-slate-400">This section is under development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="h-10 w-10 text-emerald-400" />
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
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Support Center</h1>
                  <p className="text-sm text-slate-400">AI-Powered Customer Support & Ticket Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-medium">
                <Zap className="h-3 w-3 mr-1" />
                AI Enabled
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-medium">
                {tickets.filter(t => t.status === 'open').length} Open Tickets
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
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Support Assistant</h3>
                  <p className="text-sm text-slate-400">Your intelligent customer support assistant</p>
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
                    placeholder="Customer issue details, previous interactions, relevant articles..."
                    className="min-h-[80px] border-slate-600 bg-slate-900/50 text-white focus:border-emerald-400 resize-none text-sm"
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
                        className="flex flex-col items-center p-3 h-auto border-slate-600 hover:border-emerald-400 hover:bg-emerald-500/20 bg-transparent text-slate-300"
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
                          <AvatarFallback className="bg-emerald-600 text-white text-xs">
                            <User className="h-3 w-3" />
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-500 text-white text-xs">
                            <Bot className="h-3 w-3" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div
                        className={`p-3 rounded-xl text-sm ${
                          message.type === "user"
                            ? "bg-emerald-600 text-white"
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
                                  message.type === "user" ? "text-emerald-200" : "text-slate-500"
                                }`}
                              >
                                <Paperclip className="h-3 w-3" />
                                <span>{file}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className={`text-xs mt-2 ${message.type === "user" ? "text-emerald-200" : "text-slate-500"}`}>
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
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-500 text-white">
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
                    placeholder="Describe your support query..."
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    className="flex-1 border-slate-600 bg-slate-900/50 text-white focus:border-emerald-400 text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() && attachedFiles.length === 0 || isTyping}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 px-4"
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