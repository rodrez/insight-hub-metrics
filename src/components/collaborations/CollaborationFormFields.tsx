import * as z from "zod";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { AgreementFields } from "./form/AgreementFields";
import { ContactFields } from "./form/ContactFields";
import { WorkstreamFields } from "./form/WorkstreamFields";
import { Button } from "@/components/ui/button";
import { Collaborator } from "@/lib/types/collaboration";
import { db } from "@/lib/db";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";

export const collaborationFormSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  type: z.enum(["fortune30", "sme"]),
  color: z.string(),
  ratMember: z.string().optional(),
  agreementType: z.enum(["NDA", "JTDA", "Both", "None"]),
  primaryContact: z.object({
    name: z.string(),
    role: z.string(),
    email: z.string(),
    phone: z.string().optional(),
  }),
});

export type CollaborationFormSchema = z.infer<typeof collaborationFormSchema>;

interface CollaborationFormFieldsProps {
  onSubmit: () => void;
  initialData: Collaborator | null;
  collaborationType?: "fortune30" | "sme";
  departmentId?: string;
}

export function CollaborationFormFields({
  onSubmit,
  initialData,
  collaborationType = "fortune30",
  departmentId,
}: CollaborationFormFieldsProps) {
  const form = useForm<CollaborationFormSchema>({
    resolver: zodResolver(collaborationFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      role: initialData?.role || "",
      department: departmentId || initialData?.department || "",
      type: collaborationType,
      color: initialData?.color || "#4B5563",
      ratMember: initialData?.ratMember || "",
      agreementType: initialData?.agreements?.nda
        ? initialData?.agreements?.jtda
          ? "Both"
          : "NDA"
        : initialData?.agreements?.jtda
        ? "JTDA"
        : "None",
      primaryContact: initialData?.primaryContact || {
        name: "",
        role: "",
        email: "",
      },
    },
  });

  const handleSubmit = async (data: CollaborationFormSchema) => {
    try {
      const agreements = {
        ...(data.agreementType === "NDA" || data.agreementType === "Both"
          ? {
              nda: {
                signedDate: new Date().toISOString(),
                expiryDate: new Date(
                  Date.now() + 365 * 24 * 60 * 60 * 1000
                ).toISOString(),
                status: "signed" as const,
              },
            }
          : {}),
        ...(data.agreementType === "JTDA" || data.agreementType === "Both"
          ? {
              jtda: {
                signedDate: new Date().toISOString(),
                expiryDate: new Date(
                  Date.now() + 365 * 24 * 60 * 60 * 1000
                ).toISOString(),
                status: "signed" as const,
              },
            }
          : {}),
      };

      const collaborator: Collaborator = {
        id: initialData?.id || `collaborator-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        type: data.type,
        color: data.color,
        ratMember: data.ratMember,
        agreements,
        primaryContact: data.primaryContact,
        projects: initialData?.projects || [],
        lastActive: new Date().toISOString(),
      };

      if (initialData?.id) {
        await db.updateCollaborator(initialData.id, collaborator);
      } else {
        await db.addCollaborator(collaborator);
      }

      toast({
        title: "Success",
        description: `Collaboration ${initialData ? "updated" : "created"} successfully`,
      });

      onSubmit();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? "update" : "create"} collaboration`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <BasicInfoFields form={form} departmentId={departmentId} />
      <AgreementFields form={form} />
      <ContactFields form={form} />
      <WorkstreamFields form={form} />

      <div className="flex justify-end">
        <Button onClick={form.handleSubmit(handleSubmit)}>
          {initialData ? "Update" : "Create"} Collaboration
        </Button>
      </div>
    </div>
  );
}