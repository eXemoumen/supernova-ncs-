"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface Department {
  id: string
  name: string
  icon: LucideIcon
  color: string
  modules: string[]
  status: "active" | "pending" | "inactive"
}

interface ModuleCardProps {
  department: Department
  onClick: () => void
}

export function ModuleCard({ department, onClick }: ModuleCardProps) {
  const Icon = department.icon

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "inactive":
        return "bg-slate-50 text-slate-700 border-slate-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-lg ${department.color} group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <Badge variant="outline" className={getStatusColor(department.status)}>
            {department.status}
          </Badge>
        </div>
        <CardTitle className="text-lg">{department.name}</CardTitle>
        <CardDescription>{department.modules.length} AI modules available</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {department.modules.slice(0, 2).map((module, index) => (
            <div key={index} className="text-sm text-slate-600 flex items-center">
              <div className="w-2 h-2 bg-slate-300 rounded-full mr-2"></div>
              {module}
            </div>
          ))}
          {department.modules.length > 2 && (
            <div className="text-sm text-slate-500">+{department.modules.length - 2} more modules</div>
          )}
        </div>
        <Button
          variant="outline"
          className="w-full group-hover:bg-slate-900 group-hover:text-white transition-colors bg-transparent"
        >
          Manage Department
        </Button>
      </CardContent>
    </Card>
  )
}
