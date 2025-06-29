"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MessageSquare, BarChart3, Users, Zap } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "New Project",
      description: "Start a new project",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "AI Assistant",
      description: "Get AI help",
      icon: MessageSquare,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Analytics",
      description: "View reports",
      icon: BarChart3,
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      title: "Team Meeting",
      description: "Schedule meeting",
      icon: Users,
      color: "bg-amber-500 hover:bg-amber-600",
    },
  ]

  return (
    <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <CardTitle>Quick Actions</CardTitle>
        </div>
        <CardDescription>Frequently used actions for faster workflow</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                className={`h-20 flex-col space-y-2 border-2 hover:border-transparent transition-all duration-300 ${action.color} hover:text-white group`}
              >
                <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
