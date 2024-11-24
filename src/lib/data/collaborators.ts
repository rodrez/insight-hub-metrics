import { Collaborator } from '../types/collaboration';

export const collaborators: Collaborator[] = [
  {
    id: '1',
    name: 'Walmart',
    email: 'contact@walmart.com',
    role: 'Strategic Partner',
    department: 'Retail',
    projects: [
      {
        id: 'supply-chain',
        name: 'Supply Chain Optimization',
        description: 'Global supply chain efficiency improvements',
        status: 'active'
      },
      {
        id: 'digital-transform',
        name: 'Digital Transformation',
        description: 'Enterprise-wide digital transformation program',
        status: 'active'
      }
    ],
    lastActive: '2024-02-20',
    type: 'fortune30',
    color: '#0071CE',
    agreements: {
      nda: {
        signedDate: '2023-12-01',
        expiryDate: '2024-12-01',
        status: 'signed'
      },
      jtda: {
        signedDate: '2023-12-01',
        expiryDate: '2024-12-01',
        status: 'signed'
      }
    }
  },
  {
    id: '2',
    name: 'Amazon',
    email: 'partner@amazon.com',
    role: 'Technology Partner',
    department: 'Cloud Services',
    projects: [
      {
        id: 'cloud-migration',
        name: 'AWS Cloud Migration',
        description: 'Migration of core infrastructure to AWS',
        status: 'active'
      },
      {
        id: 'data-analytics',
        name: 'Data Analytics Platform',
        description: 'Advanced analytics and reporting solutions',
        status: 'active'
      }
    ],
    lastActive: '2024-02-19',
    type: 'fortune30',
    color: '#FF9900',
    agreements: {
      nda: {
        signedDate: '2023-06-01',
        expiryDate: '2024-06-01',
        status: 'pending'
      }
    }
  },
  {
    id: '3',
    name: 'Apple',
    email: 'enterprise@apple.com',
    role: 'Innovation Partner',
    department: 'Product Development',
    projects: [
      {
        id: 'mobile-solutions',
        name: 'iOS Enterprise Platform',
        description: 'Enterprise mobile application development',
        status: 'completed'
      },
      {
        id: 'device-management',
        name: 'Device Management System',
        description: 'Enterprise device management and security',
        status: 'active'
      }
    ],
    lastActive: '2024-02-18',
    type: 'fortune30',
    color: '#555555',
    agreements: {
      jtda: {
        signedDate: '2023-09-01',
        expiryDate: '2024-09-01',
        status: 'signed'
      }
    }
  },
  {
    id: '4',
    name: 'Microsoft',
    email: 'enterprise@microsoft.com',
    role: 'Technology Partner',
    department: 'Software',
    projects: [
      {
        id: 'azure-migration',
        name: 'Azure Cloud Integration',
        description: 'Enterprise cloud infrastructure modernization',
        status: 'active'
      },
      {
        id: 'ms365-integration',
        name: 'Microsoft 365 Integration',
        description: 'Enterprise productivity suite implementation',
        status: 'active'
      }
    ],
    lastActive: '2024-02-17',
    type: 'fortune30',
    color: '#00A4EF'
  },
  {
    id: '5',
    name: 'Google',
    email: 'enterprise@google.com',
    role: 'Technology Partner',
    department: 'Cloud & AI',
    projects: [
      {
        id: 'gcp-migration',
        name: 'GCP Migration',
        description: 'Cloud infrastructure migration to GCP',
        status: 'active'
      },
      {
        id: 'ai-ml-platform',
        name: 'AI/ML Platform Development',
        description: 'Enterprise AI and machine learning solutions',
        status: 'active'
      }
    ],
    lastActive: '2024-02-16',
    type: 'fortune30',
    color: '#4285F4'
  }
];