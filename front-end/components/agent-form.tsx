"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Play, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AgentFormProps {
  department?: { name: string } | string
  onClose?: () => void
}

export function AgentForm({ 
  department = "general", 
  onClose = () => {} 
}: AgentFormProps) {
  const [isRunning, setIsRunning] = useState(false)
  const { toast } = useToast()

  const [moduleType, setModuleType] = useState("")
  const [priority, setPriority] = useState("")
  const [budget, setBudget] = useState<number | string>("")
  const [targetAudience, setTargetAudience] = useState("")
  const [schedule, setSchedule] = useState("")
  const [outputFormat, setOutputFormat] = useState("")
  const [instructions, setInstructions] = useState("")

  const handleRun = async () => {
    setIsRunning(true)

    const payload = {
      department: typeof department === "string" ? department : department.name,
      module_type: moduleType,
      priority,
      budget: Number(budget),
      target_audience: targetAudience,
      schedule,
      output_format: outputFormat,
      instructions,
    }

    try {
      const response = await fetch("/api/agent/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      toast({
        title: "AI Module Started",
        description: data.message || "Your AI agent is now processing the task.",
      })
    } catch (error: any) {
      console.error("Error initiating AI run:", error)
      toast({
        title: "Failed to Start AI Module",
        description: error.message || "There was an error processing your request.",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const handleSave = () => {
    toast({
      title: "Configuration Saved",
      description: "AI module configuration has been saved successfully.",
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <span>Configure AI Module</span>
            <Badge variant="outline" className="capitalize">
              {typeof department === "string" ? department : department.name}
            </Badge>
          </CardTitle>
          <CardDescription>Set up parameters and preferences for your AI automation</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="module-type">Module Type</Label>
              <Select value={moduleType} onValueChange={setModuleType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select module type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content">Content Generation</SelectItem>
                  <SelectItem value="analysis">Data Analysis</SelectItem>
                  <SelectItem value="automation">Process Automation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget">Budget Limit ($)</Label>
              <Input id="budget" type="number" placeholder="100" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="target-audience">Target Audience</Label>
              <Input id="target-audience" placeholder="e.g., Young professionals, 25-35" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="schedule">Schedule</Label>
              <Select value={schedule} onValueChange={setSchedule}>
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Run Immediately</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="output-format">Output Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                  <SelectItem value="csv">CSV Export</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="instructions">Custom Instructions</Label>
          <Textarea
            id="instructions"
            placeholder="Provide specific instructions for the AI module..."
            className="min-h-[100px]"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
          <Button onClick={handleRun} disabled={isRunning}>
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run AI Module
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
