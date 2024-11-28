import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ContactFields } from "./form/ContactFields";
import { AgreementFields } from "./form/AgreementFields";
import { WorkstreamFields } from "./form/WorkstreamFields";
import { CollaborationType } from "@/lib/types";
import { validateEmail } from "@/lib/utils/validation";

const contactPersonSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  email: z.string().email("Invalid email address").refine(validateEmail, "Invalid email format"),
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

export const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").refine(validateEmail, "Invalid email format"),
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

export type CollaborationFormFieldsProps = {
  form: UseFormReturn<CollaborationFormSchema>;
  departmentId?: string;
  collaboratorId?: string | null;
  collaborationType?: CollaborationType;
  onSuccess?: () => void;
};

export const CollaborationFormFields = ({ 
  form, 
  departmentId,
  collaboratorId,
  collaborationType = 'fortune30',
  onSuccess 
}: CollaborationFormFieldsProps) => {
  return (
    <div className="space-y-8">
      <BasicInfoFields form={form} departmentId={departmentId} />
      <ContactFields form={form} />
      <AgreementFields form={form} />
      <WorkstreamFields form={form} />
    </div>
  );
};