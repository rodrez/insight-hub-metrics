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
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const collaborationFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  type: z.enum(["fortune30", "sme", "internal"]),
  department: z.string().optional(),
  associatedProjects: z.array(z.string()).optional(),
  role: z.string().optional(),
  color: z.string().optional(),
  agreementType: z.enum(["None", "NDA", "JTDA", "Both"]).optional(),
  signedDate: z.string().optional(),
  expiryDate: z.string().optional(),
  primaryContact: z.object({
    name: z.string().optional(),
    role: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional()
  }).optional(),
  workstreams: z.array(z.object({
    id: z.string(),
    title: z.string(),
    objectives: z.string(),
    nextSteps: z.string(),
    keyContacts: z.array(z.object({
      name: z.string(),
      role: z.string(),
      email: z.string(),
      phone: z.string().optional()
    })),
    status: z.enum(["active", "completed", "on-hold"]),
    startDate: z.string(),
    lastUpdated: z.string()
  })).optional()
});

export type CollaborationFormSchema = z.infer<typeof collaborationFormSchema>;

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
    defaultValues: {
      type: collaborationType,
      department: departmentId || '',
      color: initialData?.color || '#4B5563',
      ...initialData
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
        
        {collaborationType === 'fortune30' && (
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Color</FormLabel>
                <div className="flex gap-4 items-center">
                  <FormControl>
                    <Input
                      type="color"
                      {...field}
                      className="w-20 h-10"
                    />
                  </FormControl>
                  <div 
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: field.value }}
                  />
                </div>
              </FormItem>
            )}
          />
        )}

        <ContactFields form={form} index={0} />
        
        {/* Show AgreementFields for both Fortune 30 and SME partners */}
        <AgreementFields form={form} />

        {collaborationType === 'sme' && (
          <FormField
            control={form.control}
            name="associatedProjects"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Associated Projects</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange([value])}
                  value={field.value?.[0]}
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
