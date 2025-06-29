"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, MessageSquare, Users, TrendingUp, Clock } from "lucide-react"

export function ActivityFeed() {
  const activities = [
    {
      id: 1,
      type: "task_completed",
      user: "Sarah Chen",
      action: "completed marketing campaign analysis",
      department: "Marketing",
      time: "2 minutes ago",
      icon: CheckCircle,
      color: "text-emerald-500",
    },
    {
      id: 2,
      type: "chat_interaction",
      user: "Mike Johnson",
      action: "had AI consultation in Support Center",
      department: "Support",
      time: "5 minutes ago",
      icon: MessageSquare,
      color: "text-blue-500",
    },
    {
      id: 3,
      type: "team_update",
      user: "Lisa Wang",
      action: "updated team performance metrics",
      department: "HR",
      time: "12 minutes ago",
      icon: Users,
      color: "text-purple-500",
    },
    {
      id: 4,
      type: "report_generated",
      user: "David Kim",
      action: "generated financial report",
      department: "Finance",
      time: "18 minutes ago",
      icon: TrendingUp,
      color: "text-amber-500",
    },
  ]

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-slate-500" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest updates across all departments</CardDescription>
          </div>
          <Badge variant="outline" className="text-slate-600">
            Live Feed
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                  <AvatarFallback>
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon className={`h-4 w-4 ${activity.color}`} />
                    <span className="font-medium text-slate-900">{activity.user}</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.department}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{activity.action}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
