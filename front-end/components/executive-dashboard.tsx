"use client"

import { useState,useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Users,
  DollarSign,
  Target,
  Brain,
  Sparkles,
  MessageSquare,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Clock,
  Eye,
  Star,
  PieChart,
  LineChart,
  PlusCircle,
} from "lucide-react"

const iconMap: { [key: string]: any } = {
  BarChart3: BarChart3,
  Users: Users,
  DollarSign: DollarSign,
  Target: Target,
  Brain: Brain,
  Sparkles: Sparkles,
  MessageSquare: MessageSquare,
  Settings: Settings,
  ArrowUpRight: ArrowUpRight,
  ArrowDownRight: ArrowDownRight,
  Activity: Activity,
  Zap: Zap,
  Clock: Clock,
  Eye: Eye,
  Star: Star,
  PieChart: PieChart,
  LineChart: LineChart,
  PlusCircle: PlusCircle,
};
import Link from "next/link"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import AddClientForm from "./add-client-form"

interface ExecutiveDashboardProps {
  onDepartmentChange: (department: string) => void
}

// Add types for state variables
interface RevenueDatum {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}
interface DepartmentPerformanceDatum {
  name: string;
  value: number;
  color: string;
}
interface AiInsight {
  department: string;
  icon: any;
  insight: string;
  priority: string;
  impact: string;
  confidence: number;
  action: string;
  trend: string;
}
interface KpiMetric {
  title: string;
  value: string;
  change: string;
  trend: string;
  icon: any;
  color: string;
  description: string;
}

export function ExecutiveDashboard({ onDepartmentChange }: ExecutiveDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")

  const [revenueData, setRevenueData] = useState<RevenueDatum[]>([]);
  const [loadingRevenue, setLoadingRevenue] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoadingRevenue(true);
      try {
        // Replace with your actual backend API endpoint
        const response = await fetch(`http://localhost:3001/api/dashboard/revenue?timeframe=${selectedTimeframe}`);
        const data = await response.json();
        setRevenueData(data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        // Fallback to sample data or show an error message
        
      } finally {
        setLoadingRevenue(false);
      }
    };

    fetchRevenueData();
  }, [selectedTimeframe]);

  const [departmentPerformance, setDepartmentPerformance] = useState<DepartmentPerformanceDatum[]>([]);
  const [loadingDepartmentPerformance, setLoadingDepartmentPerformance] = useState(true);

  useEffect(() => {
    const fetchDepartmentPerformance = async () => {
      setLoadingDepartmentPerformance(true);
      try {
        // Replace with your actual backend API endpoint
        const response = await fetch(`http://localhost:3001/api/dashboard/department-performance?timeframe=${selectedTimeframe}`);
        const data = await response.json();
        setDepartmentPerformance(data);
      } catch (error) {
        console.error("Error fetching department performance data:", error);
        // Fallback to sample data or show an error message
        
      } finally {
        setLoadingDepartmentPerformance(false);
      }
    };

    fetchDepartmentPerformance();
  }, [selectedTimeframe]);

  const [aiInsights, setAiInsights] = useState<AiInsight[]>([]);
  const [loadingAiInsights, setLoadingAiInsights] = useState(true);

  useEffect(() => {
    const fetchAiInsights = async () => {
      setLoadingAiInsights(true);
      try {
        // Replace with your actual backend API endpoint
        const response = await fetch(`http://localhost:3001/api/dashboard/ai-insights?timeframe=${selectedTimeframe}`);
        const data = await response.json();
        setAiInsights(data);
      } catch (error) {
        console.error("Error fetching AI insights:", error);
        // Fallback to sample data or show an error message
        
      } finally {
        setLoadingAiInsights(false);
      }
    };

    fetchAiInsights();
  }, [selectedTimeframe]);

  const [kpiMetrics, setKpiMetrics] = useState<KpiMetric[]>([]);
  const [loadingKpiMetrics, setLoadingKpiMetrics] = useState(true);

  useEffect(() => {
    const fetchKpiMetrics = async () => {
      setLoadingKpiMetrics(true);
      try {
        // Replace with your actual backend API endpoint
        const response = await fetch(`http://localhost:3001/api/dashboard/kpi-metrics?timeframe=${selectedTimeframe}`);
        const data = await response.json();
        setKpiMetrics(data);
      } catch (error) {
        console.error("Error fetching KPI metrics:", error);
        // Fallback to sample data or show an error message
        
      } finally {
        setLoadingKpiMetrics(false);
      }
    };

    fetchKpiMetrics();
  }, [selectedTimeframe]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "high":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30"
      case "medium":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "low":
        return "bg-slate-500/20 text-slate-300 border-slate-500/30"
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-emerald-400" />
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-red-400" />
      default:
        return <Activity className="h-4 w-4 text-slate-400" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Executive Dashboard</h1>
          <p className="text-slate-400 text-lg">Real-time insights and AI-powered recommendations</p>
        </div>
        <div className="flex items-center space-x-4">
          
            <AddClientForm/>
          
          <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg p-2">
            {["7d", "30d", "90d", "1y"].map((period) => (
              <Button
                key={period}
                variant={selectedTimeframe === period ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedTimeframe(period)}
                className={`text-xs ${
                  selectedTimeframe === period
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                {period}
              </Button>
            ))}
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            <Activity className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric, index) => {
          const Icon = iconMap[metric.icon]
          return (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(metric.trend)}
                    <span
                      className={`text-sm font-medium ${
                        metric.trend === "up"
                          ? "text-emerald-400"
                          : metric.trend === "down"
                            ? "text-red-400"
                            : "text-slate-400"
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
                  <p className="text-sm text-slate-400">{metric.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{metric.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <LineChart className="h-5 w-5 text-blue-400" />
              <span>Revenue & Profit Trends</span>
            </CardTitle>
            <CardDescription className="text-slate-400">Monthly financial performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} dot={{ fill: "#3B82F6" }} />
                  <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981" }} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-purple-400" />
              <span>Department Performance</span>
            </CardTitle>
            <CardDescription className="text-slate-400">Current efficiency scores by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentPerformance.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{dept.name}</span>
                    <span className="text-slate-400">{dept.value}%</span>
                  </div>
                  <Progress value={dept.value} className="h-2" style={{ backgroundColor: dept.color + "20" }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center space-x-2">
                <Brain className="h-6 w-6 text-purple-400" />
                <span>AI Strategic Insights</span>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 ml-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Powered by AI
                </Badge>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Real-time recommendations based on data analysis and predictive modeling
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              <Eye className="h-4 w-4 mr-2" />
              View All Insights
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {aiInsights.map((insight, index) => {
              const Icon = iconMap[insight.icon]
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                      <Icon className="h-5 w-5 text-slate-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-white">{insight.department} Department</h3>
                          <Badge className={getPriorityColor(insight.priority)}>{insight.priority.toUpperCase()}</Badge>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(insight.trend)}
                            <span className="text-xs text-slate-400">Trending</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-emerald-400">{insight.impact}</p>
                            <p className="text-xs text-slate-500">Potential Impact</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-blue-400">{insight.confidence}%</p>
                            <p className="text-xs text-slate-500">Confidence</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed mb-4">{insight.insight}</p>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDepartmentChange(insight.department.toLowerCase().replace(" ", "-"))}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          {insight.action}
                        </Button>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          <span>Updated 5 minutes ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <BarChart3 className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white">Analytics Deep Dive</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">Explore detailed performance metrics and trends</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">View Analytics</Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Brain className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white">AI Strategy Session</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">Get personalized business recommendations</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Start Session</Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Target className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white">Goal Tracking</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">Monitor progress towards quarterly objectives</p>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">View Goals</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}