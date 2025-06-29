"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { LucideIcon } from "lucide-react"
import { Users, CheckCircle, TrendingUp } from "lucide-react"

interface Department {
  id: string
  name: string
  icon: LucideIcon
  color: string
  description: string
  features: string[]
  status: "active" | "pending" | "inactive"
  activeUsers: number
  completedTasks: number
}

interface DepartmentCardProps {
  department: Department
  onClick: () => void
}

export function DepartmentCard({ department, onClick }: DepartmentCardProps) {
  const Icon = department.icon
  const progress = Math.min((department.completedTasks / 100) * 100, 100)

  return (
    <Card
      className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-white/80 backdrop-blur-sm"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <div
            className={`p-3 rounded-xl ${department.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {department.status}
          </Badge>
        </div>
        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{department.name}</CardTitle>
        <CardDescription className="text-sm">{department.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium">{department.activeUsers} users</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium">{department.completedTasks} tasks</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Features Preview */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Key Features:</p>
          <div className="flex flex-wrap gap-1">
            {department.features.slice(0, 2).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {department.features.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{department.features.length - 2} more
              </Badge>
            )}
          </div>
        </div>

        <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
          <TrendingUp className="h-4 w-4 mr-2" />
          Enter Department
        </Button>
      </CardContent>
    </Card>
  )
}
