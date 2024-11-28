import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CollaborationFormFields } from "./CollaborationFormFields";
import { CollaborationType } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { formSchema, type CollaborationFormSchema } from "./CollaborationFormFields";

export interface CollaborationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaboratorId?: string | null;
  departmentId?: string;
  collaborationType?: CollaborationType;
}

export function CollaborationDialog({ 
  open, 
  onOpenChange, 
  collaboratorId,
  departmentId,
  collaborationType = 'fortune30'
}: CollaborationDialogProps) {
  const form = useForm<CollaborationFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      department: departmentId || "",
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
          <CollaborationFormFields
            form={form}
            collaboratorId={collaboratorId}
            departmentId={departmentId}
            collaborationType={collaborationType}
            onSuccess={() => onOpenChange(false)}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
}