"use client";
import {
  Plus,
  ChevronDown,
  Search,
  Notebook,
  NotebookPen,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddClientForm from "../add-client-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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

function Clients() {
<<<<<<< Updated upstream
  const [clients, setClients] = useState<Client[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleEditClick = (client: Client) => {
    setCurrentClient(client);
    setIsEditDialogOpen(true);
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient) return;

    try {
      const response = await fetch(`/api/clients/${currentClient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentClient),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Client Updated",
        description: `${currentClient.name} has been updated successfully.`,
      });
      setIsEditDialogOpen(false);
      fetchClients(); // Refresh the list
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: "Failed to update client. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!window.confirm("Are you sure you want to delete this client?")) {
      return;
    }

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Client Deleted",
        description: "Client has been deleted successfully.",
      });
      fetchClients(); // Refresh the list
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      });
    }
  };
=======
  // Sample data
  const clients = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Admin', status: 'active', lastLogin: '2h ago', avatar: '/avatars/01.png' },
    { id: 2, name: 'Maria Garcia', email: 'maria@example.com', role: 'Editor', status: 'active', lastLogin: '5h ago', avatar: '/avatars/02.png' },
    { id: 3, name: 'David Kim', email: 'david@example.com', role: 'Developer', status: 'inactive', lastLogin: '1d ago', avatar: '/avatars/03.png' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Viewer', status: 'active', lastLogin: '30m ago', avatar: '/avatars/04.png' },
  ]
>>>>>>> Stashed changes

  return (
    <div className="px-5 mt-5  mx-auto">
      {/* Header with search and action */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Clients list
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your clients
          </p>
        </div>

        <div className="flex gap-3">
          <AddClientForm onClientAdded={fetchClients} />
        </div>
      </div>

      {/* Modern Card Table */}
      <div className="dark:bg-gray-900 rounded-lg border  dark:border-gray-800 overflow-hidden">
        {/* Table Header - 8 columns (using col-span-2 for each) */}
        <div className="grid grid-cols-10 gap-4 px-6 py-3  dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
          <div className="col-span-2 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            Client name
          </div>
          <div className="col-span-3 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            Niche
          </div>
          <div className="col-span-3 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            Email
          </div>
          <div className="col-span-1 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            number
          </div>

          <div className="col-span-1 flex justify-end text-sm font-medium text-gray-500 dark:text-gray-400"></div>
        </div>

<<<<<<< Updated upstream
        {/* Table Rows */}
        <div className="divide-y  dark:divide-gray-800 justify-between">
          {clients.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 p-4">
              No clients found. Add a new client to get started!
            </p>
          ) : (
            clients.map((client) => (
              <div
                key={client.id}
                className="grid grid-cols-10 gap-4 px-6 py-4  dark:hover:bg-gray-800/50 transition-colors"
              >
                {/* Client name */}
                <div className="col-span-2 flex items-center">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {client.name}
                  </p>
                </div>

                {/* Niche */}
                <div className="col-span-3 flex items-center">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {client.niche}
                  </span>
                </div>

                {/* Email */}
                <div className="col-span-3 flex items-center">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {client.contact_email}
                  </span>
                </div>

                {/* Contact Person (using 'number' column for now) */}
                <div className="col-span-1 flex items-center">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {client.contact_person}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(client)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Table Footer */}
        <div className="px-6 py-3  dark:bg-gray-800 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-medium">{clients.length > 0 ? 1 : 0}</span> to{" "}
            <span className="font-medium">{clients.length}</span> of{" "}
            <span className="font-medium">{clients.length}</span> clients
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
=======
  {/* Table Rows */}
  <div className="divide-y  dark:divide-gray-800 justify-between">
    {clients.map((client) => (
      <div key={client.id} className="grid grid-cols-10 gap-4 px-6 py-4  dark:hover:bg-gray-800/50 transition-colors">
        {/* Fullname */}
        <div className="col-span-2 flex items-center">
          <p className="font-medium text-gray-900 dark:text-white">{client.name}</p>
        </div>
        
        {/* Fullname */}
        <div className="col-span-3 flex items-center">
          <span className="text-sm text-gray-900 dark:text-white">{client.name}</span>
        </div>
        
        {/* Email */}
        <div className="col-span-3 flex items-center">
          <span className="text-sm text-gray-900 dark:text-white">{client.email}</span>
        </div>
        
        {/* Role */}
        <div className="col-span-1 flex items-center">
          <span className="text-sm text-gray-900 dark:text-white">{client.role}</span>
        </div>
        
       
        {/* Actions */}
    
        <div className="col-span-1 flex items-center justify-center">
          <Edit className="h-4 w-4" />
>>>>>>> Stashed changes
        </div>
      </div>

<<<<<<< Updated upstream
      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl bg-slate-800/50 border-slate-700/50 backdrop-blur-sm text-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-white">
              Edit Client
            </DialogTitle>
          </DialogHeader>
          {currentClient && (
            <form onSubmit={handleUpdateClient} className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="editClientName" className="text-slate-300">
                    Client Name
                  </Label>
                  <Input
                    id="editClientName"
                    type="text"
                    value={currentClient.name}
                    onChange={(e) =>
                      setCurrentClient({
                        ...currentClient,
                        name: e.target.value,
                      })
                    }
                    required
                    className="mt-1 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="editClientNiche" className="text-slate-300">
                    Client Niche
                  </Label>
                  <Select
                    value={currentClient.niche}
                    onValueChange={(value) =>
                      setCurrentClient({ ...currentClient, niche: value })
                    }
                    required
                  >
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
                  <Label htmlFor="editContactPerson" className="text-slate-300">
                    Contact Person
                  </Label>
                  <Input
                    id="editContactPerson"
                    type="text"
                    value={currentClient.contact_person}
                    onChange={(e) =>
                      setCurrentClient({
                        ...currentClient,
                        contact_person: e.target.value,
                      })
                    }
                    className="mt-1 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="editContactEmail" className="text-slate-300">
                    Contact Email
                  </Label>
                  <Input
                    id="editContactEmail"
                    type="email"
                    value={currentClient.contact_email}
                    onChange={(e) =>
                      setCurrentClient({
                        ...currentClient,
                        contact_email: e.target.value,
                      })
                    }
                    className="mt-1 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="editNotes" className="text-slate-300">
                  Additional Notes
                </Label>
                <Textarea
                  id="editNotes"
                  value={currentClient.notes}
                  onChange={(e) =>
                    setCurrentClient({
                      ...currentClient,
                      notes: e.target.value,
                    })
                  }
                  rows={4}
                  className="mt-1 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
=======
  {/* Table Footer */}
  <div className="px-6 py-3  dark:bg-gray-800 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of <span className="font-medium">24</span> clients
    </p>
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        Previous
      </Button>
      <Button variant="outline" size="sm">
        Next
      </Button>
>>>>>>> Stashed changes
    </div>
  );
}

export default Clients;
