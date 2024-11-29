import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

type ContactFieldsProps = {
  form: UseFormReturn<any>;
  index: number;
};

export function ContactFields({ form, index }: ContactFieldsProps) {
  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name={`contacts.${index}.primaryContact.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter contact name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`contacts.${index}.primaryContact.role`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Role</FormLabel>
            <FormControl>
              <Input placeholder="Enter contact role" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`contacts.${index}.primaryContact.email`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email</FormLabel>
            <FormControl>
              <Input placeholder="Enter contact email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`contacts.${index}.primaryContact.phone`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Phone (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter contact phone" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}