import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  phone: z.string().optional(),
  department: z.string().min(1, "Department is required"),
});

export const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  poc: z.string().min(1, "Point of contact is required"),
  pocDepartment: z.string().min(1, "POC department is required"),
  techLead: z.string().min(1, "Tech lead is required"),
  techLeadDepartment: z.string().min(1, "Tech lead department is required"),
  budget: z.string().min(1, "Budget is required"),
  ratMember: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;