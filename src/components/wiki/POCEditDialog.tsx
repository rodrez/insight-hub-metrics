import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { ContactFields } from "../collaborations/form/ContactFields";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { ContactPerson } from "@/lib/types/collaboration";
import { FormField, FormItem, FormLabel, FormControl } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type POCEditDialogProps = {
  categoryName: string;
  description: string;
  detailedDescription: string;
  contacts: ContactPerson[];
  onSave: (data: { 
    description: string; 
    detailedDescription: string; 
    contacts: ContactPerson[]; 
  }) => void;
};

type FormValues = {
  lobName: string;
  description: string;
  detailedDescription: string;
  contacts: {
    primaryContact: ContactPerson;
  }[];
};

export function POCEditDialog({ 
  categoryName, 
  description,
  detailedDescription,
  contacts, 
  onSave 
}: POCEditDialogProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      lobName: categoryName,
      description: description,
      detailedDescription: detailedDescription,
      contacts: contacts.map(contact => ({
        primaryContact: contact
      }))
    },
  });

  const onSubmit = (data: FormValues) => {
    onSave({
      description: data.description,
      detailedDescription: data.detailedDescription,
      contacts: data.contacts.map(c => c.primaryContact)
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {categoryName} Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brief Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="detailedDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[100px]" />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="space-y-4">
              {contacts.map((_, index) => (
                <div key={index} className="bg-muted/30 p-4 rounded-lg">
                  <ContactFields
                    form={form}
                    index={index}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}