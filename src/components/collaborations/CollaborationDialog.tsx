import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CollaborationFormFields } from "./CollaborationFormFields";
import { CollaboratorType } from "@/lib/types/collaboration";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { collaborationFormSchema, type CollaborationFormSchema } from "./CollaborationFormFields";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";

export interface CollaborationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaboratorId?: string | null;
  departmentId?: string;
  collaborationType?: "fortune30" | "sme";
}

export function CollaborationDialog({ 
  open, 
  onOpenChange, 
  collaboratorId,
  departmentId,
  collaborationType = 'fortune30'
}: CollaborationDialogProps) {
  const { data: collaborator, isLoading } = useQuery({
    queryKey: ['collaborator', collaboratorId],
    queryFn: () => collaboratorId ? db.getCollaborator(collaboratorId) : null,
    enabled: !!collaboratorId
  });

  const form = useForm<CollaborationFormSchema>({
    resolver: zodResolver(collaborationFormSchema),
    defaultValues: {
      name: collaborator?.name || "",
      email: collaborator?.email || "",
      role: collaborator?.role || "",
      department: departmentId || collaborator?.department || "",
      type: collaborationType,
      color: collaborator?.color || "#4B5563", // Default color
      agreementType: "None",
      primaryContact: collaborator?.primaryContact || {
        name: "",
        role: "",
        email: "",
      },
    },
  });

  // Update form values when collaborator data is loaded
  React.useEffect(() => {
    if (collaborator) {
      form.reset({
        name: collaborator.name,
        email: collaborator.email,
        role: collaborator.role,
        department: collaborator.department,
        type: collaborator.type,
        color: collaborator.color,
        agreementType: collaborator.agreements?.nda ? "NDA" : 
                      collaborator.agreements?.jtda ? "JTDA" : 
                      (collaborator.agreements?.nda && collaborator.agreements?.jtda) ? "Both" : "None",
        primaryContact: collaborator.primaryContact,
      });
    }
  }, [collaborator, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <CollaborationFormFields
                onSubmit={() => onOpenChange(false)}
                initialData={collaborator || null}
                collaborationType={collaborationType}
                departmentId={departmentId}
              />
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}