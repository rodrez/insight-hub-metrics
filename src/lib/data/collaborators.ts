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
        description: 'Optimizing global supply chain operations',
        status: 'active'
      },
      {
        id: 'digital-transform',
        name: 'Digital Transformation',
        description: 'Implementing digital solutions',
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
        name: 'Cloud Migration',
        description: 'Enterprise cloud infrastructure',
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
        name: 'Mobile Solutions',
        description: 'Enterprise mobile solutions',
        status: 'completed'
      },
      {
        id: 'ai-ml',
        name: 'AI & Machine Learning',
        description: 'Advanced AI solutions',
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
  }
];