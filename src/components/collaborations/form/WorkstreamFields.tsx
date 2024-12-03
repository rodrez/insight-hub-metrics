import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CollaborationFormSchema } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// RAT Members from the org chart
const ratMembers = [
  "Sarah Johnson",
  "Michael Chen",
  "Emily Rodriguez",
  "David Kim",
  "James Wilson",
  "Maria Garcia",
  "Robert Taylor"
];

type WorkstreamFieldsProps = {
  form: UseFormReturn<CollaborationFormSchema>;
};

export function WorkstreamFields({ form }: WorkstreamFieldsProps) {
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
      ratMember: ''
    };
    form.setValue('workstreams', [...workstreams, newWorkstream]);
  };

  const removeWorkstream = (index: number) => {
    const updatedWorkstreams = workstreams.filter((_, i) => i !== index);
    form.setValue('workstreams', updatedWorkstreams);
  };

  return (
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
                name={`workstreams.${index}.ratMember`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RAT Member</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select RAT member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ratMembers.map((member) => (
                          <SelectItem key={member} value={member}>
                            {member}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
  );
}