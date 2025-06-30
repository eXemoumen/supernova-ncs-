
"use client"

"use client"

import { useState, useEffect } from "react"
import AddClientForm from "@/components/add-client-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

interface Client {
  id: string;
  name: string;
  niche: string;
  contact_person: string;
  contact_email: string;
  notes: string;
  industry: string;
  satisfaction: number;
  tier: string;
}

export default function AddClientPage() {
  const [clients, setClients] = useState<Client[]>([])
  const { toast } = useToast()

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error("Error fetching clients:", error)
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Manage Clients</h1>
      <div className="mb-6">
        <AddClientForm onClientAdded={fetchClients} />
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Existing Clients</CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <p className="text-slate-400">No clients added yet. Add a new client above!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">Niche</TableHead>
                  <TableHead className="text-slate-300">Contact Person</TableHead>
                  <TableHead className="text-slate-300">Contact Email</TableHead>
                  <TableHead className="text-slate-300">Industry</TableHead>
                  <TableHead className="text-slate-300">Tier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-slate-700/30">
                    <TableCell className="font-medium text-white">{client.name}</TableCell>
                    <TableCell className="text-slate-400">{client.niche}</TableCell>
                    <TableCell className="text-slate-400">{client.contact_person}</TableCell>
                    <TableCell className="text-slate-400">{client.contact_email}</TableCell>
                    <TableCell className="text-slate-400">{client.industry}</TableCell>
                    <TableCell className="text-slate-400">{client.tier}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
