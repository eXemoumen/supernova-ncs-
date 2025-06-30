"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"

 interface AddClientFormProps {
  onClientAdded?: () => void;
}

function AddClientForm({ onClientAdded }: AddClientFormProps) {
  const [clientName, setClientName] = useState("")
  const [clientNiche, setClientNiche] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      name: clientName,
      niche: clientNiche,
      contact_person: contactPerson,
      contact_email: contactEmail,
      notes: notes,
      // Add dummy values for industry, satisfaction, tier for now
      industry: "", // This should ideally come from a selection or be inferred
      satisfaction: 0, // Default value
      tier: "", // Default value
    }

    try {
      const response = await fetch("/api/clients", {
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
      console.log("Client added successfully:", data)
      alert("Client added successfully!")

      // Reset form and close dialog
      setClientName("")
      setClientNiche("")
      setContactPerson("")
      setContactEmail("")
      setNotes("")
      setOpen(false)
      if (onClientAdded) {
        onClientAdded();
      }
    } catch (error: any) {
      console.error("Error adding client:", error)
      alert(`Failed to add client: ${error.message}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
<Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Client
            </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-slate-800/50 border-slate-700/50 backdrop-blur-sm text-white">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-white">Add New Client</DialogTitle>
          <DialogDescription className="text-slate-400">
            Enter the details for your new client.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="clientName" className="text-slate-300">Client Name</Label>
              <Input
                id="clientName"
                type="text"
                placeholder="Acme Corp"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="mt-1 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="clientNiche" className="text-slate-300">Client Niche</Label>
              <Select value={clientNiche} onValueChange={setClientNiche} required>
                <SelectTrigger className="w-full mt-1 bg-slate-900/50 border-slate-600 text-white focus:border-blue-500">
                  <SelectValue placeholder="Select a niche" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="contactPerson" className="text-slate-300">Contact Person</Label>
              <Input
                id="contactPerson"
                type="text"
                placeholder="John Doe"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="mt-1 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="contactEmail" className="text-slate-300">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="john.doe@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="mt-1 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="text-slate-300">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any specific requirements or details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="mt-1 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Client
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddClientForm