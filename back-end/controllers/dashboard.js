const getRevenueData = (req, res) => {
    res.json([
      { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
      { month: "Feb", revenue: 52000, expenses: 35000, profit: 17000 },
      { month: "Mar", revenue: 48000, expenses: 33000, profit: 15000 },
      { month: "Apr", revenue: 61000, expenses: 38000, profit: 23000 },
      { month: "May", revenue: 55000, expenses: 36000, profit: 19000 },
      { month: "Jun", revenue: 67000, expenses: 41000, profit: 26000 },
    ]);
  };
  
  const getDepartmentPerformance = (req, res) => {
    res.json([
      { name: "Marketing", value: 85, color: "#8B5CF6" },
      { name: "Sales", value: 92, color: "#06D6A0" },
      { name: "Support", value: 78, color: "#F59E0B" },
      { name: "Operations", value: 88, color: "#EF4444" },
      { name: "HR", value: 82, color: "#3B82F6" },
    ]);
  };
  
  const getAiInsights = (req, res) => {
    res.json([
      {
        department: "Marketing",
        icon: "BarChart3",
        insight:
          "Campaign ROI increased by 34% this month. AI suggests reallocating 15% more budget to social media channels for optimal performance.",
        priority: "high",
        impact: "+$12K potential revenue",
        confidence: 94,
        action: "Optimize Budget Allocation",
        trend: "up",
      },
      {
        department: "Support",
        icon: "MessageSquare",
        insight:
          "Customer satisfaction dropped 8% due to response time delays. AI recommends implementing automated triage system.",
        priority: "urgent",
        impact: "Prevent 23% churn risk",
        confidence: 89,
        action: "Deploy Auto-Triage",
        trend: "down",
      },
      {
        department: "Sales",
        icon: "Target",
        insight:
          "Q2 pipeline shows 127% growth potential. AI identifies 34 high-value prospects requiring immediate attention.",
        priority: "medium",
        impact: "+$89K projected revenue",
        confidence: 91,
        action: "Focus on Hot Leads",
        trend: "up",
      },
      {
        department: "Operations",
        icon: "Brain",
        insight: "Process efficiency improved 19% with new automation. AI suggests expanding to 3 additional workflows.",
        priority: "medium",
        impact: "Save 12 hours/week",
        confidence: 87,
        action: "Scale Automation",
        trend: "up",
      },
      {
        department: "HR",
        icon: "Users",
        insight: "Employee engagement scores indicate 15% improvement needed in remote work satisfaction.",
        priority: "low",
        impact: "Reduce turnover by 8%",
        confidence: 83,
        action: "Enhance Remote Culture",
        trend: "neutral",
      },
    ]);
  };
  
  const getKpiMetrics = (req, res) => {
    res.json([
      {
        title: "Total Revenue",
        value: "$2.4M",
        change: "+18.2%",
        trend: "up",
        icon: "DollarSign",
        color: "from-emerald-500 to-emerald-600",
        description: "vs last quarter",
      },
      {
        title: "Active Users",
        value: "12,847",
        change: "+23.1%",
        trend: "up",
        icon: "Users",
        color: "from-blue-500 to-blue-600",
        description: "monthly active",
      },
      {
        title: "Conversion Rate",
        value: "4.8%",
        change: "-2.3%",
        trend: "down",
        icon: "Target",
        color: "from-purple-500 to-purple-600",
        description: "needs attention",
      },
      {
        title: "Customer Satisfaction",
        value: "94.2%",
        change: "+5.7%",
        trend: "up",
        icon: "Star",
        color: "from-amber-500 to-amber-600",
        description: "excellent rating",
      },
    ]);
  };
  
  module.exports = {
    getRevenueData,
    getDepartmentPerformance,
    getAiInsights,
    getKpiMetrics,
  };