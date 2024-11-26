import { Collaborator } from "@/lib/types/collaboration";

export const generateFortune30Partners = (): Collaborator[] => {
  const today = new Date();
  const nearExpiryDate = new Date(today.getTime() + (60 * 24 * 60 * 60 * 1000)); // 60 days from now
  const veryNearExpiryDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now

  return [
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
          description: "Optimizing global supply chain operations through advanced analytics."
        },
        {
          id: "digital-transform",
          name: "Digital Transformation",
          description: "Implementing cutting-edge digital solutions."
        }
      ],
      lastActive: new Date().toISOString(),
      type: "fortune30",
      agreements: {
        nda: {
          signedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: nearExpiryDate.toISOString(),
          status: "signed"
        },
        jtda: {
          signedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(),
          status: "signed"
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
      type: "fortune30",
      agreements: {
        nda: {
          signedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: veryNearExpiryDate.toISOString(),
          status: "signed"
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
      type: "fortune30",
      agreements: {
        jtda: {
          signedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: nearExpiryDate.toISOString(),
          status: "signed"
        }
      }
    },
    { 
      id: "microsoft",
      name: "Microsoft", 
      color: "#F25022",
      email: "contact@microsoft.com",
      role: "Software Partner",
      department: "Software Development",
      projects: [
        {
          id: "azure-services",
          name: "Azure Cloud Services",
          description: "Providing cloud solutions on Azure platform."
        }
      ],
      lastActive: new Date().toISOString(),
      type: "fortune30",
      agreements: {
        nda: {
          signedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: veryNearExpiryDate.toISOString(),
          status: "signed"
        }
      }
    },
    { 
      id: "google",
      name: "Google", 
      color: "#4285F4",
      email: "contact@google.com",
      role: "Internet Partner",
      department: "Internet Services",
      projects: [
        {
          id: "ads-platform",
          name: "Ad Platforms",
          description: "Managing and optimizing advertisement platforms."
        }
      ],
      lastActive: new Date().toISOString(),
      type: "fortune30",
      agreements: {
        jtda: {
          signedDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        }
      }
    }
  ];
};