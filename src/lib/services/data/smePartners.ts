import { Collaborator } from '@/lib/types/collaboration';

const generateSMEPartner = (id: number, today: Date): Collaborator => {
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
    },
    {
      name: "Dr. James Wilson",
      role: "Materials Science Expert",
      department: "Advanced Materials",
      expertise: "Composite Materials Development"
    },
    {
      name: "Prof. Lisa Zhang",
      role: "Aerospace Specialist",
      department: "Aerospace Engineering",
      expertise: "Propulsion Systems"
    },
    {
      name: "Dr. Robert Kumar",
      role: "Systems Engineering Expert",
      department: "Systems Integration",
      expertise: "Complex Systems Architecture"
    },
    {
      name: "Prof. Maria Garcia",
      role: "Energy Systems Expert",
      department: "Sustainable Energy",
      expertise: "Renewable Energy Integration"
    },
    {
      name: "Dr. David Park",
      role: "Data Science Expert",
      department: "Data Analytics",
      expertise: "Machine Learning Applications"
    },
    {
      name: "Prof. Anna Schmidt",
      role: "Cybersecurity Specialist",
      department: "Information Security",
      expertise: "Advanced Threat Detection"
    },
    {
      name: "Dr. Thomas Brown",
      role: "Software Architecture Expert",
      department: "Software Engineering",
      expertise: "Distributed Systems"
    }
  ];

  const sme = smeData[id % smeData.length];
  const firstName = sme.name.split(' ')[0];
  const lastName = sme.name.split(' ')[1];

  return {
    id: `sme-${id + 1}`,
    name: sme.name,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@experts.com`,
    role: sme.role,
    department: sme.department,
    projects: [
      {
        id: `${sme.department.toLowerCase().replace(/\s+/g, '-')}-1`,
        name: sme.expertise,
        description: `Advanced research in ${sme.expertise.toLowerCase()}`
      }
    ],
    lastActive: today.toISOString(),
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
  const today = new Date();
  return Array.from({ length: 10 }, (_, i) => generateSMEPartner(i, today));
};