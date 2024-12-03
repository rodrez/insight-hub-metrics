import { Collaborator } from "@/lib/types/collaboration";
import { getAllRatMembers } from "@/lib/services/data/utils/ratMemberUtils";

const ratMembers = getAllRatMembers();

export const fortune30Partners: Collaborator[] = [
  { 
    id: "walmart",
    name: "Walmart", 
    color: "#0071CE",
    email: "partnerships@walmart.com",
    role: "Strategic Partner",
    department: "Retail",
    ratMember: "Sarah Johnson", // Retail expertise
    primaryContact: {
      name: "John Smith",
      role: "Director of Innovation",
      email: "john.smith@walmart.com",
      phone: "+1 (555) 123-4567"
    },
    projects: [
      {
        id: "retail-project-1",
        name: "Retail Innovation Project 1",
        description: "Developing next-generation retail systems with improved efficiency and reduced environmental impact.",
        status: "active"
      }
    ],
    workstreams: [
      {
        id: "ws-1",
        title: "Supply Chain Optimization",
        objectives: "Improve supply chain efficiency through AI and automation",
        nextSteps: "Implement pilot program in selected distribution centers",
        keyContacts: [
          {
            name: "Sarah Johnson",
            role: "Supply Chain Manager",
            email: "sarah.j@walmart.com"
          }
        ],
        status: "active",
        startDate: "2024-01-15",
        lastUpdated: "2024-03-20"
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
    ratMember: "Michael Chen", // Cloud/Tech expertise
    primaryContact: {
      name: "Emily Chen",
      role: "Head of Strategic Partnerships",
      email: "emily.chen@amazon.com",
      phone: "+1 (555) 987-6543"
    },
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
    ratMember: "Emily Rodriguez", // Innovation/Product expertise
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
    ratMember: "David Kim", // Software/Enterprise expertise
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
    ratMember: "James Wilson", // AI/ML expertise
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