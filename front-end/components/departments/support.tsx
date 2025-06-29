"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Clock, CheckCircle, AlertCircle, Search, Filter, Plus } from "lucide-react"

interface SupportProps {
  onBack: () => void
  department: any
}

export default function Support({ onBack, department }: SupportProps) {
  const [showChatbot, setShowChatbot] = useState(false)

  const tickets = [
    { id: "#T001", customer: "John Doe", issue: "Login Issues", priority: "high", status: "open", time: "2h ago" },
    {
      id: "#T002",
      customer: "Jane Smith",
      issue: "Payment Problem",
      priority: "medium",
      status: "in-progress",
      time: "4h ago",
    },
    {
      id: "#T003",
      customer: "Bob Wilson",
      issue: "Feature Request",
      priority: "low",
      status: "resolved",
      time: "1d ago",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Support Center</h1>
                  <p className="text-sm text-slate-400">Customer support & ticket management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => setShowChatbot(true)} className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent">
                <MessageSquare className="h-4 w-4 mr-2" />
                Support AI
              </Button>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                8 Active Agents
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Open Tickets</p>
                  <p className="text-2xl font-bold text-white">23</p>
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
                  <p className="text-2xl font-bold text-white">45</p>
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

        {/* Ticket Management */}
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
                          ticket.priority === "high"
                            ? "bg-red-500/20 text-red-400"
                            : ticket.priority === "medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          ticket.status === "open"
                            ? "bg-red-500/20 text-red-400"
                            : ticket.status === "in-progress"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-emerald-500/20 text-emerald-400"
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
    </div>
  )
}
    
