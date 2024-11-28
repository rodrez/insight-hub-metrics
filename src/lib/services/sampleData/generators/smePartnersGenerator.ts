import { Collaborator } from '@/lib/types/collaboration';

const smeData = [
  {
    name: "Dr. Sarah Johnson",
    role: "AI Research Expert",
    department: "Artificial Intelligence",
    expertise: "Neural Network Optimization"
  },
  {
    name: "Prof. Michael Chen",
    role: "Quantum Computing Specialist",
    department: "Quantum Technologies",
    expertise: "Quantum Algorithm Development"
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Robotics Expert",
    department: "Robotics & Automation",
    expertise: "Autonomous Systems Integration"
  }
];

const generateSMEPartner = (id: number): Collaborator => {
  const sme = smeData[id % smeData.length];
  const [firstName, lastName] = sme.name.split(' ');

  return {
    id: `sme-${id + 1}`,
    name: sme.name,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@experts.com`,
    role: sme.role,
    department: sme.department,
    projects: [{
      id: `${sme.department.toLowerCase().replace(/\s+/g, '-')}-1`,
      name: sme.expertise,
      description: `Advanced research in ${sme.expertise.toLowerCase()}`
    }],
    lastActive: new Date().toISOString(),
    type: "sme",
    primaryContact: {
      name: sme.name,
      role: sme.role,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@experts.com`,
      phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`
    }
  };
};

export const generateSMEPartners = (): Collaborator[] => {
  return Array.from({ length: 3 }, (_, i) => generateSMEPartner(i));
};