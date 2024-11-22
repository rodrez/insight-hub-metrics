import { Collaborator } from '../types/collaboration';

export const collaborators: Collaborator[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Project Lead',
    department: 'Airplanes',
    projects: ['Wing Design', 'Propulsion Systems'],
    lastActive: '2024-02-20'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    role: 'Research Engineer',
    department: 'Space',
    projects: ['Satellite Communications', 'Orbital Mechanics'],
    lastActive: '2024-02-19'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'm.chen@company.com',
    role: 'Systems Architect',
    department: 'IT',
    projects: ['Cloud Infrastructure', 'DevOps Pipeline'],
    lastActive: '2024-02-18'
  }
];