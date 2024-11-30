import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CollaborationFormFields } from "./CollaborationFormFields";
import { CollaboratorType } from "@/lib/types/collaboration";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { collaborationFormSchema, type CollaborationFormSchema } from "./CollaborationFormFields";

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
  const form = useForm<CollaborationFormSchema>({
    resolver: zodResolver(collaborationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      department: departmentId || "",
      type: collaborationType,
      color: "#4B5563", // Default color
      agreementType: "None",
      primaryContact: {
        name: "",
        role: "",
        email: "",
      },
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})}>
            <CollaborationFormFields
              onSubmit={() => onOpenChange(false)}
              initialData={null}
              collaborationType={collaborationType}
              departmentId={departmentId}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}