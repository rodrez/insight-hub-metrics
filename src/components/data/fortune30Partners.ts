import { Collaborator } from "@/lib/types/collaboration";

export const fortune30Partners: Collaborator[] = [
  { 
    id: "boeing",
    name: "Boeing", 
    color: "#0039A6",
    email: "partnerships@boeing.com",
    role: "Strategic Partner",
    department: "Aerospace",
    projects: [
      {
        id: "next-gen-aircraft",
        name: "Next Generation Aircraft",
        description: "Development of sustainable aviation technologies"
      },
      {
        id: "defense-systems",
        name: "Defense Systems Integration",
        description: "Integration of advanced defense capabilities"
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
    id: "lockheed",
    name: "Lockheed Martin", 
    color: "#112B4A",
    email: "enterprise@lockheedmartin.com",
    role: "Defense Partner",
    department: "Defense Systems",
    projects: [
      {
        id: "space-systems",
        name: "Space Systems",
        description: "Advanced space exploration technologies"
      },
      {
        id: "missile-defense",
        name: "Missile Defense",
        description: "Next-generation missile defense systems"
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
    id: "northrop",
    name: "Northrop Grumman", 
    color: "#0075C9",
    email: "partnerships@northropgrumman.com",
    role: "Technology Partner",
    department: "Defense & Space",
    projects: [
      {
        id: "autonomous-systems",
        name: "Autonomous Systems",
        description: "Development of autonomous defense systems"
      },
      {
        id: "cyber-security",
        name: "Cyber Security",
        description: "Advanced cyber defense solutions"
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
  }
];