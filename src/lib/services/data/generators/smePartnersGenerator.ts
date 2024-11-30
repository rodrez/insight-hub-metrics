import { Collaborator } from '@/lib/types/collaboration';

const smeCompanies = [
  {
    name: "InnoTech Solutions",
    role: "Software Development",
    department: "Technology",
    expertise: "Custom Software Solutions",
    contact: "Sarah Chen"
  },
  {
    name: "DataFlow Analytics",
    role: "Data Analytics",
    department: "Analytics",
    expertise: "Business Intelligence",
    contact: "Michael Zhang"
  },
  {
    name: "CloudScale Systems",
    role: "Cloud Services",
    department: "Infrastructure",
    expertise: "Cloud Migration",
    contact: "Emily Rodriguez"
  },
  {
    name: "SecureNet Solutions",
    role: "Cybersecurity",
    department: "Security",
    expertise: "Network Security",
    contact: "James Wilson"
  },
  {
    name: "AgileWorks Consulting",
    role: "Project Management",
    department: "Consulting",
    expertise: "Agile Transformation",
    contact: "Lisa Park"
  },
  {
    name: "DevOps Accelerate",
    role: "DevOps Services",
    department: "Operations",
    expertise: "CI/CD Implementation",
    contact: "Robert Kumar"
  },
  {
    name: "Digital Edge Solutions",
    role: "Digital Marketing",
    department: "Marketing",
    expertise: "Digital Transformation",
    contact: "Maria Garcia"
  },
  {
    name: "TechGrowth Partners",
    role: "IT Consulting",
    department: "Consulting",
    expertise: "Technology Strategy",
    contact: "David Park"
  },
  {
    name: "SmartStack Tech",
    role: "Full Stack Development",
    department: "Development",
    expertise: "Web Applications",
    contact: "Anna Schmidt"
  },
  {
    name: "AInnova Labs",
    role: "AI Solutions",
    department: "Technology",
    expertise: "Machine Learning",
    contact: "Thomas Brown"
  }
];

// Predefined brand colors for SMEs
const brandColors = [
  '#4A90E2', // Blue
  '#50C878', // Green
  '#9B59B6', // Purple
  '#E67E22', // Orange
  '#E74C3C', // Red
  '#1ABC9C', // Turquoise
  '#34495E', // Navy
  '#27AE60', // Emerald
  '#8E44AD', // Violet
  '#D35400'  // Burnt Orange
];

export const generateSMEPartners = (): Collaborator[] => {
  const today = new Date();
  
  return smeCompanies.map((company, index) => {
    const contactName = company.contact.split(' ');
    const firstName = contactName[0];
    const lastName = contactName[1];

    return {
      id: `sme-${index + 1}`,
      name: company.name,
      color: brandColors[index % brandColors.length],
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
      role: company.role,
      department: company.department,
      projects: [
        {
          id: `${company.department.toLowerCase().replace(/\s+/g, '-')}-1`,
          name: company.expertise,
          description: `Specialized in ${company.expertise.toLowerCase()}`,
          status: "active"
        }
      ],
      lastActive: today.toISOString(),
      type: "sme",
      primaryContact: {
        name: company.contact,
        role: "Chief Technology Officer",
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`
      }
    };
  });
};