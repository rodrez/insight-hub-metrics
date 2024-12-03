import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { WorkstreamFields } from "../form/WorkstreamFields";
import { UseFormReturn } from "react-hook-form";
import { CollaborationFormSchema } from "../form/types";

type WorkstreamFormProps = {
  form: UseFormReturn<CollaborationFormSchema>;
  onSubmit: (data: CollaborationFormSchema) => Promise<void>;
};

export function WorkstreamForm({ form, onSubmit }: WorkstreamFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <WorkstreamFields form={form} />
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
