"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, DollarSign, MessageSquare, Sparkles, Brain } from "lucide-react"
import { GlobalSidebar } from "@/components/global-sidebar"
import { ExecutiveDashboard } from "@/components/executive-dashboard"
import ContentStudio from "@/components/departments/content-studio"
import Marketing from "@/components/departments/marketing"
import Support from "@/components/departments/support"
import HR from "@/components/departments/hr"
import Finance from "@/components/departments/finance"
import Operations from "@/components/departments/operations"
import AuthForm from "@/components/auth-form" // Import the AuthForm component
import { supabase } from "../lib/supabaseClient" // Import supabase client
import Clients from "@/components/departments/clients"
import Email from "@/components/departments/email"

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

// Component mapping
const departmentComponents = {
  "content-studio": ContentStudio,
  marketing: Marketing,
  support: Support,
  hr: HR,
  finance: Finance,
  operations: Operations,
  clients:Clients,
  email:Email
}

export default function Dashboard() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // New state for sidebar expansion

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error?.message || error);
      } else {
        setSession(session);
      }
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDepartmentChange = (departmentId: string) => {
    if (departmentId === "dashboard") {
      setSelectedDepartment(null)
      setActiveSection("dashboard")
    } else {
      setSelectedDepartment(departmentId)
      setActiveSection("dashboard") // Default section for departments
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>
  }

  if (!session) {
    return <AuthForm />
  }

  if (selectedDepartment) {
    const DepartmentComponent = departmentComponents[selectedDepartment as keyof typeof departmentComponents]

    if (DepartmentComponent) {
      return (
        <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <GlobalSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onDepartmentChange={handleDepartmentChange}
            currentDepartment={selectedDepartment}
            defaultExpanded={isSidebarExpanded}
            setIsExpanded={setIsSidebarExpanded}
          />
          <div className="flex-1">
            <DepartmentComponent
              onBack={() => handleDepartmentChange("dashboard")}
              department={departments.find((d) => d.id === selectedDepartment)}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        </div>
      )
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <GlobalSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onDepartmentChange={handleDepartmentChange}
            currentDepartment={selectedDepartment}
            defaultExpanded={isSidebarExpanded}
            setIsExpanded={setIsSidebarExpanded}
          />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-xl font-bold text-white">OmniDesk Executive Platform</h1>
                  <p className="text-sm text-slate-400">Strategic Business Intelligence</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Executive Access</Badge>
                
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ExecutiveDashboard onDepartmentChange={handleDepartmentChange} />
          </div>
        </div>
      </div>
    </div>
  )
}