import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CollaborationFormFields, formSchema, CollaborationFormSchema } from "./CollaborationFormFields";
import { useEffect } from "react";
import { db } from "@/lib/db";

type CollaborationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaboratorId?: string | null;
  departmentId?: string;
};

export function CollaborationDialog({
  open,
  onOpenChange,
  collaboratorId,
  departmentId,
}: CollaborationDialogProps) {
  const form = useForm<CollaborationFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      department: departmentId || "",
      agreementType: "None",
      details: "",
      color: "#000000",
    },
  });

  useEffect(() => {
    const loadCollaborator = async () => {
      if (collaboratorId) {
        try {
          const collaborator = await db.getCollaborator(collaboratorId);
          if (collaborator) {
            // Determine agreement type based on existing agreements
            let agreementType: "None" | "NDA" | "JTDA" | "Both" = "None";
            if (collaborator.agreements?.nda && collaborator.agreements?.jtda) {
              agreementType = "Both";
            } else if (collaborator.agreements?.nda) {
              agreementType = "NDA";
            } else if (collaborator.agreements?.jtda) {
              agreementType = "JTDA";
            }

            form.reset({
              name: collaborator.name,
              email: collaborator.email,
              role: collaborator.role,
              department: collaborator.department,
              agreementType,
              signedDate: collaborator.agreements?.nda?.signedDate || collaborator.agreements?.jtda?.signedDate,
              expiryDate: collaborator.agreements?.nda?.expiryDate || collaborator.agreements?.jtda?.expiryDate,
              details: "",
              color: collaborator.color || "#000000",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load collaborator data",
            variant: "destructive",
          });
        }
      } else {
        // Reset form when creating new collaborator
        form.reset({
          name: "",
          email: "",
          role: "",
          department: departmentId || "",
          agreementType: "None",
          details: "",
          color: "#000000",
        });
      }
    };

    loadCollaborator();
  }, [collaboratorId, departmentId, form]);

  const onSubmit = async (values: CollaborationFormSchema) => {
    try {
      // Implement save logic here
      toast({
        title: "Success",
        description: collaboratorId
          ? "Collaboration updated successfully"
          : "New collaboration created successfully",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {collaboratorId ? "Edit Collaboration" : "New Collaboration"}
          </DialogTitle>
          <DialogDescription>
            Add or update collaboration details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CollaborationFormFields form={form} departmentId={departmentId} />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}