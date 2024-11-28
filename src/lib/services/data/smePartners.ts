import { Collaborator } from '@/lib/types/collaboration';

const generateSMEPartner = (id: number, today: Date): Collaborator => {
  const smeData = [
    {
      name: "NeuroSync AI",
      role: "AI Research & Development",
      department: "Artificial Intelligence",
      expertise: "Neural Network Optimization",
      contact: "Dr. Sarah Chen"
    },
    {
      name: "QuantumLeap Tech",
      role: "Quantum Computing Solutions",
      department: "Quantum Technologies",
      expertise: "Quantum Algorithm Development",
      contact: "Dr. Michael Zhang"
    },
    {
      name: "RoboFlow Dynamics",
      role: "Robotics Innovation",
      department: "Robotics & Automation",
      expertise: "Autonomous Systems Integration",
      contact: "Dr. Emily Rodriguez"
    },
    {
      name: "NanoMatter Labs",
      role: "Advanced Materials Research",
      department: "Advanced Materials",
      expertise: "Composite Materials Development",
      contact: "Dr. James Wilson"
    },
    {
      name: "AeroVolt Innovations",
      role: "Aerospace Technology",
      department: "Aerospace Engineering",
      expertise: "Propulsion Systems",
      contact: "Dr. Lisa Zhang"
    },
    {
      name: "SynergyTech Solutions",
      role: "Systems Engineering",
      department: "Systems Integration",
      expertise: "Complex Systems Architecture",
      contact: "Dr. Robert Kumar"
    },
    {
      name: "EcoGrid Ventures",
      role: "Sustainable Energy Solutions",
      department: "Sustainable Energy",
      expertise: "Renewable Energy Integration",
      contact: "Dr. Maria Garcia"
    },
    {
      name: "DataNova Analytics",
      role: "Data Science Solutions",
      department: "Data Analytics",
      expertise: "Machine Learning Applications",
      contact: "Dr. David Park"
    },
    {
      name: "CyberShield AI",
      role: "Cybersecurity Innovation",
      department: "Information Security",
      expertise: "Advanced Threat Detection",
      contact: "Dr. Anna Schmidt"
    },
    {
      name: "CloudMatrix Systems",
      role: "Software Architecture",
      department: "Software Engineering",
      expertise: "Distributed Systems",
      contact: "Dr. Thomas Brown"
    }
  ];

  const sme = smeData[id % smeData.length];
  const contactName = sme.contact.split(' ');
  const firstName = contactName[1];
  const lastName = contactName[0].replace('Dr. ', '');

  return {
    id: `sme-${id + 1}`,
    name: sme.name,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${sme.name.toLowerCase().replace(/\s+/g, '')}.com`,
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
      name: sme.contact,
      role: "Chief Technology Officer",
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${sme.name.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`
    }
  };
};

export const generateSMEPartners = (): Collaborator[] => {
  const today = new Date();
  return Array.from({ length: 10 }, (_, i) => generateSMEPartner(i, today));
};