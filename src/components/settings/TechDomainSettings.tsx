import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Plus, Trash } from "lucide-react";
import { TechDomain, defaultTechDomains } from "@/lib/types/techDomain";
import { toast } from "@/components/ui/use-toast";

export function TechDomainSettings() {
  const [domains, setDomains] = useState<TechDomain[]>(defaultTechDomains);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newDomain, setNewDomain] = useState<Partial<TechDomain>>({});

  const handleAdd = () => {
    if (!newDomain.name || !newDomain.color || !newDomain.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const id = newDomain.name.toLowerCase().replace(/\s+/g, '-');
    setDomains([...domains, { ...newDomain, id } as TechDomain]);
    setNewDomain({});
    toast({
      title: "Success",
      description: "Tech domain added successfully",
    });
  };

  const handleDelete = (id: string) => {
    setDomains(domains.filter(d => d.id !== id));
    setDeleteId(null);
    toast({
      title: "Success",
      description: "Tech domain deleted successfully",
    });
  };

  const handleUpdate = (id: string, updates: Partial<TechDomain>) => {
    setDomains(domains.map(d => d.id === id ? { ...d, ...updates } : d));
    toast({
      title: "Success",
      description: "Tech domain updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Add New Tech Domain</h3>
        <div className="grid gap-4">
          <div>
            <Input
              placeholder="Domain Name"
              value={newDomain.name || ''}
              onChange={e => setNewDomain({ ...newDomain, name: e.target.value })}
            />
          </div>
          <div className="flex gap-4 items-center">
            <Input
              type="color"
              value={newDomain.color || '#000000'}
              onChange={e => setNewDomain({ ...newDomain, color: e.target.value })}
              className="w-20 h-10"
            />
            <div
              className="w-10 h-10 rounded border"
              style={{ backgroundColor: newDomain.color }}
            />
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={newDomain.description || ''}
              onChange={e => setNewDomain({ ...newDomain, description: e.target.value })}
            />
          </div>
          <Button onClick={handleAdd} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Domain
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Existing Tech Domains</h3>
        {domains.map(domain => (
          <div key={domain.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <div
              className="w-6 h-6 rounded"
              style={{ backgroundColor: domain.color }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{domain.name}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{domain.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(domain.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tech domain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}