"use client";
import {
  Plus,
  ChevronDown,
  Search,
  Notebook,
  NotebookPen,
  Edit,
  Trash2,
  ArrowLeft,
  Zap,
  Users,
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
import { Badge } from "@/components/ui/badge";
import { DepartmentChatbot } from "@/components/department-chatbot";
import { useIsMobile } from "@/hooks/use-mobile";

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

interface ClientsProps {
  onBack: () => void;
  department: any;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

function Clients({ onBack: onBackAction, department, activeSection = "dashboard", onSectionChange }: ClientsProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  const renderClientsContent = () => (
    <div className="w-full">
      {/* Header with search and action */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Clients list
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your clients
          </p>
        </div>

        <div className="flex gap-3">
          <AddClientForm onClientAdded={fetchClients} />
        </div>
      </div>

      {/* Modern Card Table */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden shadow-lg">
        {/* Table Header - 8 columns (using col-span-2 for each) */}
        <div className="grid grid-cols-10 gap-2 sm:gap-4 px-4 sm:px-6 py-3 bg-slate-900/60 border-b border-slate-700/50">
          <div className="col-span-3 sm:col-span-2 flex items-center text-sm font-medium text-slate-300">
            Client name
          </div>
          <div className="col-span-3 sm:col-span-3 flex items-center text-sm font-medium text-slate-300 hidden sm:flex">
            Niche
          </div>
          <div className="col-span-4 sm:col-span-3 flex items-center text-sm font-medium text-slate-300">
            Email
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center text-sm font-medium text-slate-300 hidden sm:flex">
            Number
          </div>

          <div className="col-span-3 sm:col-span-1 flex justify-end text-sm font-medium text-slate-300">
            Actions
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-700/50">
          {clients.length === 0 ? (
            <p className="text-slate-400 p-4 text-center">
              No clients found. Add a new client to get started!
            </p>
          ) : (
            clients.map((client) => (
              <div
                key={client.id}
                className="grid grid-cols-10 gap-2 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-slate-700/30 transition-colors"
              >
                {/* Client name */}
                <div className="col-span-3 sm:col-span-2 flex items-center">
                  <p className="font-medium text-sm sm:text-base text-white truncate">
                    {client.name}
                  </p>
                </div>

                {/* Niche */}
                <div className="col-span-3 hidden sm:flex items-center">
                  <span className="text-sm text-slate-300 truncate">
                    {client.niche}
                  </span>
                </div>

                {/* Email */}
                <div className="col-span-4 sm:col-span-3 flex items-center">
                  <span className="text-xs sm:text-sm text-slate-300 truncate">
                    {client.contact_email}
                  </span>
                </div>

                {/* Number (hidden on mobile) */}
                <div className="col-span-1 hidden sm:flex items-center">
                  <span className="text-sm text-slate-300">
                    {typeof client.id === 'string' ? client.id.slice(0, 5) : String(client.id).slice(0, 5)}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-3 sm:col-span-1 flex justify-end space-x-1 sm:space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditClick(client)}
                    className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteClient(client.id)}
                    className="h-8 w-8 p-0 text-slate-300 hover:text-red-400 hover:bg-slate-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateClient}>
            <div>
              <Label htmlFor="edit-name" className="text-slate-300">
                Client Name
              </Label>
              <Input
                id="edit-name"
                value={currentClient?.name}
                onChange={(e) => {
                  if (currentClient) {
                    setCurrentClient({
                      ...currentClient,
                      name: e.target.value,
                    });
                  }
                }}
                className="border-slate-600 bg-slate-900/50 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-niche" className="text-slate-300">
                Niche
              </Label>
              <Input
                id="edit-niche"
                value={currentClient?.niche}
                onChange={(e) => {
                  if (currentClient) {
                    setCurrentClient({
                      ...currentClient,
                      niche: e.target.value,
                    });
                  }
                }}
                className="border-slate-600 bg-slate-900/50 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-contact-person" className="text-slate-300">
                Contact Person
              </Label>
              <Input
                id="edit-contact-person"
                value={currentClient?.contact_person}
                onChange={(e) => {
                  if (currentClient) {
                    setCurrentClient({
                      ...currentClient,
                      contact_person: e.target.value,
                    });
                  }
                }}
                className="border-slate-600 bg-slate-900/50 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-contact-email" className="text-slate-300">
                Contact Email
              </Label>
              <Input
                id="edit-contact-email"
                value={currentClient?.contact_email}
                onChange={(e) => {
                  if (currentClient) {
                    setCurrentClient({
                      ...currentClient,
                      contact_email: e.target.value,
                    });
                  }
                }}
                className="border-slate-600 bg-slate-900/50 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-notes" className="text-slate-300">
                Notes
              </Label>
              <Textarea
                id="edit-notes"
                value={currentClient?.notes}
                onChange={(e) => {
                  if (currentClient) {
                    setCurrentClient({
                      ...currentClient,
                      notes: e.target.value,
                    });
                  }
                }}
                className="h-20 border-slate-600 bg-slate-900/50 text-white"
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Professional Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-xl shadow-lg">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base md:text-xl font-semibold text-white truncate">
                    Client Management
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400 hidden sm:block truncate max-w-[200px] md:max-w-xs">
                    Manage your client relationships
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="text-slate-300 bg-transparent border-slate-600 hover:bg-slate-700 h-8 px-2 sm:px-3"
                onClick={onBackAction}
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-medium text-xs hidden sm:inline-flex">
                <Zap className="h-3 w-3 mr-1" />
                AI Enabled
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Main Content and Chatbot Layout */}
        <div className="flex flex-1 w-full">
          {/* Main Content Area */}
          <div className={`${isMobile ? 'w-full' : 'w-2/3'} p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto`}>
            {renderClientsContent()}
          </div>
          
          {/* Integrated Chatbot (Desktop Only) */}
          {!isMobile && (
            <div className="w-1/3 border-l border-slate-700/50">
              <DepartmentChatbot 
                department="Client Management"
                specialization="client relationship management"
                displayMode="integrated"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Chatbot (Overlay Mode) */}
      {isMobile && (
        <DepartmentChatbot 
          department="Client Management"
          specialization="client relationship management"
          displayMode="overlay"
        />
      )}
    </div>
  );
}

export default Clients;

