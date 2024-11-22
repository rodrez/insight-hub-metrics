import { Collaborator } from "@/lib/types/collaboration";

export const sampleFortune30 = [
  { 
    id: "walmart",
    name: "Walmart", 
    color: "#0071CE",
    email: "contact@walmart.com",
    role: "Strategic Partner",
    department: "Retail",
    projects: ["Supply Chain Optimization", "Digital Transformation"],
    lastActive: new Date().toISOString(),
    type: "fortune30" as const,
    agreements: {
      nda: {
        signedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
        status: "signed" as const
      },
      jtda: {
        signedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(),
        status: "signed" as const
      }
    }
  },
  { 
    id: "amazon",
    name: "Amazon", 
    color: "#FF9900",
    email: "partner@amazon.com",
    role: "Technology Partner",
    department: "Cloud Services",
    projects: ["Cloud Migration", "AI Integration"],
    lastActive: new Date().toISOString(),
    type: "fortune30" as const,
    agreements: {
      nda: {
        signedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(),
        status: "signed" as const
      }
    }
  },
  { 
    id: "apple",
    name: "Apple", 
    color: "#555555",
    email: "enterprise@apple.com",
    role: "Innovation Partner",
    department: "Product Development",
    projects: ["Mobile Solutions", "Enterprise Integration"],
    lastActive: new Date().toISOString(),
    type: "fortune30" as const,
    agreements: {
      jtda: {
        signedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000).toISOString(),
        status: "signed" as const
      }
    }
  }
];

export const sampleInternalPartners = [
  {
    id: "aerospace-1",
    name: "John Smith",
    email: "john.smith@company.com",
    role: "Lead Engineer",
    department: "Airplanes",
    projects: ["Wing Design Optimization", "Fuel Efficiency Project"],
    lastActive: new Date().toISOString(),
    type: "other" as const
  },
  {
    id: "helicopter-1",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    role: "Project Manager",
    department: "Helicopters",
    projects: ["Rotor System Enhancement", "Noise Reduction Initiative"],
    lastActive: new Date().toISOString(),
    type: "other" as const
  },
  {
    id: "space-1",
    name: "Michael Chang",
    email: "m.chang@company.com",
    role: "Systems Architect",
    department: "Space",
    projects: ["Satellite Communications", "Launch Systems"],
    lastActive: new Date().toISOString(),
    type: "other" as const
  },
  {
    id: "energy-1",
    name: "Emma Wilson",
    email: "e.wilson@company.com",
    role: "Research Lead",
    department: "Energy",
    projects: ["Solar Panel Efficiency", "Battery Storage Solutions"],
    lastActive: new Date().toISOString(),
    type: "other" as const
  },
  {
    id: "it-1",
    name: "David Miller",
    email: "d.miller@company.com",
    role: "IT Director",
    department: "IT",
    projects: ["Cloud Migration", "Security Enhancement"],
    lastActive: new Date().toISOString(),
    type: "other" as const
  },
  {
    id: "techlab-1",
    name: "Lisa Chen",
    email: "l.chen@company.com",
    role: "Innovation Lead",
    department: "Tech Lab",
    projects: ["AI Research", "Quantum Computing Initiative"],
    lastActive: new Date().toISOString(),
    type: "other" as const
  }
];
