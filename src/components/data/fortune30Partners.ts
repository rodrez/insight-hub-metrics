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
        id: "retail-project-1",
        name: "Retail Innovation Project 1",
        description: "Developing next-generation retail systems with improved efficiency and reduced environmental impact.",
        status: "active"
      },
      {
        id: "retail-project-2",
        name: "Retail Innovation Project 2",
        description: "Implementing advanced technologies and innovative solutions for retail operations.",
        status: "active"
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
        id: "cloud-services-project-1",
        name: "Cloud Services Innovation Project 1",
        description: "Developing next-generation cloud systems with improved efficiency and scalability.",
        status: "active"
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
        id: "technology-project-1",
        name: "Technology Innovation Project 1",
        description: "Developing next-generation technology systems with improved user experience.",
        status: "active"
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
        id: "software-project-1",
        name: "Software Innovation Project 1",
        description: "Developing next-generation software systems with improved performance.",
        status: "active"
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
        id: "technology-project-2",
        name: "Technology Innovation Project 2",
        description: "Developing next-generation AI and ML systems with improved accuracy.",
        status: "active"
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
