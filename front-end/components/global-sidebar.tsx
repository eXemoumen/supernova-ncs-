"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  BarChart3,
  MessageSquare,
  Users,
  DollarSign,
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
  LogOut,
  Sun,
  Moon,
  Settings,
  Target,
  PenTool,
  ChevronDown,
  ChevronUp,
  User,
  Mail
} from "lucide-react"
import { supabase } from "../lib/supabaseClient"

interface GlobalSidebarProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
  onDepartmentChange?: (department: string) => void
  currentDepartment?: string | null
  defaultExpanded?: boolean
  setIsExpanded: (expanded: boolean) => void;
}

export function GlobalSidebar({
  activeSection = "dashboard",
  onSectionChange,
  onDepartmentChange,
  currentDepartment,
  defaultExpanded = false,
  setIsExpanded,
}: GlobalSidebarProps) {
  
  const [isExpanded, setIsExpandedState] = useState(defaultExpanded);
  const [expandedMarketing, setExpandedMarketing] = useState(false);

  useEffect(() => {
    setIsExpandedState(defaultExpanded);
  }, [defaultExpanded]);
  
  const { theme, setTheme } = useTheme();

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
      restricted: false,
    },
    {
      id: "marketing",
      name: "Marketing Hub",
      icon: BarChart3,
      description: "Campaign management",
      count: 8,
      restricted: false,
    },
    {
      id: "support",
      name: "Support Center",
      icon: MessageSquare,
      description: "Customer support",
      count: 23,
      restricted: false,
    },
    {
      id: "hr",
      name: "HR Management",
      icon: Users,
      description: "Employee management",
      count: 5,
      restricted: false,
    },
    {
      id: "finance",
      name: "Finance Control",
      icon: DollarSign,
      description: "Financial planning",
      count: null,
      restricted: false,
    },
    {
      id: "operations",
      name: "Operations Hub",
      icon: Brain,
      description: "Project management",
      count: 7,
      restricted: false,
    }, {
      id: "clients",
      name: "Clients",
      icon: User,
      description: "Client management",
      count: null,
      restricted: false,
    },
    {
      id: "email",
      name: "Email",
      icon: Mail,
      description: "Email management",
      count: null,
      restricted: false,
    }
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

  const marketingSections = [
    {
      id: "marketing-dashboard",
      name: "Marketing Dashboard",
      icon: BarChart3,
      description: "Overview of marketing performance",
      count: null,
    },
    {
      id: "campaign-management",
      name: "Campaign Management",
      icon: Target,
      description: "Manage and monitor campaigns",
      count: 8,
    },
    {
      id: "content-creation",
      name: "Content Creation",
      icon: PenTool,
      description: "Generate content ideas and copy",
      count: 156,
    },
    {
      id: "campaign-configuration",
      name: "Campaign Configuration",
      icon: Settings,
      description: "Configure AI modules for campaigns",
      count: null,
    },
  ]

const handleItemClick = (id: string, type: "department" | "section") => {
    if (type === "department") {
      if (id === "marketing") {
        if (currentDepartment === "marketing") {
          setExpandedMarketing(!expandedMarketing);
        } else {
          onDepartmentChange?.(id);
          setExpandedMarketing(true);
        }
      } else {
        onDepartmentChange?.(id);
        setExpandedMarketing(false);
      }
    } else {
      onSectionChange?.(id);
    }
  }

  const renderNavigationItems = () => {
    return (
      <div className="space-y-1 px-3">
        {departments.map((item) => {
          const Icon = item.icon;
          const isActive = currentDepartment === item.id || 
                         (item.id === "dashboard" && !currentDepartment);
          const isMarketing = item.id === "marketing";
          
          return (
            <div key={item.id} className="space-y-1">
              <Button
                variant={isActive && !(isMarketing && expandedMarketing) ? "secondary" : "ghost"}
                size="sm"
                className={`w-full justify-start h-auto p-3 ${
                  isActive && !(isMarketing && expandedMarketing)
                    ? "bg-slate-700 text-white border-slate-600"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                } ${!isExpanded ? "px-3" : ""}`}
                onClick={() => handleItemClick(item.id, "department")}
              >
                <div className="relative">
                  <Icon
                    className={`h-5 w-5 ${!isExpanded ? "" : "mr-3"} flex-shrink-0 ${item.restricted ? "text-amber-400" : ""}`}
                  />
                  {item.count !== null && item.count > 0 && !isExpanded && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {item.count > 99 ? "99" : item.count}
                    </div>
                  )}
                </div>
                {isExpanded && (
                  <>
                    <div className="flex-1 text-left">
                      <div className="font-medium flex items-center">
                        {item.name}
                        {item.restricted && <Crown className="h-3 w-3 ml-2 text-amber-400" />}
                      </div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                    {isMarketing && (
                      <div className="ml-2">
                        {expandedMarketing ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    )}
                    {item.count !== null && item.count > 0 && !isMarketing && (
                      <Badge variant="outline" className="ml-auto text-xs border-slate-600 text-slate-300">
                        {item.count}
                      </Badge>
                    )}
                  </>
                )}
              </Button>

              {/* Marketing sub-sections */}
              {isMarketing && expandedMarketing && currentDepartment === "marketing" && isExpanded && (
                <div className="ml-4 pl-2 border-l border-slate-700 space-y-1">
                  {marketingSections.map((section) => {
                    const SectionIcon = section.icon;
                    const isSectionActive = activeSection === section.id;
                    
                    return (
                      <Button
                        key={section.id}
                        variant={isSectionActive ? "secondary" : "ghost"}
                        size="sm"
                        className={`w-full justify-start h-auto p-2 ${
                          isSectionActive
                            ? "bg-slate-700 text-white border-slate-600"
                            : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                        }`}
                        onClick={() => handleItemClick(section.id, "section")}
                      >
                        <SectionIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{section.name}</div>
                          <div className="text-xs opacity-70">{section.description}</div>
                        </div>
                        {section.count !== null && section.count > 0 && (
                          <Badge variant="outline" className="ml-auto text-xs border-slate-600 text-slate-300">
                            {section.count}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`${
        isExpanded ? "w-80" : "w-16"
      } bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 shadow-2xl transition-all duration-300 ease-in-out flex flex-col relative z-40`}

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
      <div className="mt-auto p-4 space-y-4">
        <Separator className="bg-slate-700/50" />

        {isExpanded && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">John Doe</p>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {!isExpanded && (
           <Button variant="ghost" size="icon" className="w-full text-slate-400 hover:text-white" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}