import { Collaborator } from '../types/collaboration';

export const collaborators: Collaborator[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Project Lead',
    department: 'Airplanes',
    projects: ['Wing Design', 'Propulsion Systems'],
    lastActive: '2024-02-20',
    type: 'fortune30',
    color: '#0071CE',
    primaryContact: {
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567'
    },
    agreements: {
      type: 'Both',
      signedDate: '2023-12-01',
      expiryDate: '2024-12-01',
      status: 'signed'
    }
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    role: 'Research Engineer',
    department: 'Space',
    projects: ['Satellite Communications', 'Orbital Mechanics'],
    lastActive: '2024-02-19',
    type: 'other',
    agreements: {
      type: 'NDA',
      signedDate: '2023-06-01',
      expiryDate: '2024-06-01',
      status: 'pending'
    }
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'm.chen@company.com',
    role: 'Systems Architect',
    department: 'IT',
    projects: ['Cloud Infrastructure', 'DevOps Pipeline'],
    lastActive: '2024-02-18',
    type: 'fortune30',
    color: '#FF9900',
    agreements: {
      type: 'JTDA',
      signedDate: '2023-09-01',
      expiryDate: '2024-09-01',
      status: 'expired'
    }
  }
];