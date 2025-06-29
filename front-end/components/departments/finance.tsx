"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, DollarSign, MessageSquare, TrendingUp, TrendingDown, PieChart, CreditCard } from "lucide-react"
import { DepartmentChatbot } from "@/components/department-chatbot"

interface FinanceProps {
  onBack: () => void
  department: any
}

export default function Finance({ onBack, department }: FinanceProps) {
  const [showChatbot, setShowChatbot] = useState(false)

  const expenses = [
    { category: "Marketing", amount: "$12,500", change: "+5%", trend: "up" },
    { category: "Operations", amount: "$8,200", change: "-2%", trend: "down" },
    { category: "Salaries", amount: "$45,000", change: "+1%", trend: "up" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Finance Control</h1>
                  <p className="text-sm text-slate-500">Financial planning & expense management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => setShowChatbot(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Finance AI
              </Button>
              <Badge variant="outline" className="bg-amber-50 text-amber-700">
                6 Finance Team
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">$125K</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Expenses</p>
                  <p className="text-2xl font-bold text-slate-900">$87K</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Profit Margin</p>
                  <p className="text-2xl font-bold text-slate-900">30.4%</p>
                </div>
                <PieChart className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Cash Flow</p>
                  <p className="text-2xl font-bold text-slate-900">$38K</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expense Breakdown */}
        <Card className="border-0 shadow-lg bg-white/80">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Monthly expense analysis by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.map((expense, index) => (
                <div key={index} className="p-4 border rounded-lg bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">{expense.category}</h3>
                      <p className="text-2xl font-bold text-slate-900">{expense.amount}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {expense.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <Badge
                        variant="outline"
                        className={
                          expense.trend === "up" ? "text-emerald-700 border-emerald-200" : "text-red-700 border-red-200"
                        }
                      >
                        {expense.change}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chatbot */}
      {showChatbot && (
        <DepartmentChatbot
          department="Finance"
          onClose={() => setShowChatbot(false)}
          specialization="financial planning, budget analysis, and expense optimization"
        />
      )}
    </div>
  )
}
