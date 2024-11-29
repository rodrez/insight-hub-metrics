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

type POCEditDialogProps = {
  categoryName: string;
  contacts: ContactPerson[];
  onSave: (contacts: ContactPerson[]) => void;
};

type FormValues = {
  lobName: string;
  contacts: {
    primaryContact: ContactPerson;
  }[];
};

export function POCEditDialog({ categoryName, contacts, onSave }: POCEditDialogProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      lobName: categoryName,
      contacts: contacts.map(contact => ({
        primaryContact: contact
      }))
    },
  });

  const onSubmit = (data: FormValues) => {
    onSave(data.contacts.map(c => c.primaryContact));
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
              name="lobName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Line of Business Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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