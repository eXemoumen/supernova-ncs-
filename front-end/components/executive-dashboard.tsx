"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import Link from "next/link";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AddClientForm from "./add-client-form";

interface ExecutiveDashboardProps {
  onDepartmentChange: (department: string) => void;
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

// Add the missing iconMap definition
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

export function ExecutiveDashboard({
  onDepartmentChange,
}: ExecutiveDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const [revenueData, setRevenueData] = useState<RevenueDatum[]>([]);
  const [loadingRevenue, setLoadingRevenue] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoadingRevenue(true);
      try {
        const response = await fetch(`http://localhost:3001/api/dashboard/revenue?timeframe=${selectedTimeframe}`);
        if (!response.ok) {
          throw new Error('Failed to fetch revenue data');
        }
        const data = await response.json();
        setRevenueData(data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setLoadingRevenue(false);
      }
    };

    fetchRevenueData();
  }, [selectedTimeframe]);

  const [departmentPerformance, setDepartmentPerformance] = useState<
    DepartmentPerformanceDatum[]
  >([]);
  const [loadingDepartmentPerformance, setLoadingDepartmentPerformance] =
    useState(true);

  useEffect(() => {
    const fetchDepartmentPerformance = async () => {
      setLoadingDepartmentPerformance(true);
      try {
        const response = await fetch(`http://localhost:3001/api/dashboard/department-performance?timeframe=${selectedTimeframe}`);
        if (!response.ok) {
          throw new Error('Failed to fetch department performance data');
        }
        const data = await response.json();
        setDepartmentPerformance(data);
      } catch (error) {
        console.error("Error fetching department performance data:", error);
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
        const response = await fetch(`http://localhost:3001/api/dashboard/ai-insights?timeframe=${selectedTimeframe}`);
        if (!response.ok) {
          throw new Error('Failed to fetch AI insights data');
        }
        const data = await response.json();
        setAiInsights(data);
      } catch (error) {
        console.error("Error fetching AI insights:", error);
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
        const response = await fetch(`http://localhost:3001/api/dashboard/kpi-metrics?timeframe=${selectedTimeframe}`);
        if (!response.ok) {
          throw new Error('Failed to fetch KPI metrics data');
        }
        const data = await response.json();
        setKpiMetrics(data);
      } catch (error) {
        console.error("Error fetching KPI metrics:", error);
      } finally {
        setLoadingKpiMetrics(false);
      }
    };

    fetchKpiMetrics();
  }, [selectedTimeframe]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "high":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "medium":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "low":
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-emerald-400" />;
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-red-400" />;
      default:
        return <Activity className="h-4 w-4 text-slate-400" />;
    }
  };

  // Get responsive grid classes based on screen size
  const getGridClasses = () => {
    if (isMobile) return "grid grid-cols-1 gap-4";
    if (isTablet) return "grid grid-cols-2 gap-6";
    return "grid grid-cols-4 gap-6";
  };

  // Get responsive chart height based on screen size
  const getChartHeight = () => {
    if (isMobile) return 200;
    if (isTablet) return 240;
    return 280;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
            Executive Dashboard
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Real-time insights and AI-powered recommendations
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:items-center">
          {!isMobile && <AddClientForm />}

          <div className="flex items-center space-x-1 bg-slate-800/50 rounded-lg p-1 md:p-2 self-start md:self-auto">
            {["7d", "30d", "90d", "1y"].map((period) => (
              <Button
                key={period}
                variant={selectedTimeframe === period ? "secondary" : "ghost"}
                className={cn(
                  "h-8 text-xs md:text-sm",
                  selectedTimeframe === period 
                    ? "bg-slate-700 text-white" 
                    : "text-slate-400 hover:text-white"
                )}
                onClick={() => setSelectedTimeframe(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className={getGridClasses()}>
        {loadingKpiMetrics
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="loading h-16 animate-pulse bg-slate-700/50 rounded-md"></div>
                  </CardContent>
                </Card>
              ))
          : kpiMetrics.map((metric, i) => {
              const IconComponent = iconMap[metric.icon];
          return (
            <Card
                  key={i}
                  className="bg-slate-800/50 border-slate-700/50 overflow-hidden relative group"
            >
              <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                  <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full ${metric.color}`}
                  >
                        <IconComponent className="h-5 w-5" />
                  </div>
                      <div className="flex items-center text-sm">
                    {getTrendIcon(metric.trend)}
                    <span
                          className={`ml-1 ${
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
                    <div className="space-y-1">
                      <h3 className="text-slate-400 text-sm font-medium">
                        {metric.title}
                      </h3>
                      <div className="text-2xl md:text-3xl font-bold text-white">
                    {metric.value}
                      </div>
                      <p className="text-xs text-slate-500">
                    {metric.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart Section */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white">
            Revenue & Expenses
            </CardTitle>
            <CardDescription className="text-slate-400">
            {selectedTimeframe} performance overview
            </CardDescription>
          </CardHeader>
          <CardContent>
          {loadingRevenue ? (
            <div className="loading h-[280px] animate-pulse bg-slate-700/50 rounded-md"></div>
          ) : (
            <div className="h-[200px] md:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={revenueData}
                  margin={{
                    top: 20,
                    right: 10,
                    left: isMobile ? 0 : 10,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "#334155" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "#334155" }}
                    tickFormatter={(value) =>
                      isMobile ? `$${value / 1000}k` : `$${value}`
                    }
                    width={isMobile ? 40 : 60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#334155",
                      borderRadius: "0.375rem",
                      color: "#f8fafc",
                    }}
                    formatter={(value: any) => [`$${value}`, ""]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4C9AFF"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: "#4C9AFF", stroke: "#1e293b" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#FF5630"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: "#FF5630", stroke: "#1e293b" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#36B37E"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: "#36B37E", stroke: "#1e293b" }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          )}
          </CardContent>
        </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">
              Department Performance
            </CardTitle>
            <CardDescription className="text-slate-400">
              Efficiency scores across teams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingDepartmentPerformance
                ? Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="loading h-4 w-24 bg-slate-700/50 rounded"></div>
                        <div className="loading h-2 w-full bg-slate-700/50 rounded-full"></div>
                      </div>
                    ))
                : departmentPerformance.map((dept, i) => (
                    <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-300">
                          {dept.name}
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {dept.value}%
                        </div>
                  </div>
                  <Progress
                    value={dept.value}
                    className="h-2 bg-slate-700/50"
                    style={{ "--progress-color": dept.color } as React.CSSProperties}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                className="w-full bg-slate-700/80 text-white hover:bg-slate-700"
                onClick={() => onDepartmentChange("operations")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View All Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-lg text-white">AI Insights</CardTitle>
                <CardDescription className="text-slate-400">
                  Data-driven business recommendations
                </CardDescription>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                AI
                </Badge>
          </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              {loadingAiInsights
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="loading p-4 bg-slate-700/50 rounded-md"
                      ></div>
                    ))
                : aiInsights.map((insight, i) => {
                    const InsightIcon = iconMap[insight.icon];
              return (
                <div
                        key={i}
                        className="p-4 bg-slate-700/20 rounded-md border border-slate-700/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <InsightIcon className="h-5 w-5 text-slate-300 mr-2" />
                            <Badge
                              className={`${getPriorityColor(
                                insight.priority
                              )}`}
                            >
                              {insight.priority.charAt(0).toUpperCase() +
                                insight.priority.slice(1)}
                            </Badge>
                    </div>
                          <Badge className="bg-slate-600/50 text-slate-300">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-white text-sm mb-3">
                          {insight.insight}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center">
                            <span className="text-slate-400 mr-1">Impact:</span>
                            <span className="text-emerald-400 font-medium">
                              {insight.impact}
                            </span>
                          </div>
                        <Button
                            size="sm"
                          variant="outline"
                            className="h-7 text-xs border-slate-600 hover:bg-slate-700/50 hover:text-white"
                            onClick={() => onDepartmentChange(insight.department)}
                          >
                            View Department
                        </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
              </div>

      {/* Departments Quick Access */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Department Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {["content-studio", "marketing", "support", "hr", "finance", "operations"].map(
            (department, i) => {
              let Icon;
              let name;
              let color;

              switch (department) {
                case "content-studio":
                  Icon = Sparkles;
                  name = "Content Studio";
                  color = "from-indigo-500 to-purple-500";
                  break;
                case "marketing":
                  Icon = BarChart3;
                  name = "Marketing";
                  color = "from-blue-500 to-cyan-500";
                  break;
                case "support":
                  Icon = MessageSquare;
                  name = "Support";
                  color = "from-emerald-500 to-green-500";
                  break;
                case "hr":
                  Icon = Users;
                  name = "HR";
                  color = "from-green-500 to-emerald-500";
                  break;
                case "finance":
                  Icon = DollarSign;
                  name = "Finance";
                  color = "from-purple-500 to-pink-500";
                  break;
                case "operations":
                  Icon = Brain;
                  name = "Operations";
                  color = "from-orange-500 to-amber-500";
                  break;
                default:
                  Icon = Settings;
                  name = department;
                  color = "from-slate-500 to-slate-600";
              }

              return (
                <Button
                  key={i}
                  className={`h-auto p-4 flex flex-col items-center justify-center space-y-2 
                    bg-gradient-to-br ${color} hover:opacity-90 transition-opacity border-0
                    group shadow-lg`}
                  onClick={() => onDepartmentChange(department)}
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
            </div>
                  <span className="text-white font-medium text-xs md:text-sm">
                    {name}
                  </span>
            </Button>
              );
            }
          )}
            </div>
      </div>
    </div>
  );
}
