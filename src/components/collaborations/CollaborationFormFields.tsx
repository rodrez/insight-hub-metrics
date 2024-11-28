import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const contactPersonSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

const workstreamSchema = z.object({
  id: z.string(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  objectives: z.string().min(10, "Objectives must be at least 10 characters"),
  nextSteps: z.string().min(10, "Next steps must be at least 10 characters"),
  keyContacts: z.array(contactPersonSchema),
  status: z.enum(['active', 'completed', 'on-hold']),
  startDate: z.string(),
  lastUpdated: z.string(),
});

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  agreementType: z.enum(['NDA', 'JTDA', 'Both', 'None'] as const),
  signedDate: z.string().optional(),
  expiryDate: z.string().optional(),
  details: z.string().optional(),
  color: z.string().optional(),
  primaryContact: contactPersonSchema,
  workstreams: z.array(workstreamSchema).optional(),
});

export type CollaborationFormSchema = z.infer<typeof formSchema>;

type CollaborationFormFieldsProps = {
  form: UseFormReturn<CollaborationFormSchema>;
  departmentId?: string;
};

export const CollaborationFormFields = ({ form, departmentId }: CollaborationFormFieldsProps) => {
  const workstreams = form.watch('workstreams') || [];

  const addWorkstream = () => {
    const newWorkstream = {
      id: crypto.randomUUID(),
      title: '',
      objectives: '',
      nextSteps: '',
      keyContacts: [],
      status: 'active' as const,
      startDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString(),
    };
    form.setValue('workstreams', [...workstreams, newWorkstream]);
  };

  const removeWorkstream = (index: number) => {
    const updatedWorkstreams = workstreams.filter((_, i) => i !== index);
    form.setValue('workstreams', updatedWorkstreams);
  };

  return (
    <>
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

      <Card>
        <CardHeader>
          <CardTitle>Primary Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="primaryContact.name"
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
            name="primaryContact.role"
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
            name="primaryContact.email"
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
            name="primaryContact.phone"
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
        </CardContent>
      </Card>

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

      <FormField
        control={form.control}
        name="agreementType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agreement Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select agreement type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="NDA">NDA</SelectItem>
                <SelectItem value="JTDA">JTDA</SelectItem>
                <SelectItem value="Both">Both (NDA & JTDA)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="signedDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date Signed</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expiryDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expiry Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Workstreams</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addWorkstream}>
            <Plus className="h-4 w-4 mr-2" />
            Add Workstream
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {workstreams.map((workstream, index) => (
            <Card key={workstream.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Workstream {index + 1}</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWorkstream(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`workstreams.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter workstream title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`workstreams.${index}.objectives`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objectives</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter workstream objectives"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`workstreams.${index}.nextSteps`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next Steps</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter next steps"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`workstreams.${index}.status`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <FormField
        control={form.control}
        name="details"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Details</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter any additional details about the collaboration"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export { formSchema };