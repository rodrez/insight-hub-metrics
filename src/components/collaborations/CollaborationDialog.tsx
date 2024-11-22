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
    },
  });

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