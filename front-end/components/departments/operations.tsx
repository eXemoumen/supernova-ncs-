"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Settings, MessageSquare, CheckCircle, Clock, AlertTriangle, Zap } from "lucide-react"
import { DepartmentChatbot } from "@/components/department-chatbot"

interface OperationsProps {
  onBack: () => void
  department: any
}

export default function Operations({ onBack, department }: OperationsProps) {
  const [showChatbot, setShowChatbot] = useState(false)

  const projects = [
    { name: "Website Redesign", progress: 75, status: "in-progress", deadline: "2 days" },
    { name: "Mobile App Launch", progress: 90, status: "review", deadline: "1 week" },
    { name: "Database Migration", progress: 45, status: "in-progress", deadline: "3 days" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Operations Hub</h1>
                  <p className="text-sm text-slate-500">Project management & workflow automation</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => setShowChatbot(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Operations AI
              </Button>
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                15 Team Members
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Projects</p>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                </div>
                <Settings className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-slate-900">89</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-slate-900">7</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Efficiency</p>
                  <p className="text-2xl font-bold text-slate-900">94%</p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Management */}
        <Card className="border-0 shadow-lg bg-white/80">
          <CardHeader>
            <CardTitle>Project Management</CardTitle>
            <CardDescription>Track project progress and manage workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {projects.map((project, index) => (
                <div key={index} className="p-4 border rounded-lg bg-slate-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-slate-900">{project.name}</h3>
                      <p className="text-sm text-slate-600">Deadline: {project.deadline}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={
                          project.status === "in-progress"
                            ? "border-blue-200 text-blue-700"
                            : project.status === "review"
                              ? "border-amber-200 text-amber-700"
                              : "border-emerald-200 text-emerald-700"
                        }
                      >
                        {project.status}
                      </Badge>
                      {project.progress < 50 && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chatbot */}
      {showChatbot && (
        <DepartmentChatbot
          department="Operations"
          onClose={() => setShowChatbot(false)}
          specialization="project management, workflow optimization, and process automation"
        />
      )}
    </div>
  )
}
