import { Collaborator } from "@/lib/types/collaboration";

export const fortune30Partners: Collaborator[] = [
  { 
    id: "walmart",
    name: "Walmart", 
    color: "#0071CE",
    email: "partnerships@walmart.com",
    role: "Strategic Partner",
    department: "Retail",
    projects: [
      {
        id: "supply-chain",
        name: "Supply Chain Optimization",
        description: "Optimizing global supply chain operations"
      },
      {
        id: "digital-transform",
        name: "Digital Transformation",
        description: "Implementing digital solutions"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "fortune30",
    agreements: {
      nda: {
        signedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
        status: "signed"
      }
    }
  },
  { 
    id: "amazon",
    name: "Amazon", 
    color: "#FF9900",
    email: "enterprise@amazon.com",
    role: "Technology Partner",
    department: "Cloud Services",
    projects: [
      {
        id: "cloud-migration",
        name: "Cloud Migration",
        description: "Enterprise cloud infrastructure"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "fortune30",
    agreements: {
      nda: {
        signedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(),
        status: "signed"
      }
    }
  },
  { 
    id: "apple",
    name: "Apple", 
    color: "#555555",
    email: "partnerships@apple.com",
    role: "Innovation Partner",
    department: "Technology",
    projects: [
      {
        id: "mobile-solutions",
        name: "Mobile Solutions",
        description: "Enterprise mobile solutions"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "fortune30",
    agreements: {
      jtda: {
        signedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000).toISOString(),
        status: "signed"
      }
    }
  },
  { 
    id: "microsoft",
    name: "Microsoft", 
    color: "#00A4EF",
    email: "enterprise@microsoft.com",
    role: "Technology Partner",
    department: "Software",
    projects: [
      {
        id: "cloud-services",
        name: "Cloud Services",
        description: "Enterprise cloud solutions"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "fortune30",
    agreements: {
      nda: {
        signedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000).toISOString(),
        status: "signed"
      }
    }
  },
  { 
    id: "google",
    name: "Google", 
    color: "#4285F4",
    email: "partnerships@google.com",
    role: "Technology Partner",
    department: "Technology",
    projects: [
      {
        id: "ai-ml",
        name: "AI & Machine Learning",
        description: "Advanced AI solutions"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "fortune30",
    agreements: {
      jtda: {
        signedDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString(),
        status: "signed"
      }
    }
  }
];