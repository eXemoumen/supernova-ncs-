"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, DollarSign, MessageSquare, Sparkles, Brain, Home } from "lucide-react"
import { GlobalSidebar } from "@/components/global-sidebar"
import { ExecutiveDashboard } from "@/components/executive-dashboard"
import ContentStudio from "@/components/departments/content-studio"
import Marketing from "@/components/departments/marketing"
import Support from "@/components/departments/support"
import HR from "@/components/departments/hr"
import Finance from "@/components/departments/finance"
import Operations from "@/components/departments/operations"
import AuthForm from "@/components/auth-form"
import { supabase } from "../lib/supabaseClient"
import Clients from "@/components/departments/clients"
import Email from "@/components/departments/email"
import { useIsMobile, useIsTablet, useTouchDevice } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const departments = [
  {
    id: "content-studio",
    name: "Content Studio",
    icon: Sparkles,
    color: "bg-gradient-to-r from-indigo-500 to-purple-500",
    description: "AI-powered content creation with approval workflows",
    features: ["AI Content Generation", "Client Management", "Approval Workflow", "Multi-format Export"],
    status: "active",
    activeUsers: 8,
    completedTasks: 156,
  },
  {
    id: "marketing",
    name: "Marketing Hub",
    icon: BarChart3,
    color: "bg-blue-500",
    description: "Campaign management, content creation, and analytics",
    features: ["Content Generation", "Campaign Analytics", "Social Media Management", "SEO Optimization"],
    status: "active",
    activeUsers: 12,
    completedTasks: 45,
  },
  {
    id: "support",
    name: "Support Center",
    icon: MessageSquare,
    color: "bg-emerald-500",
    description: "Customer support, ticket management, and knowledge base",
    features: ["Ticket Management", "Live Chat", "Knowledge Base", "Customer Analytics"],
    status: "active",
    activeUsers: 8,
    completedTasks: 67,
  },
  {
    id: "hr",
    name: "HR Management",
    icon: Users,
    color: "bg-green-500",
    description: "Employee management, recruitment, and performance tracking",
    features: ["Employee Onboarding", "Performance Reviews", "Recruitment", "Time Tracking"],
    status: "active",
    activeUsers: 5,
    completedTasks: 23,
  },
  {
    id: "finance",
    name: "Finance Control",
    icon: DollarSign,
    color: "bg-purple-500",
    description: "Financial planning, expense tracking, and reporting",
    features: ["Expense Management", "Budget Planning", "Financial Reports", "Invoice Management"],
    status: "active",
    activeUsers: 6,
    completedTasks: 34,
  },
  {
    id: "operations",
    name: "Operations Hub",
    icon: Brain,
    color: "bg-orange-500",
    description: "Project management, workflow automation, and resource planning",
    features: ["Project Management", "Workflow Automation", "Resource Planning", "Quality Control"],
    status: "active",
    activeUsers: 15,
    completedTasks: 89,
  },
]

// Component mapping - each department gets its own component
const departmentComponents = {
  "content-studio": ContentStudio,
  marketing: Marketing,
  support: Support,
  hr: HR,
  finance: Finance,
  operations: Operations,
  clients: Clients,
  email: Email,
  dashboard: ExecutiveDashboard, // For consistency
  // AGI doesn't have a component here because we navigate to a separate page
}

export default function Dashboard() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [expandedMarketing, setExpandedMarketing] = useState(false)
  
  const router = useRouter()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isTouch = useTouchDevice()

  // Update expanded marketing state when department changes
  useEffect(() => {
    setExpandedMarketing(selectedDepartment === "marketing");
  }, [selectedDepartment]);

  useEffect(() => {
    // Set expanded state based on screen size
    setIsSidebarExpanded(!isMobile);
    
    const getSession = async () => {
      try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error?.message || error);
      } else {
        setSession(session);
      }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
      setLoading(false);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [isMobile]);

  const handleDepartmentChange = (departmentId: string) => {
    if (departmentId === "dashboard") {
      setSelectedDepartment(null)
      setActiveSection("dashboard")
    } else if (departmentId === "marketing") {
      setSelectedDepartment(departmentId)
      setActiveSection("marketing-dashboard") // Marketing uses specific section IDs
    } else if (departmentId === "agi") {
      // Navigate to the AGI page using window.location
      window.location.href = "/agi"
      return
    } else {
      setSelectedDepartment(departmentId)
      setActiveSection("dashboard") // Default section for departments
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <img src="/logo.png" alt="Businessly Logo" className="h-16 w-16 animate-pulse" />
          <p className="text-slate-300">Loading Businessly platform...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <AuthForm />
  }

  const renderMainContent = () => {
  if (selectedDepartment) {
    const DepartmentComponent = departmentComponents[selectedDepartment as keyof typeof departmentComponents]

    if (DepartmentComponent) {
      const handleBack = () => handleDepartmentChange("dashboard");
      
      // Handle all department components
      return (
        <DepartmentComponent
          onBack={handleBack}
          onBackAction={handleBack}
          department={departments.find((d) => d.id === selectedDepartment)}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onDepartmentChange={handleDepartmentChange}
        />
      )
    }
  }

  return (
      <>
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-lg md:text-xl font-bold text-white">
                    {selectedDepartment ? departments.find(d => d.id === selectedDepartment)?.name : "Executive Platform"}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400 truncate">
                    {selectedDepartment 
                      ? departments.find(d => d.id === selectedDepartment)?.description
                      : "Strategic Business Intelligence"
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hidden md:inline-flex">
                  Executive Access
                </Badge>
                {isMobile && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-300 hover:text-white hover:bg-slate-800/60"
                    onClick={() => handleDepartmentChange("dashboard")}
                  >
                    <Home className="h-4 w-4 mr-1" /> Home
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pb-safe">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
            <ExecutiveDashboard onDepartmentChange={handleDepartmentChange} />
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Sidebar */}
      <GlobalSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onDepartmentChange={handleDepartmentChange}
        currentDepartment={selectedDepartment}
        defaultExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        expandedMarketing={expandedMarketing}
        setExpandedMarketing={setExpandedMarketing}
      />

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden",
        isMobile && "pt-16",
        isMobile && selectedDepartment === "marketing" && expandedMarketing ? "pb-32 safe-bottom" : (isMobile ? "pb-20 safe-bottom" : "")
      )}>
        {renderMainContent()}
      </div>
      
      {/* Empty space in top-left corner on mobile to avoid conflicts with menu button */}
      {isMobile && (
        <div className="fixed top-0 left-0 w-16 h-16 z-[90]" aria-hidden="true" />
      )}
    </div>
  )
}