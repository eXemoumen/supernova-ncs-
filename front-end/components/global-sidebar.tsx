"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  BarChart3,
  MessageSquare,
  Users,
  DollarSign,
  Settings,
  Sparkles,
  Layout,
  Briefcase,
  BookOpen,
  Shield,
  Archive,
  Activity,
  Bell,
  Search,
  PlusCircle,
  Bot,
  ChevronLeft,
  ChevronRight,
  Brain,
  Crown,
  LogOut, // Import LogOut icon
} from "lucide-react"
import { supabase } from "../lib/supabaseClient" // Import supabase client

interface GlobalSidebarProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
  onDepartmentChange?: (department: string) => void
  currentDepartment?: string | null
  defaultExpanded?: boolean
  setIsExpanded: (expanded: boolean) => void; // Add setIsExpanded prop
}

export function GlobalSidebar({
  activeSection = "dashboard",
  onSectionChange,
  onDepartmentChange,
  currentDepartment,
  defaultExpanded = false,
  setIsExpanded,
}: GlobalSidebarProps) {
  const [isHovered, setIsHovered] = useState(false); // New state for hover
  const isExpanded = defaultExpanded; // Use defaultExpanded as the source of truth

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const departments = [
    {
      id: "dashboard",
      name: "Executive Dashboard",
      icon: Crown,
      description: "Strategic overview",
      count: null,
      restricted: true,
    },
    {
      id: "content-studio",
      name: "Content Studio",
      icon: Sparkles,
      description: "AI content creation",
      count: 12,
    },
    {
      id: "marketing",
      name: "Marketing Hub",
      icon: BarChart3,
      description: "Campaign management",
      count: 8,
    },
    {
      id: "support",
      name: "Support Center",
      icon: MessageSquare,
      description: "Customer support",
      count: 23,
    },
    {
      id: "hr",
      name: "HR Management",
      icon: Users,
      description: "Employee management",
      count: 5,
    },
    {
      id: "finance",
      name: "Finance Control",
      icon: DollarSign,
      description: "Financial planning",
      count: null,
    },
    {
      id: "operations",
      name: "Operations Hub",
      icon: Settings,
      description: "Project management",
      count: 7,
    },
  ]

  const studioSections = [
    {
      id: "workspace",
      name: "Content Workspace",
      icon: Layout,
      description: "Create and manage content",
      count: 15,
    },
    {
      id: "projects",
      name: "Active Projects",
      icon: Briefcase,
      description: "Client projects",
      count: 4,
    },
    {
      id: "templates",
      name: "Content Templates",
      icon: BookOpen,
      description: "Reusable templates",
      count: 12,
    },
    {
      id: "analytics",
      name: "Performance Analytics",
      icon: BarChart3,
      description: "Content metrics",
      count: null,
    },
    {
      id: "approval",
      name: "Approval Queue",
      icon: Shield,
      description: "Awaiting approval",
      count: 6,
    },
    {
      id: "archive",
      name: "Content Archive",
      icon: Archive,
      description: "Published content",
      count: 156,
    },
    {
      id: "team",
      name: "Team Collaboration",
      icon: Users,
      description: "Team members",
      count: 8,
    },
    {
      id: "activity",
      name: "Recent Activity",
      icon: Activity,
      description: "Latest updates",
      count: null,
    },
  ]

  const quickActions = [
    { id: "new-content", label: "New Content", icon: PlusCircle, color: "bg-indigo-600" },
    { id: "ai-assistant", label: "AI Assistant", icon: Bot, color: "bg-purple-600" },
    { id: "search", label: "Search", icon: Search, color: "bg-emerald-600" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "bg-amber-600" },
  ]

  const handleItemClick = (id: string, type: "department" | "section") => {
    if (type === "department") {
      onDepartmentChange?.(id)
    } else {
      onSectionChange?.(id)
    }
  }

  const renderNavigationItems = () => {
    // Default dashboard navigation
    return (
      <div className="space-y-1 px-3">
        {departments.map((dept) => {
          const Icon = dept.icon
          const isActive = currentDepartment === dept.id || (dept.id === "dashboard" && !currentDepartment)
          return (
            <Button
              key={dept.id}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className={`w-full justify-start h-auto p-3 ${
                isActive
                  ? "bg-slate-700 text-white border-slate-600"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              } ${!isExpanded ? "px-3" : ""}`}
              onClick={() => handleItemClick(dept.id, "department")}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 ${!(isExpanded || isHovered) ? "" : "mr-3"} flex-shrink-0 ${dept.restricted ? "text-amber-400" : ""}`}
                />
                {dept.count !== null && dept.count > 0 && !(isExpanded || isHovered) && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {dept.count > 99 ? "99" : dept.count}
                  </div>
                )}
              </div>
              {(isExpanded || isHovered) && (
                <>
                  <div className="flex-1 text-left">
                    <div className="font-medium flex items-center">
                      {dept.name}
                      {dept.restricted && <Crown className="h-3 w-3 ml-2 text-amber-400" />}
                    </div>
                    <div className="text-xs opacity-70">{dept.description}</div>
                  </div>
                  {dept.count !== null && dept.count > 0 && (
                    <Badge variant="outline" className="ml-auto text-xs border-slate-600 text-slate-300">
                      {dept.count}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={`${
        isExpanded || isHovered ? "w-80" : "w-16"
      } bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 shadow-2xl transition-all duration-300 ease-in-out flex flex-col relative z-40`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          {isExpanded ? (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">OmniDesk</h2>
                <p className="text-sm text-slate-400">Executive Platform</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <div className="p-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!defaultExpanded)}
            className="text-slate-400 hover:text-white ml-auto"
          >
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      {isExpanded && (
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  className="flex flex-col items-center p-3 h-auto border-slate-700 hover:border-slate-600 hover:bg-slate-800 bg-transparent text-slate-300"
                >
                  <div className={`p-2 rounded-lg ${action.color} mb-2`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">{renderNavigationItems()}</ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700/50">
        {isExpanded ? (
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-indigo-600 text-white text-sm font-medium">AJ</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">Alex Johnson</p>
              <p className="text-xs text-slate-400">Chief Executive</p>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-indigo-600 text-white text-sm font-medium">AJ</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  )
}