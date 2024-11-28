import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CollaborationFormSchema } from "../CollaborationFormFields";

type BasicInfoFieldsProps = {
  form: UseFormReturn<CollaborationFormSchema>;
  departmentId?: string;
};

export function BasicInfoFields({ form, departmentId }: BasicInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter company name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brand Color</FormLabel>
            <FormControl>
              <div className="flex gap-4 items-center">
                <Input 
                  type="color" 
                  {...field} 
                  value={field.value || "#000000"}
                  className="w-20 h-10 p-1"
                />
                <div 
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: field.value || "#000000" }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <FormControl>
              <Input placeholder="Enter role" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Department</FormLabel>
            <FormControl>
              <Input placeholder="Enter department" {...field} value={departmentId || field.value} readOnly={!!departmentId} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}