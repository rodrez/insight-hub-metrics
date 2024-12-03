import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CollaborationFormSchema, collaborationFormSchema } from "./types";
import { Collaborator } from "@/lib/types/collaboration";

export const useCollaborationForm = (initialData: Collaborator | null) => {
  return useForm<CollaborationFormSchema>({
    resolver: zodResolver(collaborationFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      role: initialData?.role || "",
      department: initialData?.department || "",
      type: initialData?.type || "fortune30",
      color: initialData?.color || "#4B5563",
      ratMember: initialData?.ratMember || "",
      agreementType: initialData?.agreements?.nda
        ? initialData?.agreements?.jtda
          ? "Both"
          : "NDA"
        : initialData?.agreements?.jtda
        ? "JTDA"
        : "None",
      signedDate: initialData?.agreements?.nda?.signedDate || initialData?.agreements?.jtda?.signedDate || "",
      expiryDate: initialData?.agreements?.nda?.expiryDate || initialData?.agreements?.jtda?.expiryDate || "",
      primaryContact: {
        name: initialData?.primaryContact?.name || "",
        role: initialData?.primaryContact?.role || "",
        email: initialData?.primaryContact?.email || "",
        phone: initialData?.primaryContact?.phone || "",
      },
      workstreams: initialData?.workstreams?.map(ws => ({
        id: ws.id,
        title: ws.title,
        objectives: ws.objectives,
        nextSteps: ws.nextSteps,
        keyContacts: ws.keyContacts.map(contact => ({
          name: contact.name,
          role: contact.role,
          email: contact.email,
          phone: contact.phone || "",
        })),
        status: ws.status,
        startDate: ws.startDate,
        lastUpdated: ws.lastUpdated,
        ratMember: ws.ratMember || "",
        agreements: ws.agreements
      })) || [],
    },
  });
};