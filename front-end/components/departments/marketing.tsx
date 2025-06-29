"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BarChart3, MessageSquare, TrendingUp, PenTool, Target, Share2 } from "lucide-react"
import { DepartmentChatbot } from "@/components/department-chatbot"

interface MarketingProps {
  onBack: () => void
  department: any
}

export default function Marketing({ onBack, department }: MarketingProps) {
  const [showChatbot, setShowChatbot] = useState(false)

  const campaigns = [
    { id: 1, name: "Summer Sale 2024", status: "active", performance: 85, budget: "$5,000" },
    { id: 2, name: "Product Launch", status: "draft", performance: 0, budget: "$8,000" },
    { id: 3, name: "Brand Awareness", status: "completed", performance: 92, budget: "$3,500" },
  ]

  const contentIdeas = [
    "10 Tips for Better Productivity",
    "Industry Trends Report 2024",
    "Customer Success Stories",
    "Behind the Scenes Content",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Marketing Hub</h1>
                  <p className="text-sm text-slate-400">Campaign management & content creation</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowChatbot(true)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Marketing AI
              </Button>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">12 Active Users</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Campaigns</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
                <Target className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Content Created</p>
                  <p className="text-2xl font-bold text-white">156</p>
                </div>
                <PenTool className="h-8 w-8 text-emerald-400" />
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
                  <p className="text-sm text-slate-400">Reach</p>
                  <p className="text-2xl font-bold text-white">24.5K</p>
                </div>
                <Share2 className="h-8 w-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign Management */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Campaign Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage and monitor your marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="p-4 border border-slate-700 rounded-lg bg-slate-900/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">{campaign.name}</h3>
                        <Badge
                          className={
                            campaign.status === "active"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : campaign.status === "draft"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                : "bg-slate-500/20 text-slate-300 border-slate-500/30"
                          }
                        >
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

                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  <Target className="h-4 w-4 mr-2" />
                  Create New Campaign
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Content Creation */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm mb-6">
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
                  {contentIdeas.map((idea, index) => (
                    <div key={index} className="p-3 bg-slate-900/50 rounded-lg text-sm text-slate-300">
                      {idea}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      {showChatbot && (
        <DepartmentChatbot
          department="Marketing"
          onClose={() => setShowChatbot(false)}
          specialization="marketing campaigns, content creation, and analytics"
        />
      )}
    </div>
  )
}
