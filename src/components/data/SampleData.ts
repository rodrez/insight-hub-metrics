import { Collaborator } from "@/lib/types/collaboration";

export const sampleFortune30: Collaborator[] = [
  { 
    id: "walmart",
    name: "Walmart", 
    color: "#0071CE",
    email: "contact@walmart.com",
    role: "Strategic Partner",
    department: "Retail",
    projects: [
      {
        id: "supply-chain",
        name: "Supply Chain Optimization",
        description: "Optimizing global supply chain operations through advanced analytics and automation."
      },
      {
        id: "digital-transform",
        name: "Digital Transformation",
        description: "Implementing cutting-edge digital solutions across retail operations."
      }
    ],
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
    projects: [
      {
        id: "cloud-migration",
        name: "Cloud Migration",
        description: "Enterprise-wide migration to cloud infrastructure."
      },
      {
        id: "ai-integration",
        name: "AI Integration",
        description: "Integration of AI capabilities across business processes."
      }
    ],
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
    projects: [
      {
        id: "mobile-solutions",
        name: "Mobile Solutions",
        description: "Development of enterprise mobile solutions."
      },
      {
        id: "enterprise-integration",
        name: "Enterprise Integration",
        description: "Integration of Apple products into enterprise environments."
      }
    ],
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

export const sampleInternalPartners: Collaborator[] = [
  {
    id: "aerospace-1",
    name: "John Smith",
    email: "john.smith@company.com",
    role: "Lead Engineer",
    department: "Airplanes",
    projects: [
      {
        id: "wing-design",
        name: "Wing Design Optimization",
        description: "Optimizing wing designs for better aerodynamics"
      },
      {
        id: "fuel-efficiency",
        name: "Fuel Efficiency Project",
        description: "Improving aircraft fuel consumption"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other" as const
  },
  {
    id: "helicopter-1",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    role: "Project Manager",
    department: "Helicopters",
    projects: [
      {
        id: "rotor-system",
        name: "Rotor System Enhancement",
        description: "Enhancing helicopter rotor systems"
      },
      {
        id: "noise-reduction",
        name: "Noise Reduction Initiative",
        description: "Reducing helicopter noise levels"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other" as const
  },
  {
    id: "space-1",
    name: "Michael Chang",
    email: "m.chang@company.com",
    role: "Systems Architect",
    department: "Space",
    projects: [
      {
        id: "satellite-communications",
        name: "Satellite Communications",
        description: "Developing communication systems for satellites."
      },
      {
        id: "launch-systems",
        name: "Launch Systems",
        description: "Designing support systems for satellite launches."
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other" as const
  },
  {
    id: "energy-1",
    name: "Emma Wilson",
    email: "e.wilson@company.com",
    role: "Research Lead",
    department: "Energy",
    projects: [
      {
        id: "solar-panel",
        name: "Solar Panel Efficiency",
        description: "Improving the efficiency of solar panels."
      },
      {
        id: "battery-storage",
        name: "Battery Storage Solutions",
        description: "Developing effective battery storage systems."
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other" as const
  },
  {
    id: "it-1",
    name: "David Miller",
    email: "d.miller@company.com",
    role: "IT Director",
    department: "IT",
    projects: [
      {
        id: "cloud-migration",
        name: "Cloud Migration",
        description: "Transitioning to cloud infrastructure."
      },
      {
        id: "security-enhancement",
        name: "Security Enhancement",
        description: "Upgrading security systems and protocols."
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other" as const
  },
  {
    id: "techlab-1",
    name: "Lisa Chen",
    email: "l.chen@company.com",
    role: "Innovation Lead",
    department: "Tech Lab",
    projects: [
      {
        id: "ai-research",
        name: "AI Research",
        description: "Conducting research in artificial intelligence."
      },
      {
        id: "quantum-computing",
        name: "Quantum Computing Initiative",
        description: "Exploring quantum computing for future applications."
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other" as const
  }
];
