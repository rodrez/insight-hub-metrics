import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info, Pencil, Trash2 } from "lucide-react";
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
import { EditPartnerDialog } from "./EditPartnerDialog";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SMESettings() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editPartner, setEditPartner] = useState<any | null>(null);

  const { data: partners = [], refetch } = useQuery({
    queryKey: ['sme-partners'],
    queryFn: async () => {
      const smePartners = await db.getAllSMEPartners();
      return smePartners;
    }
  });

  const handleDelete = async (id: string) => {
    try {
      // Implement delete when available in db service
      await refetch();
      toast({
        title: "Success",
        description: "Partner deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete partner",
        variant: "destructive"
      });
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">SME Partners</h3>
        
        {/* Color Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-card rounded-lg">
          {partners.map(partner => (
            <TooltipProvider key={partner.id}>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: partner.color }}
                    />
                    <span className="text-sm">{partner.name}</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{partner.role || 'SME Partner'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        <div className="grid gap-4">
          {partners.map(partner => (
            <Card key={partner.id} className="p-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: partner.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Input
                      value={partner.name}
                      readOnly
                      className="max-w-[200px]"
                    />
                    <Input
                      type="color"
                      value={partner.color}
                      readOnly
                      className="w-20 h-10"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditPartner(partner)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setDeleteId(partner.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {partner.role || 'SME Partner'}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this partner.
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

      <EditPartnerDialog
        partner={editPartner}
        onClose={() => setEditPartner(null)}
        onUpdate={async (updated) => {
          try {
            await db.addSMEPartner(updated);
            await refetch();
            setEditPartner(null);
            toast({
              title: "Success",
              description: "Partner updated successfully",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to update partner",
              variant: "destructive"
            });
          }
        }}
      />
    </div>
  );
}