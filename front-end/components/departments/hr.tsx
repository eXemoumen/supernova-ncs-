"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Users, MessageSquare, UserPlus, Award, Clock } from "lucide-react"
import { DepartmentChatbot } from "@/components/department-chatbot"

interface HRProps {
  onBack: () => void
  department: any
}

export default function HR({ onBack, department }: HRProps) {
  const [showChatbot, setShowChatbot] = useState(false)

  const employees = [
    { name: "Alice Johnson", role: "Developer", performance: 92, status: "active" },
    { name: "Bob Smith", role: "Designer", performance: 88, status: "active" },
    { name: "Carol Davis", role: "Manager", performance: 95, status: "active" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
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
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">HR Management</h1>
                  <p className="text-sm text-slate-500">Employee management & performance tracking</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => setShowChatbot(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                HR AI
              </Button>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                5 HR Managers
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
                  <p className="text-sm text-slate-600">Total Employees</p>
                  <p className="text-2xl font-bold text-slate-900">127</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">New Hires</p>
                  <p className="text-2xl font-bold text-slate-900">8</p>
                </div>
                <UserPlus className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg Performance</p>
                  <p className="text-2xl font-bold text-slate-900">91%</p>
                </div>
                <Award className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Retention Rate</p>
                  <p className="text-2xl font-bold text-slate-900">94%</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Management */}
        <Card className="border-0 shadow-lg bg-white/80">
          <CardHeader>
            <CardTitle>Employee Performance</CardTitle>
            <CardDescription>Track and manage employee performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.map((employee, index) => (
                <div key={index} className="p-4 border rounded-lg bg-slate-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-slate-900">{employee.name}</h3>
                      <p className="text-sm text-slate-600">{employee.role}</p>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                      {employee.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Performance Score</span>
                      <span className="font-medium">{employee.performance}%</span>
                    </div>
                    <Progress value={employee.performance} className="h-2" />
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
          department="HR"
          onClose={() => setShowChatbot(false)}
          specialization="employee management, recruitment, and performance optimization"
        />
      )}
    </div>
  )
}
