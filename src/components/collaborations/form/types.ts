import { z } from "zod";

export const contactPersonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
});

export const workstreamSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  objectives: z.string().min(1, "Objectives are required"),
  nextSteps: z.string().min(1, "Next steps are required"),
  keyContacts: z.array(contactPersonSchema),
  status: z.enum(["active", "completed", "on-hold"]),
  startDate: z.string(),
  lastUpdated: z.string(),
  ratMember: z.string().optional(),
  agreements: z.object({
    nda: z.object({
      signedDate: z.string(),
      expiryDate: z.string(),
      status: z.enum(["signed", "pending", "expired"])
    }).optional(),
    jtda: z.object({
      signedDate: z.string(),
      expiryDate: z.string(),
      status: z.enum(["signed", "pending", "expired"])
    }).optional()
  }).optional(),
});

export const collaborationFormSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  type: z.enum(["fortune30", "sme", "internal"]),
  color: z.string(),
  ratMember: z.string().optional(),
  agreementType: z.enum(["NDA", "JTDA", "Both", "None"]),
  signedDate: z.string().optional(),
  expiryDate: z.string().optional(),
  primaryContact: contactPersonSchema,
  workstreams: z.array(workstreamSchema).optional(),
});

export type CollaborationFormSchema = z.infer<typeof collaborationFormSchema>;