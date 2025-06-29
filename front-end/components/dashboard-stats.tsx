"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, CheckCircle, TrendingUp, Brain, Zap } from "lucide-react"

interface DashboardStatsProps {
  departments: any[]
}

export function DashboardStats({ departments }: DashboardStatsProps) {
  const totalUsers = departments.reduce((sum, dept) => sum + dept.activeUsers, 0)
  const totalTasks = departments.reduce((sum, dept) => sum + dept.completedTasks, 0)
  const activeDepartments = departments.filter((d) => d.status === "active").length

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Completed Tasks",
      value: totalTasks,
      icon: CheckCircle,
      color: "bg-emerald-500",
      change: "+23%",
      changeType: "positive",
    },
    {
      title: "Active Departments",
      value: activeDepartments,
      icon: Brain,
      color: "bg-purple-500",
      change: "100%",
      changeType: "positive",
    },
    {
      title: "AI Interactions",
      value: "1.2K",
      icon: Zap,
      color: "bg-amber-500",
      change: "+45%",
      changeType: "positive",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={index}
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${stat.color} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
