import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ContactFields } from "./form/ContactFields";
import { AgreementFields } from "./form/AgreementFields";
import { WorkstreamFields } from "./form/WorkstreamFields";
import { Button } from "@/components/ui/button";
import { Collaborator } from "@/lib/types/collaboration";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

const collaborationFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  type: z.enum(["fortune30", "sme"]),
  department: z.string().optional(),
  associatedProjects: z.array(z.string()).optional(),
  // Add other fields as necessary
});

type CollaborationFormSchema = z.infer<typeof collaborationFormSchema>;

type CollaborationFormFieldsProps = {
  onSubmit: (data: CollaborationFormSchema) => void;
  initialData?: Collaborator;
  collaborationType?: "fortune30" | "sme";
  departmentId?: string;
};

export function CollaborationFormFields({ 
  onSubmit, 
  initialData,
  collaborationType = 'fortune30',
  departmentId 
}: CollaborationFormFieldsProps) {
  const form = useForm<CollaborationFormSchema>({
    resolver: zodResolver(collaborationFormSchema),
    defaultValues: initialData || {
      type: collaborationType,
      department: departmentId || '',
    }
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects(),
    enabled: collaborationType === 'sme'
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicInfoFields form={form} departmentId={departmentId} />
        <ContactFields form={form} />
        
        {collaborationType === 'fortune30' && (
          <AgreementFields form={form} />
        )}

        {collaborationType === 'sme' && (
          <FormField
            control={form.control}
            name="associatedProjects"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Associated Projects</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        )}

        <WorkstreamFields form={form} />
        
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
