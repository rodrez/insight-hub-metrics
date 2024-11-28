import { Collaborator } from "@/lib/types/collaboration";

const generateFortune30Partner = (
  id: string,
  name: string,
  color: string,
  department: string
): Collaborator => ({
  id,
  name,
  color,
  email: `partnerships@${id}.com`,
  role: "Strategic Partner",
  department,
  projects: [{
    id: `${department.toLowerCase()}-project-1`,
    name: `${department} Innovation Project 1`,
    description: `Developing next-generation ${department.toLowerCase()} systems with improved efficiency.`,
    status: "active"
  }],
  lastActive: new Date().toISOString(),
  type: "fortune30",
  agreements: {
    nda: {
      signedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
      status: "signed"
    }
  }
});

export const generateFortune30Partners = (): Collaborator[] => [
  generateFortune30Partner("walmart", "Walmart", "#0071CE", "Retail"),
  generateFortune30Partner("amazon", "Amazon", "#FF9900", "Cloud Services"),
  generateFortune30Partner("apple", "Apple", "#555555", "Technology"),
  generateFortune30Partner("microsoft", "Microsoft", "#00A4EF", "Software"),
  generateFortune30Partner("google", "Google", "#4285F4", "Technology")
];