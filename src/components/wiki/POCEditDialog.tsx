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

type POCEditDialogProps = {
  categoryName: string;
  contacts: ContactPerson[];
  onSave: (contacts: ContactPerson[]) => void;
};

type FormValues = {
  contacts: {
    primaryContact: ContactPerson;
  }[];
};

export function POCEditDialog({ categoryName, contacts, onSave }: POCEditDialogProps) {
  const form = useForm<FormValues>({
    defaultValues: {
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {categoryName} Contacts</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {contacts.map((_, index) => (
              <ContactFields
                key={index}
                form={form}
                index={index}
              />
            ))}
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}