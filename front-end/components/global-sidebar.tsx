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
  Mail,
  Menu,
  Home
} from "lucide-react"
import { supabase } from "../lib/supabaseClient"
import { useIsMobile, useIsTablet, useTouchDevice, usePrefersReducedMotion } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface GlobalSidebarProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
  onDepartmentChange?: (department: string) => void
  currentDepartment?: string | null
  defaultExpanded?: boolean
  setIsExpanded: (expanded: boolean) => void;
  expandedMarketing?: boolean;
  setExpandedMarketing?: (expanded: boolean) => void;
}

export function GlobalSidebar({
  activeSection = "dashboard",
  onSectionChange,
  onDepartmentChange,
  currentDepartment,
  defaultExpanded = true,
  setIsExpanded,
  expandedMarketing = false,
  setExpandedMarketing,
}: GlobalSidebarProps) {
  
  const [isExpanded, setIsExpandedState] = useState(defaultExpanded);
  const [localExpandedMarketing, setLocalExpandedMarketing] = useState(currentDepartment === "marketing");
  const isMobile = useIsMobile();
  
  // Use either the parent component's state or local state
  const isMarketingExpanded = expandedMarketing !== undefined ? expandedMarketing : localExpandedMarketing;
  const toggleMarketing = (expanded: boolean) => {
    if (setExpandedMarketing) {
      setExpandedMarketing(expanded);
    } else {
      setLocalExpandedMarketing(expanded);
    }
  };
  const isTablet = useIsTablet();
  const isTouch = useTouchDevice();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setIsExpandedState(defaultExpanded);
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded, setIsExpanded]);

  // Update expandedMarketing when currentDepartment changes
  useEffect(() => {
    if (currentDepartment === "marketing") {
      toggleMarketing(true);
    } else if (setExpandedMarketing) {
      setExpandedMarketing(false);
    } else {
      setLocalExpandedMarketing(false);
    }
  }, [currentDepartment]);
  
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpandedState(newState);
    setIsExpanded(newState);
  };

  const departments = [
    {
      id: "dashboard",
      name: "Executive Dashboard",
      icon: Home,
      description: "Strategic overview",
      count: null,
      restricted: true,
    },
    {
      id: "agi",
      name: "AGI Assistant",
      icon: Bot,
      description: "AI command center",
      count: null,
      restricted: false,
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
      hasChildren: true,
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
    }, 
    {
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
      count: 15,
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
          toggleMarketing(!isMarketingExpanded);
        } else {
          onDepartmentChange?.(id);
          toggleMarketing(true);
        }
      } else {
        onDepartmentChange?.(id);
        toggleMarketing(false);
      }
      
      if (isMobile && id !== "marketing") {
        const sheetElement = document.querySelector('[data-state="open"]');
        if (sheetElement) {
          const closeButton = sheetElement.querySelector('button[data-state="open"]');
          closeButton?.click();
        }
      }
    } else if (type === "section") {
      onSectionChange?.(id);
      // Don't close mobile menu when selecting a section
    }
  }

  const handleMarketingSectionClick = (sectionId: string) => {
    // First navigate to marketing if not already there
    if (currentDepartment !== "marketing") {
      onDepartmentChange?.("marketing");
    }
    
    // Then change the section
    onSectionChange?.(sectionId);
    
    // On mobile, close the sidebar sheet after selection
    if (isMobile) {
      const sheetElement = document.querySelector('[data-state="open"]');
      if (sheetElement) {
        const closeButton = sheetElement.querySelector('button[data-state="open"]');
        closeButton?.click();
      }
    }
  };

  const renderSidebarItem = (dept: any) => {
    const isActive = currentDepartment === dept.id;
    const showExpander = dept.id === "marketing" && isExpanded;
    const isItemExpanded = dept.id === "marketing" && isMarketingExpanded;
    
    return (
      <div key={dept.id} className="space-y-1">
              <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full",
            isExpanded ? "justify-between px-3" : "justify-center px-0",
            "h-auto py-3 relative group",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          onClick={() => handleItemClick(dept.id, "department")}
              >
          <div className="flex items-center">
            <dept.icon className={cn(
              "h-5 w-5 flex-shrink-0",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
              !isExpanded && "mx-auto"
            )} />
            
            {isExpanded && (
              <div className="ml-3 text-left">
                <div className={cn("font-medium text-sm", isActive ? "text-primary" : "")}>
                  {dept.name}
                </div>
                {dept.description && (
                  <p className="text-xs text-muted-foreground truncate">{dept.description}</p>
                )}
                      </div>
            )}
                    </div>
          
          {!isExpanded && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <span className="sr-only">{dept.name}</span>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {dept.name}
                  {dept.description && <p className="text-xs opacity-70">{dept.description}</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {isExpanded && dept.count !== null && (
            <Badge variant="secondary" className="ml-auto mr-2">
              {dept.count}
            </Badge>
          )}
          
          {showExpander && (
            <div 
              className="h-5 w-5 p-0 ml-auto cursor-pointer flex items-center justify-center hover:bg-slate-700/50 rounded-sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleMarketing(!isMarketingExpanded);
              }}
            >
              {isItemExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                )}
              </Button>

        {/* Marketing Subsections */}
        {dept.id === "marketing" && isExpanded && isMarketingExpanded && (
          <div className={cn(
            "pl-8 space-y-1 overflow-hidden transition-all",
            isItemExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
            prefersReducedMotion && "transition-none"
          )}>
            {marketingSections.map((section) => (
                      <Button
                        key={section.id}
                variant={activeSection === section.id ? "secondary" : "ghost"}
                        size="sm"
                className={cn(
                  "w-full justify-start h-auto py-2 text-sm",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
                onClick={() => handleMarketingSectionClick(section.id)}
                      >
                <section.icon className="h-4 w-4 mr-2" />
                <span className="truncate">{section.name}</span>
                {section.count !== null && (
                  <Badge variant="outline" className="ml-auto">
                            {section.count}
                          </Badge>
                        )}
                      </Button>
            ))}
                </div>
              )}
      </div>
    );
  };

  const SidebarContent = () => (
    <div className={cn(
      "flex flex-col h-full",
      isExpanded ? "w-64" : "w-[70px]",
      "transition-all duration-300",
      prefersReducedMotion && "transition-none"
    )}>
      <div className="flex items-center justify-between p-4 h-16 border-b">
        {isExpanded ? (
          <img src="/logo-text.png" alt="Businessly Logo" className="h-8 w-auto" />
        ) : (
          <img src="/logo.png" alt="Businessly Icon" className="h-8 w-auto mx-auto" />
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              "transition-transform ml-auto flex-shrink-0",
              "hover:bg-secondary",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
          {isExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
              </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {departments.map(renderSidebarItem)}
            </div>
      </ScrollArea>

      <div className="mt-auto border-t">
        <div className={cn(
          "p-4 flex items-center",
          isExpanded ? "justify-between" : "justify-center"
        )}>
          <div className={cn(
            "flex items-center",
            !isExpanded && "flex-col gap-3"
          )}>
            <Switch
              id="theme-toggle"
              checked={theme === "dark"}
              onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(!isExpanded && "mx-auto")}
              aria-label="Toggle dark mode"
            />
            {isExpanded && (
              <Label htmlFor="theme-toggle" className="ml-3">
                {theme === "dark" ? "Dark" : "Light"} Mode
              </Label>
            )}
          </div>

          <Button
            variant="ghost"
            size={isExpanded ? "default" : "icon"}
            onClick={handleLogout}
            className={cn(
              isExpanded ? "" : "mt-3 mx-auto",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label="Logout"
          >
            <LogOut className={cn("h-5 w-5", !isExpanded && "mx-auto")} />
            {isExpanded && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );

  // Mobile sidebar and bottom navigation
  if (isMobile) {
              return (
      <>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon" 
              className="fixed top-4 left-4 z-[100] bg-background/80 backdrop-blur-sm border-slate-700/50 shadow-md"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[85%] max-w-[300px] border-slate-700/50 overflow-y-auto z-[100]">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="h-full flex flex-col">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Bottom Mobile Navigation */}
        <nav className="safe-bottom fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-slate-700/50 h-16 flex items-center justify-around px-4 z-50 shadow-md">
          {departments.slice(0, 5).map((dept) => (
            <Button
              key={dept.id}
              variant={currentDepartment === dept.id ? "secondary" : "ghost"}
              size="icon"
              className={cn(
                "h-12 w-12 rounded-full relative",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              onClick={() => handleItemClick(dept.id, "department")}
            >
              <dept.icon className="h-5 w-5" />
              <span className="sr-only">{dept.name}</span>
              
              {/* Show active indicator dot */}
              {currentDepartment === dept.id && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary" />
              )}
              
              {/* Show expandable indicator for marketing */}
              {dept.id === "marketing" && isMarketingExpanded && (
                <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary-foreground border-2 border-primary" />
              )}
            </Button>
          ))}
        </nav>
        
        {/* Marketing subsections sliding panel when marketing is expanded on mobile */}
        {currentDepartment === "marketing" && isMarketingExpanded && (
          <div className="safe-bottom fixed bottom-16 left-0 right-0 bg-popover/90 backdrop-blur-sm border-t border-slate-700/50 z-30 p-2 shadow-lg">
            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-thin px-1 py-1">
              {marketingSections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "secondary" : "outline"}
                  size="sm"
                  className="whitespace-nowrap flex-shrink-0 h-auto py-2"
                  onClick={() => handleMarketingSectionClick(section.id)}
                >
                  <section.icon className="h-4 w-4 mr-2" />
                  {section.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <aside 
      className={cn(
        "h-screen sticky top-0 border-r bg-background/80 backdrop-blur-sm shadow-md z-30",
        "transition-all duration-300",
        prefersReducedMotion && "transition-none",
        isExpanded ? "w-64" : "w-[70px]"
      )}
      aria-label="Sidebar navigation"
    >
      <SidebarContent />
    </aside>
  );
}