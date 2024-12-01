import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { InitiativeCard } from "./InitiativeCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { InitiativeForm } from "./InitiativeForm";

export function InitiativesList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: initiatives, refetch } = useQuery({
    queryKey: ['initiatives'],
    queryFn: () => db.getAllInitiatives()
  });

  const handleFormSuccess = () => {
    refetch();
    setIsFormOpen(false);
  };

  if (!initiatives) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Initiatives</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Initiative</DialogTitle>
            </DialogHeader>
            <InitiativeForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4">
        {initiatives.map((initiative) => (
          <InitiativeCard
            key={initiative.id}
            initiative={initiative}
            onUpdate={() => refetch()}
          />
        ))}
      </div>
    </div>
  );
}